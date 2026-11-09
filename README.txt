WISE PARROT MANAGEMENT SYSTEM — installable app
================================================
Upload ALL of these together to the same HTTPS folder (Firebase Hosting, Netlify, GitHub Pages, cPanel with SSL):

  index.html              the system (all logic + embedded logo)
  manifest.webmanifest    app name, colours, icons
  sw.js                   service worker (offline + fast loading)
  icons/                  app icons (Wise Parrot crest on a navy badge)

Host it in its OWN folder / address, separate from the Parent Portal, so each installs as its own app.
Installing is only offered over HTTPS. Android/Chrome: "Install the Wise Parrot Admin app" button on the login screen.
iPhone/Safari: the same button shows Share -> Add to Home Screen steps.
If only index.html is uploaded the app still installs with the Wise Parrot icon (built-in fallback).

Themes: Midnight, Pearl White, Ocean, Orchid (palette button; Academic Settings -> Appearance).
Admission numbers: e.g. G42026/001G = Grade 4 · 2026 · No. 001 · G (girl) / B (boy). Parents register on the Parent Portal with it.
When you publish a new version, change VERSION in sw.js (now wp-admin-v4; next: v5).

Parent Portal link: the Students table and dashboard show which learners' parents have registered on the Parent Portal (live).
Login: unchanged (credentials are constants in the script). 'Keep me signed in' is optional and off by default.

New in this version: "Parent Portal" section (Announcements, Calendar & Events, Photo Gallery, Transport, Parent Messages, Feedback & Complaints, Parents Community)
and a Homework tab inside every class (type it, attach PDF/Word documents up to 3 MB, add photos). Everything appears on the Parent Portal for the right grade/learner.
Firestore rules: if your rules list collections one by one, also allow read/write on "wp_files" (homework documents are stored there in small pieces).

App feel: 3-second 'Welcome to Wise Parrot' opening screen; pinch / double-tap / focus zoom is disabled so it behaves like a normal app.
