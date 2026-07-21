# DemonCoreNetworkBridge

A minimal Velocity plugin that reports total + per-server player counts to the
DEMONCORE MC website every 15 seconds. It POSTs to the site's existing
`/api/plugin/network` route (see [app/api/plugin/network/route.ts](../app/api/plugin/network/route.ts)),
which is what powers the "Players Online" numbers on the homepage and each
gamemode page.

There's no off-the-shelf plugin for this — the site expects a specific JSON
shape and an `x-plugin-key` auth header, so a small custom plugin is the only
way to wire it up. This is that plugin.

## 1. Build it

Requires JDK 17+ and Maven.

```
cd velocity-plugin
mvn package
```

This produces `target/DemonCoreNetworkBridge.jar`.

## 2. Install it on your Velocity proxy

1. Copy `DemonCoreNetworkBridge.jar` into your Velocity proxy's `plugins/` folder.
2. Start the proxy once so it generates a config file, then stop it.
3. Open `plugins/demoncore-network-bridge/config.properties` and set:

   ```properties
   api-url=https://YOUR-VERCEL-DOMAIN/api/plugin/network
   api-key=SAME-VALUE-AS-PLUGIN_API_KEY-ON-VERCEL
   interval-seconds=15
   ```

   `api-key` must exactly match the `PLUGIN_API_KEY` environment variable set
   on the website (Vercel → Project → Settings → Environment Variables — see
   [.env.example](../.env.example)).

4. Start the proxy again.

## 3. Match your server names

The plugin reports player counts using the server names from your
`velocity.toml` `[servers]` block, e.g.:

```toml
[servers]
survival = "127.0.0.1:25566"
pvp = "127.0.0.1:25567"
lifesteal = "127.0.0.1:25568"
events = "127.0.0.1:25569"
```

Those names (`survival`, `pvp`, `lifesteal`, `events`) must match the
`serverKey` prop used by [PlayersOnline](../components/gamemode/PlayersOnline.tsx)
and [ModeHero](../components/gamemode/ModeHero.tsx) on each page. If you rename
a backend server in Velocity, update the matching page's `serverKey` too.

## 4. Verify it's connected

- Check the proxy console for `DemonCoreNetworkBridge started — reporting to ... every 15s`.
- In Supabase, the `server_stats` row with `id = 'global'` should update its
  `updated_at` timestamp roughly every 15 seconds.
- The homepage's "Players Online" stat and each gamemode page's live badge
  should start showing real numbers within ~15s of the proxy starting.

If the count stays at 0, check the proxy log for `Stats report failed` —
that means either `api-url`/`api-key` is wrong, or the Vercel deployment's
`PLUGIN_API_KEY` doesn't match.
