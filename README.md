# Wave to Win

Kiosk gamification for WhatsApp Business Summit 2026 — portrait TV display (`1080×1920` / `2160×3840`).

## Flow

1. **Start** — tap anywhere → open camera  
2. **Camera** — wave left/right hand → unlock QR  
3. **QR** — scan code; auto-return home after **30s**, or tap anywhere to go home  

## Stack

- Next.js App Router + React 19  
- CSS Modules (Figma canvas `2160×3840`, scaled via `TvStage`)  
- MediaPipe Hand Landmarker for wave detection  
- `qrcode` for dynamic QR  

## Project structure

```text
src/
  app/                    # Next.js entry
  components/
    WaveToWinApp.tsx      # Screen state machine
    TvStage.tsx           # Portrait TV scaler
    screens/              # Start / Camera / QR
    ui/                   # Logo, pill label, scanner frame
  hooks/
    useCamera.ts
    useWaveDetection.ts
    useCountdown.ts
  lib/
    constants.ts
    types.ts
    qr.ts
public/assets/            # Figma exports
```

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use a portrait viewport or a vertical TV.

## PWA (install + offline)

Service worker is powered by [Serwist](https://serwist.pages.dev/) (`@serwist/turbopack`).

```bash
npm run build
npm start
```

Then open the production URL over **HTTPS** (or `localhost`) and install:

- **Chrome/Edge** → Install app / Add to Home Screen  
- **iOS Safari** → Share → Add to Home Screen  

Offline notes:

- App shell, fonts, icons, local assets, **and MediaPipe WASM/model** are precached (same-origin under `/mediapipe/`).  
- No CDN calls at runtime for wave detection.  
- Camera still needs device permission (works offline).  
- First install/update still needs network once so the service worker can precache everything.  
- After updating the PWA build: open online once, wait for SW update, then offline reopen works.  
- In Chrome DevTools → Application → Service Workers: confirm `/serwist/sw.js` is **activated & running**.  
- Re-sync MediaPipe assets after upgrading `@mediapipe/tasks-vision`: `npm run sync:mediapipe`

### Env

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_QR_URL` | URL encoded in the QR code (default: https://cekat-scratch-logo.vercel.app/) |

## Dev shortcuts

| Key | Action |
| --- | --- |
| `1` / `2` / `3` | Jump to Start / Camera / QR |
| `W` | Force wave success on Camera |
| `Esc` | Back to Start |

## Notes

- Camera requires HTTPS (or `localhost`) and user permission.  
- Wave detection needs a visible hand moving left↔right a few times.  
- Design tokens: accent `#00afff`, cream `#fcf5eb`.  
