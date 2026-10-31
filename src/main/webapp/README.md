# TechFest Hub — Vanilla HTML5 / CSS3 / JavaScript Edition

This folder is a 100% native **HTML5, CSS3, and modern Vanilla JavaScript** implementation of the **TechFest Hub ("Utsav Arena")** frontend originally designed in Figma and developed in React/TypeScript.

---

## Highlights

- **Zero Build Step**: No Node.js, Vite, npm/pnpm, or bundler required to run.
- **3D Interactive Graphics**: Native Three.js procedural **Lotus Mandala** with dynamic studio lighting, claymorphic materials, rotating gem meshes, and smooth mouse-tilt parallax.
- **Full Page Parity**:
  1. `index.html` — Landing page with 3D Lotus Mandala, featured event highlights, and a 3-step participation timeline.
  2. `events.html` — Real-time event catalog with instant keyword search, category chips, fee/date sorting, and "Open only" filtering.
  3. `event-details.html` — Event view with schedule timeline (`T00`, `T01`), venue/fee specifications, and interactive `TicketBooth`.
  4. `register.html` — 5-step registration wizard with dynamic teammate management and auto-saving drafts.
  5. `my-registrations.html` — Student pass center with confirmed/cancelled pass tickets (`PassCard`) and live KPI metrics.
  6. `login.html` & `signup.html` — Split-screen authentication layouts with floating 3D scenes, real-time password strength meter, and one-click demo credentials autofill.
  7. `admin.html` — Festival Office command center with searchable tables (Events, Registrations, Students) and an inline event editor modal.

---

## Quickstart

Because this edition uses native ES6 JavaScript modules (`import`/`export`) and WebGL, serve it with any local static HTTP server:

### Option 1: Python
```bash
python -m http.server 3000
```
Open [http://localhost:3000](http://localhost:3000)

### Option 2: Node.js (npx serve)
```bash
npx serve .
```

### Option 3: VS Code / IDE Live Server
Right-click `index.html` and click **"Open with Live Server"**.

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Demo Student** | `aarav@college.edu` | `Utsav@2026` |
| **Festival Admin** | `admin@techfesthub.demo` | `ArenaAdmin@2026` |

*(Quick-fill buttons are also available directly on the login page for instant access).*
