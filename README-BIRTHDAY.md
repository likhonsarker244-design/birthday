# Birthday Surprise — how to customise

Files:

```
index.html
css/style.css
js/script.js
assets/images/   (photos)
assets/music/    (song)
```

Everything you normally change lives in the `birthdayConfig` block at the very
top of `js/script.js`.

1. **Name** — `name: "Ayesha"` → put her/his name. It updates the reveal, the
   card and the finale automatically.
2. **Birthday message** — `message: "..."` (card text). `subMessage` is the
   typed line on the reveal screen; use `\n` for a line break.
3. **Photos** — drop images into `assets/images/`, then add entries:
   ```js
   photos: [
     { image: "assets/images/photo1.jpg", caption: "Beautiful Memory ❤️" },
   ]
   ```
   Any number works. Missing or empty photos fall back to pretty placeholders.
4. **Music** — put a royalty-free song at `assets/music/birthday.mp3` (or change
   the `music:` path). Music never autoplays; the visitor taps the 🎵 button.
   Until you add a file, the button plays a soft generated melody.

## Run it

Double-click `index.html`, or serve the folder:
`python3 -m http.server 8000` → open `http://localhost:8000`.

## Publish free (GitHub Pages)

1. Create a GitHub repo and upload `index.html`, `css/`, `js/`, `assets/`.
2. Repo → Settings → Pages → Source: `Deploy from a branch`, branch `main`,
   folder `/ (root)` → Save.
3. Your link appears at `https://<username>.github.io/<repo>/` in a minute.

Alternatives: drag the folder onto netlify.com/drop, or `vercel` / Cloudflare
Pages — all free and static-friendly.
