# DemonCoreDeliveryBridge

A Paper plugin that polls the DEMONCORE MC website for paid shop orders and
runs each one's delivery command in-game automatically — no manual "give the
player their rank" step needed once it's set up.

Install this on **each gamemode server** (survival, lifesteal) — not on the
Velocity proxy. Item delivery needs to run wherever your economy/rank/kit
plugins (LuckPerms, Vault, etc.) actually live, which is the backend server,
not the proxy.

## How it works

1. A player pays at checkout on the website. `/api/checkout/verify` marks
   their order `status = paid` in Supabase.
2. This plugin polls `GET /api/plugin/pending-deliveries?server=<server-key>`
   every `poll-interval-seconds`, authenticated with the same `x-plugin-key`
   header the Velocity bridge uses.
3. For each pending order, the website has already resolved that item's
   **Delivery Command** (set per rank/crate key/coin package in the admin
   panel, under fields like "Delivery Command") with `{player}`, `{quantity}`,
   `{amount}`, `{coins}` filled in — e.g. `lp user Notch parent add vip`.
4. The plugin runs that command as console (`Bukkit.dispatchCommand`), then
   calls `POST /api/plugin/mark-delivered` so it isn't delivered twice.

Orders for items with **no Delivery Command configured** are silently
skipped by the website (never returned to the plugin) — those stay in Admin →
Purchase Requests for staff to fulfill by hand, same as before this plugin
existed.

**The player must be online** when their order is delivered, since the
command runs immediately once payment clears — the checkout page warns
buyers about this. If they log off mid-checkout, whatever the command needs
online (e.g. `lp user <player> ...` usually works offline via UUID, but
`give`/`heal`/etc. need them connected) may fail; the admin panel is the
fallback for exactly that case.

## 1. Set delivery commands in the admin panel

Go to Admin → Ranks / Crate Keys / Coin Packages and fill in "Delivery
Command" for whichever items you want auto-delivered. Available placeholders:

| Placeholder | Meaning |
|---|---|
| `{player}` | the buyer's Minecraft username |
| `{quantity}` | how many (crate keys 1/5/10, ranks always 1) |
| `{amount}` | amount paid in ₹ |
| `{coins}` | coin package size (coin packages only) |
| `{server}` | `survival` or `lifesteal` |

Examples:

```
lp user {player} parent add vip
crates give {player} common {quantity}
eco give {player} {coins}
```

## 2. Build it

Requires JDK 17+ and Maven.

```
cd gamemode-plugin
mvn package
```

This produces `target/DemonCoreDeliveryBridge.jar`.

## 3. Install it on each gamemode server

1. Copy `DemonCoreDeliveryBridge.jar` into that server's `plugins/` folder.
2. Start the server once so it generates a config file, then stop it.
3. Open `plugins/DemonCoreDeliveryBridge/config.properties` and set:

   ```properties
   api-url=https://YOUR-VERCEL-DOMAIN/api/plugin
   api-key=SAME-VALUE-AS-PLUGIN_API_KEY-ON-VERCEL
   server-key=survival
   poll-interval-seconds=10
   ```

   `server-key` must be `survival` or `lifesteal` and match which server
   this install is on. `api-key` must exactly match `PLUGIN_API_KEY` in the
   website's env vars.

4. Repeat for the other gamemode server with its own `server-key`.
5. Start the servers again.

## 4. Verify it's working

- Check the server console for `DemonCoreDeliveryBridge started for server
  '<key>' — polling ... every 10s`.
- Make a real (or Razorpay test-mode) purchase while online on that server —
  within one poll interval you should see `Delivering '<item>' to <player>: ...`
  in the console, and the order should flip to `completed` in Admin →
  Purchase Requests.
- If nothing happens, confirm the item has a Delivery Command set in the
  admin panel — orders without one are never sent to the plugin.
