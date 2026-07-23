package fun.demoncoremc.networkbridge;

import com.google.inject.Inject;
import com.velocitypowered.api.event.Subscribe;
import com.velocitypowered.api.event.proxy.ProxyInitializeEvent;
import com.velocitypowered.api.plugin.Plugin;
import com.velocitypowered.api.plugin.annotation.DataDirectory;
import com.velocitypowered.api.proxy.ProxyServer;
import com.velocitypowered.api.proxy.server.RegisteredServer;
import org.slf4j.Logger;

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
import java.util.StringJoiner;
import java.util.concurrent.TimeUnit;

/**
 * Reports total + per-server player counts to the DEMONCORE MC website every
 * `interval-seconds`, matching the payload the site's /api/plugin/network
 * route expects: { "totalOnline": N, "servers": { "survival": X, ... } }
 */
@Plugin(id = "demoncore-network-bridge", name = "DemonCoreNetworkBridge", version = "1.0.0")
public class DemonCoreNetworkBridge {

    private final ProxyServer server;
    private final Logger logger;
    private final Path dataDirectory;
    private final HttpClient http = HttpClient.newHttpClient();

    private String apiUrl;
    private String apiKey;
    private int intervalSeconds;

    @Inject
    public DemonCoreNetworkBridge(ProxyServer server, Logger logger, @DataDirectory Path dataDirectory) {
        this.server = server;
        this.logger = logger;
        this.dataDirectory = dataDirectory;
    }

    @Subscribe
    public void onProxyInitialize(ProxyInitializeEvent event) {
        loadConfig();
        server.getScheduler()
                .buildTask(this, this::reportStats)
                .repeat(intervalSeconds, TimeUnit.SECONDS)
                .schedule();
        logger.info("DemonCoreNetworkBridge started — reporting to {} every {}s", apiUrl, intervalSeconds);
    }

    private void loadConfig() {
        Properties props = new Properties();
        Path configFile = dataDirectory.resolve("config.properties");
        try {
            Files.createDirectories(dataDirectory);
            if (!Files.exists(configFile)) {
                props.setProperty("api-url", "https://your-domain.example/api/plugin/network");
                props.setProperty("api-key", "change-me-to-match-PLUGIN_API_KEY");
                props.setProperty("interval-seconds", "15");
                try (OutputStream out = Files.newOutputStream(configFile)) {
                    props.store(out, "DemonCoreNetworkBridge config");
                }
                logger.warn("Created default config.properties at {} — edit it, then restart the proxy.", configFile);
            }
            try (InputStream in = Files.newInputStream(configFile)) {
                props.load(in);
            }
        } catch (IOException e) {
            logger.error("Failed to load config.properties", e);
        }

        apiUrl = props.getProperty("api-url", "");
        apiKey = props.getProperty("api-key", "");

        int parsedInterval;
        try {
            parsedInterval = Integer.parseInt(props.getProperty("interval-seconds", "15").trim());
            if (parsedInterval <= 0) throw new NumberFormatException("must be positive");
        } catch (NumberFormatException e) {
            logger.warn("Invalid interval-seconds in config.properties ({}) — falling back to 15.", e.getMessage());
            parsedInterval = 15;
        }
        intervalSeconds = parsedInterval;
    }

    private void reportStats() {
        if (apiUrl.isBlank() || apiKey.isBlank() || apiUrl.contains("your-domain.example")) {
            logger.warn("DemonCoreNetworkBridge is not configured yet — edit config.properties in the plugin data folder.");
            return;
        }
        if (!apiUrl.startsWith("https://")) {
            logger.warn("api-url must use https:// — refusing to send the plugin key over an unencrypted connection.");
            return;
        }

        int total = server.getPlayerCount();
        StringJoiner servers = new StringJoiner(",");
        for (RegisteredServer backend : server.getAllServers()) {
            String key = backend.getServerInfo().getName();
            int count = backend.getPlayersConnected().size();
            servers.add("\"" + escape(key) + "\":" + count);
        }

        String json = "{\"totalOnline\":" + total + ",\"servers\":{" + servers + "}}";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(apiUrl))
                .timeout(Duration.ofSeconds(10))
                .header("Content-Type", "application/json")
                .header("x-plugin-key", apiKey)
                .POST(HttpRequest.BodyPublishers.ofString(json, StandardCharsets.UTF_8))
                .build();

        http.sendAsync(request, HttpResponse.BodyHandlers.discarding())
                .thenAccept(response -> {
                    if (response.statusCode() != 200) {
                        logger.warn("Stats report failed with HTTP {}", response.statusCode());
                    }
                })
                .exceptionally(err -> {
                    logger.warn("Stats report failed: {}", err.getMessage());
                    return null;
                });
    }

    private static String escape(String value) {
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
