package fun.demoncoremc.deliverybridge;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.bukkit.Bukkit;
import org.bukkit.ChatColor;
import org.bukkit.entity.Player;
import org.bukkit.plugin.java.JavaPlugin;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.Properties;

/**
 * Polls the DEMONCORE MC website every `poll-interval-seconds` for orders
 * that have been paid but not yet delivered, runs each one's resolved
 * console command (set per-item in the admin panel), then acks it back so
 * it isn't delivered twice. One instance of this runs per gamemode server
 * (survival, lifesteal) — each configured with its own `server-key`.
 *
 * Also announces the purchase: a server-wide broadcast, plus a title/
 * subtitle shown to the buyer if they're online — both fully editable in
 * config.properties.
 */
public class DemonCoreDeliveryBridge extends JavaPlugin {

    private final HttpClient http = HttpClient.newHttpClient();

    private String apiUrl;
    private String apiKey;
    private String serverKey;
    private int intervalSeconds;

    private boolean broadcastEnabled;
    private String broadcastMessage;
    private boolean titleEnabled;
    private String titleText;
    private String subtitleText;
    private int titleFadeIn;
    private int titleStay;
    private int titleFadeOut;

    @Override
    public void onEnable() {
        loadConfig();
        if (apiUrl.isBlank() || apiKey.isBlank() || apiUrl.contains("your-domain.example")) {
            getLogger().warning("DemonCoreDeliveryBridge is not configured yet — edit config.properties in the plugin data folder.");
            return;
        }

        Bukkit.getScheduler().runTaskTimerAsynchronously(this, this::pollDeliveries, 40L, intervalSeconds * 20L);
        getLogger().info("DemonCoreDeliveryBridge started for server '" + serverKey + "' — polling " + apiUrl + " every " + intervalSeconds + "s");
    }

    private void loadConfig() {
        Properties props = new Properties();
        Path configFile = getDataFolder().toPath().resolve("config.properties");
        try {
            Files.createDirectories(getDataFolder().toPath());
            if (!Files.exists(configFile)) {
                props.setProperty("api-url", "https://your-domain.example/api/plugin");
                props.setProperty("api-key", "change-me-to-match-PLUGIN_API_KEY");
                props.setProperty("server-key", "survival");
                props.setProperty("poll-interval-seconds", "10");
                props.setProperty("broadcast-enabled", "true");
                props.setProperty("broadcast-message", "&6{player} &fjust purchased &6{item}&f! Thank you for supporting the server!");
                props.setProperty("title-enabled", "true");
                props.setProperty("title-text", "&6&lTHANK YOU!");
                props.setProperty("subtitle-text", "&fYou received: &6{item}");
                props.setProperty("title-fade-in", "10");
                props.setProperty("title-stay", "60");
                props.setProperty("title-fade-out", "10");
                try (OutputStream out = Files.newOutputStream(configFile)) {
                    props.store(out, "DemonCoreDeliveryBridge config");
                }
                getLogger().warning("Created default config.properties at " + configFile + " — edit it, then restart the server.");
            }
            try (InputStream in = Files.newInputStream(configFile)) {
                props.load(in);
            }
        } catch (IOException e) {
            getLogger().severe("Failed to load config.properties: " + e.getMessage());
        }

        apiUrl = props.getProperty("api-url", "").replaceAll("/+$", "");
        apiKey = props.getProperty("api-key", "");
        serverKey = props.getProperty("server-key", "survival");
        intervalSeconds = parseIntOr(props.getProperty("poll-interval-seconds"), 10, "poll-interval-seconds");

        broadcastEnabled = Boolean.parseBoolean(props.getProperty("broadcast-enabled", "true"));
        broadcastMessage = props.getProperty("broadcast-message", "&6{player} &fjust purchased &6{item}&f!");
        titleEnabled = Boolean.parseBoolean(props.getProperty("title-enabled", "true"));
        titleText = props.getProperty("title-text", "&6&lTHANK YOU!");
        subtitleText = props.getProperty("subtitle-text", "&fYou received: &6{item}");
        titleFadeIn = parseIntOr(props.getProperty("title-fade-in"), 10, "title-fade-in");
        titleStay = parseIntOr(props.getProperty("title-stay"), 60, "title-stay");
        titleFadeOut = parseIntOr(props.getProperty("title-fade-out"), 10, "title-fade-out");
    }

    private int parseIntOr(String raw, int fallback, String key) {
        try {
            int parsed = Integer.parseInt(raw == null ? "" : raw.trim());
            if (parsed <= 0) throw new NumberFormatException("must be positive");
            return parsed;
        } catch (NumberFormatException e) {
            getLogger().warning("Invalid " + key + " — falling back to " + fallback + ".");
            return fallback;
        }
    }

    private void pollDeliveries() {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(apiUrl + "/pending-deliveries?server=" + serverKey))
                .timeout(Duration.ofSeconds(10))
                .header("x-plugin-key", apiKey)
                .GET()
                .build();

        try {
            HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200) {
                getLogger().warning("pending-deliveries failed with HTTP " + response.statusCode());
                return;
            }

            JsonObject body = JsonParser.parseString(response.body()).getAsJsonObject();
            JsonArray deliveries = body.getAsJsonArray("deliveries");
            if (deliveries == null || deliveries.isEmpty()) return;

            for (JsonElement el : deliveries) {
                JsonObject delivery = el.getAsJsonObject();
                String id = delivery.get("id").getAsString();
                String command = delivery.get("command").getAsString();
                String player = delivery.get("minecraftUsername").getAsString();
                String itemName = delivery.get("itemName").getAsString();

                // Command dispatch (and anything touching the Bukkit API) must
                // happen on the main thread; this poll runs async.
                Bukkit.getScheduler().runTask(this, () -> {
                    getLogger().info("Delivering '" + itemName + "' to " + player + ": " + command);
                    Bukkit.dispatchCommand(Bukkit.getConsoleSender(), command);
                    announcePurchase(player, itemName);
                });

                ackDelivered(id);
            }
        } catch (Exception e) {
            getLogger().warning("pending-deliveries poll failed: " + e.getMessage());
        }
    }

    private void announcePurchase(String player, String itemName) {
        if (broadcastEnabled && !broadcastMessage.isBlank()) {
            Bukkit.broadcastMessage(colorize(fill(broadcastMessage, player, itemName)));
        }
        if (titleEnabled) {
            Player online = Bukkit.getPlayerExact(player);
            if (online != null) {
                online.sendTitle(
                        colorize(fill(titleText, player, itemName)),
                        colorize(fill(subtitleText, player, itemName)),
                        titleFadeIn, titleStay, titleFadeOut
                );
            }
        }
    }

    private String fill(String template, String player, String itemName) {
        return template.replace("{player}", player).replace("{item}", itemName);
    }

    private String colorize(String text) {
        return ChatColor.translateAlternateColorCodes('&', text);
    }

    private void ackDelivered(String id) {
        String json = "{\"id\":\"" + id + "\"}";
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(apiUrl + "/mark-delivered"))
                .timeout(Duration.ofSeconds(10))
                .header("Content-Type", "application/json")
                .header("x-plugin-key", apiKey)
                .POST(HttpRequest.BodyPublishers.ofString(json, StandardCharsets.UTF_8))
                .build();

        http.sendAsync(request, HttpResponse.BodyHandlers.discarding())
                .exceptionally(err -> {
                    getLogger().warning("mark-delivered failed for " + id + ": " + err.getMessage());
                    return null;
                });
    }
}
