# 🎣 Catch n Track - Fishing Hole App

**Catch n Track** is a progressive web app (PWA) that helps anglers mark, track, and revisit their favorite fishing holes. Designed with offline-first functionality and cross-device compatibility.



<img width="1544" height="1063" alt="image" src="https://github.com/user-attachments/assets/d7d9902f-0240-43dc-aa1c-7944a4481625" />
<img width="685" height="1054" alt="image" src="https://github.com/user-attachments/assets/23677602-2b1c-43c3-8f36-4432214b4f92" />



---

## 🚀 Features

- 🗺️ Interactive map (Leaflet.js)
- 📍 Mark fishing spots with notes
- 🕓 Offline support (via PWA)
- 🔁 Save/restore via URL imports
- 📱 Mobile-optimized interface
- ☁️ Weather & moon phase (placeholder)

---

## 📦 Tech Stack

- **Frontend**: Vanilla JS, HTML5, CSS3
- **Mapping**: [Leaflet.js](https://leafletjs.com)
- **Storage**: IndexedDB (via native API)
- **PWA**: Service Worker + Web Manifest
- **Deployment**: Cloudflare Pages / Netlify

---

## 📲 Installation (User)

You can install this app on mobile or desktop:

1. Visit [https://catchntrack.tiborg.app](https://catchntrack.tiborg.app)
2. Tap the install icon (`+`) in your browser or add to home screen.
3. The app runs offline after the first load!

> 🛑 You must allow local storage (IndexedDB) for it to work properly offline.

---

## ⚙️ Developer Setup

```bash
git clone https://github.com/your-username/catchntrack.git
cd catchntrack
npm install  # if needed (for optional tooling)
