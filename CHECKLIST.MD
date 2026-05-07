# CHECKLIST.md — Multiplayer Board Game Timer

This checklist is for implementing the MVP described in `VISION.MD`.

## 0. Confirm MVP Rules (write them down)
1. Turn length is configurable in **Setup** (example default: 60s).
2. Each player gets a countdown for their turn.
3. When the timer reaches `0` (timeout):
   - The timer pauses.
   - Host advances/resumes.
   - The timed-out player’s totals are credited with the **full configured turn length**.
4. When the host ends a turn manually (`Skip/Advance`, `Next/Previous`):
   - The current turn ends immediately.
   - The outgoing player’s totals are credited with **0** (no elapsed-time credit).
5. `Pause` freezes the countdown and stops time accumulation until resumed.
6. Players have stable colors:
   - Auto-assigned on player creation
   - Editable in Setup
   - Used as background styling on the Live Timer for quick recognition
7. `Game Summary` sorts players by **total time**.
8. Local-only MVP (no multi-device/network sync). Everything runs on a single device.

## 1. Project/Foundation
1. Choose/confirm the tech stack and app structure (frontend-first).
2. Ensure the project builds and runs locally.
3. Set up PWA scaffolding (manifest, icons, service worker).
4. Add local persistence storage for **player templates** only (as defined by MVP).
5. Confirm offline shell works:
   - App loads without network
   - Game still runs offline

## 2. App Navigation / Screens
1. Implement screen routing/state:
   - Setup
   - Live Timer
   - Game Summary
   - Settings (if it already exists; otherwise keep MVP minimal)
2. Define a clear single source of truth for session state (e.g. `SetupState`, `LiveSessionState`, `SummaryState`).

## 3. Setup Screen (players + ordering + turn settings)
1. Allow host to add players (minimum 2).
2. Implement free reordering of players in Setup:
   - Drag-and-drop or equivalent reordering UI
3. Implement per-player color:
   - Auto-assign on player creation
   - Allow editing in Setup
4. Implement turn length configuration:
   - Input for turn seconds (e.g. integer seconds)
5. Implement CTA:
   - Start Game Timer (transitions to Live Timer)
6. Persist only player templates in local storage:
   - Store player list + colors
   - Do NOT add cloud sync or accounts

## 4. Live Timer Screen (core turn flow)
1. Display the active player clearly:
   - Background styling using that player’s color
   - Visible countdown
2. Start countdown when entering Live Timer.
3. Implement controls (host on phone screen):
   1. **Pause/Resume**
      - Pause freezes countdown + stops time accumulation
      - Resume continues countdown from paused value
   2. **Timeout handling**
      - When countdown reaches `0`, pause automatically
      - Wait for host action to advance/resume
      - Credit timed-out player with full configured turn length
   3. **Advance/Resume (after timeout)**
      - End timed-out player turn
      - Start next player’s timer
   4. **Skip/Advance**
      - End current turn early
      - Immediately start the next player’s timer
      - Credit outgoing player with `0`
   5. **Next/Previous**
      - Switch active player by ending current timer and starting the selected player’s timer
      - Credit outgoing player with `0`
4. Maintain per-player cumulative totals:
   - Total seconds attributed to each player
   - Update totals only per the MVP rules (timeout credits full turn; manual ends credit 0)
5. Add subtle UX safeguards:
   - Prevent double-taps causing multiple state transitions (debounce/guard)

## 5. Game Summary Screen
1. Show per-player total time.
2. Sort players by total time (ascending or descending—pick one and keep consistent).
3. Provide a Reset flow:
   - Clear totals
   - Return to Setup
   - Keep the previously used player setup (players + colors + turn settings as previously configured)

## 6. Settings Screen (MVP-minimum)
1. If Settings exists, ensure it does not disrupt active turn flow.
2. Store user preferences locally if needed (otherwise keep minimal for MVP).

## 7. Local Persistence & Templates
1. Implement player template persistence:
   - Save players list + colors when starting or when host confirms save (whichever matches your UI).
2. Load templates back into Setup.
3. Ensure reset does not delete the template unless host explicitly does so.

## 8. PWA Offline Reliability
1. Verify service worker cache strategy supports:
   - First install
   - Reload offline
2. Verify that the running session still functions offline:
   - Timer accuracy
   - Controls
   - Summary generation
3. Test installation flow (browser “Add to Home Screen”).

## 9. Testing / Verification (manual QA)
1. Turn credit rules:
   - Manual Skip/Advance credit = 0 for outgoing player
   - Timeout credit = full configured turn length
2. Pause behavior:
   - Paused time does not decrease
   - Totals do not increase while paused
3. Next/Previous behavior:
   - Switch ends the current timer and starts new player timer
   - Outgoing player credit = 0
4. Reset behavior:
   - Totals cleared
   - Return to Setup
   - Player setup preserved
5. Summary sorting:
   - Verify sorting order matches expectation
6. Color recognition:
   - Each player has a distinct stable background styling
   - Active player is instantly identifiable
7. Performance:
   - Countdown remains stable for long runs (simulate 30-180+ minutes as feasible)

## 10. Done Definition
1. User can configure players and start within ~60 seconds.
2. Live turn flow is dispute-resistant (clear active player, clear paused/timeout states).
3. MVP works fully offline and behaves deterministically on a single device.

