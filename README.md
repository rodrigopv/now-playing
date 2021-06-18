# Cat vibes to your music

This vibing cat will try to match the rhythm of the music you hear 🔥

Live demo: https://nowplaying.skins.cl/

## How it works

- NuxtJS as VueJS front-end framework
- Cloudflare Workers + KV for deployment at edge
- Cloudflare Triggers for current song refresh and caching
- MusicBrainz API for music metadata
- AcousticBrainz API for BPM extraction
- WebM for vibing cat loop with alpha channel
- Video.js for stream play

## Deploy

1. First generate nuxt project static files

```bash
cd frontend
yarn && yarn nuxt generate
```

2. Configure wrangler.toml with your cloudflare account data (follow the example file wrangler.toml.example) and then run

```bash
wrangler publish
```

3. Add a cloudflare trigger on every minute for worker (this will allow worker to refresh current song)

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

If you are bored:
- Implement mobile layout
- Propose some cool feature to add

## License
[MIT](https://choosealicense.com/licenses/mit/)
