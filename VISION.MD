# VISION.md — Multiplayer Board Game Timer

## 1. Purpose

Multiplayer Board Game Timer is a **shared turn-management tool** designed to:

* Keep sessions fair and paced
* Reduce downtime between turns
* Support competitive and casual table play

The app must communicate:

* Clear, conflict-free turn state
* Fast interaction in live group settings
* Reliability under noisy, rapid use

---

## 2. Target Audience

Primary:

* Board game groups with turn-based play
* Players who want equal turn time
* Hosts who manage game flow

Secondary:

* Tournament/league organizers
* Tabletop cafes and game nights

---

## 3. Positioning

**Primary Identity:**
Fair and fast multiplayer turn timer

**Supporting Angles:**

* Lightweight game-night utility
* Shared screen companion for tabletop sessions

---

## 4. Core Message

> “Make turns fair, keep games moving, and let players focus on strategy.”

---

## 5. Primary Call To Action

**Primary CTA:** Start Game Timer  
Secondary CTA: Configure Players

A host should configure and start in under one minute.

---

## 6. Content Strategy

### 6.1 Core Turn System

* Add players and free reordering in Setup
* Turn countdown with clear active-player highlight (turn length configurable in Setup, e.g. 60 seconds)
* Next/previous player controls: host switches to the next/previous player by ending the current timer and starting the new player's timer (no time credit on manual end)
* Skip/Advance control: host can end the current turn early
  * When host uses Skip/Advance, do not credit elapsed seconds to the current player's total
* Timeout handling: when time hits 0, the timer pauses and host action is required to advance/resume
  * When timeout occurs (timer reaches 0), credit the timed-out player with the full configured turn length
* Pause handling: when paused, the countdown freezes and time accumulation stops until resumed

### 6.2 Fairness and Pace

* Per-player total time tracking
* Timeout cues (sound/vibration/visual)
* Stable per-player color: auto-assigned on player creation, editable in Setup; use as the background styling so active player is instantly recognizable
* Accessibility improvements to the color palette can be iterated later

### 6.3 Session Output

* End-of-game time summary by player (sorted by total time)
* Export/share final timing results (future)

---

## 7. App Structure

### Screens

1. Setup (players, mode, limits)
2. Live Timer
3. Game Summary
4. Settings

---

## 8. Features

Required:

* Multi-player turn timer
* Active player state + visible countdown
* Timeout pauses timer; host must confirm advance/resume
* Pause/resume and manual turn advance (host-controlled)
* Next/Previous (host) ends current turn and starts new player's timer
* Skip/Advance control to end a turn early (no time credit on manual advance)
* Per-player elapsed totals
* Installable **PWA** for game-night offline usage

Optional (future):

* Bluetooth/remote controller input
* Match history and leaderboards
* Preset templates by game type

---

## 9. Design Principles

* Readable from across a table
* Minimal tap targets and mistakes under pressure
* Clear color/state coding with accessibility in mind
* No clutter during active turns

Goal:

> Everyone at the table should understand turn state at a glance.

---

## 10. Technical Strategy

* Frontend-first architecture
* Deterministic timer + player-state transitions
* Local persistence for player templates only
* PWA manifest + service worker + offline shell
* Local-only MVP (no multi-device synchronization / networking required)
* Optimized for tablet and phone landscape mode

---

## 11. MVP Scope

### Must Have

* Player setup (2+ players)
* Turn countdown + next player actions
* Per-player cumulative time display
* Timeout pause + host-confirmed advance/resume
* Pause/resume and reset (host-controlled)
  * Reset clears totals, returns to Setup, and keeps the previously used player setup
* Skip/Advance (end current turn early; no time credit)
* PWA installability and offline reliability

### Can Wait

* Cloud sync
* Account profiles
* Advanced tournament features

---

## 12. Success Criteria

The app is successful if:

* A group can configure and start in under 60 seconds
* Turn flow remains clear with no disputes about whose turn it is
* Timer remains stable for full game sessions (30-180+ minutes)

---

## 13. Anti-Goals

Avoid:

* Overcomplicated setup before play starts
* UI elements too small for shared-table visibility
* Features that interrupt active turn flow

---

## 14. Future Extensions

* Game-specific timer modes (hybrid, team-based)
* Companion displays for TVs/secondary devices
* Session analytics and pacing recommendations

---

## Final Note

This app should feel like an impartial table referee:

* Easy to set up
* Fair in execution
* Invisible once play begins
