# Multiplayer Board Game Timer

Frontend-only, local-first turn timer for in-person board game sessions.

The app is designed for one shared control device (typically a phone). It keeps turn flow clear, enforces consistent timing behavior, and produces an end-of-game time summary.

## What The Project Does

- Configure players (2+), turn duration, order, and player colors.
- Run a live turn timer with clear active-player state.
- Support host actions during play: `Pause/Resume`, `Next/Previous`, `Skip/Advance`, and `Finish`.
- Track per-player totals using deterministic rules.
- Show sorted totals in a final Game Summary screen.
- Work offline as an installable PWA.

## Scoring / Credit Rules

- **Timeout (`0`)**: credit the player with the full configured turn length.
- **Next/Previous**: credit elapsed time to the outgoing player, then switch.
- **Skip/Advance**: credit `0` to the outgoing player.
- **Finish**: credit elapsed time for the currently active player (unless already timed out and credited).
- **Pause**: countdown and accumulation stop until resumed.

## Tech Stack

- React + TypeScript + Vite
- `vite-plugin-pwa` for installability/offline shell
- Local storage for player templates

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Build

```bash
npm run build
npm run preview
```

## Project Structure

- `src/screens/SetupScreen.tsx` - Player setup and session configuration
- `src/screens/LiveTimerScreen.tsx` - Core turn flow and controls
- `src/screens/SummaryScreen.tsx` - End-of-game totals
- `src/domain/` - Shared timer/template logic
- `VISION.MD` - Product vision and behavior contract
- `CHECKLIST.MD` - Implementation checklist

## Scope Notes

- Frontend-only MVP
- Local-only (no cloud sync, no multi-device sync)
- Accessibility enhancements to palette/contrast can be iterated later
