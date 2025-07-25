# 🎧 DJYING

A smart DJ utility app powered by Firebase + AI for music analysis, track preparation, and harmonic mixing suggestions. Designed for DJs who want fast, intuitive, and intelligent tools to prepare their sets with precision and creativity.

---

## 🚀 Core Features

- 🔐 **User Authentication** with Firebase Auth (Email + OAuth)
- 🎵 **FLAC/WAV File Upload** with drag-and-drop
- 🧠 **BPM Detection** using AI-powered rhythm analysis
- 🎼 **Melodic Key Detection** with Camelot Wheel support
- 🎯 **AI Hot Cue Suggestions**: intro, build, drop, breakdown, outro
- 🔁 **Next Track Key Suggestion** using Circle of Fifths logic
- 🔋 **Track Energy Analysis**: detect and visualize energy levels
- 📝 **Metadata Editing**: edit, tag, and export metadata

---

## 🧩 Functional Breakdown

### 1. 🔐 User Authentication
- **Firebase Auth** integration
- Sign up/login with Email, Google, Apple ID (iOS)
- Session tokens, profile management (avatar, display name)

### 2. 📁 Audio Upload
- **Firebase Storage**
- Supported: `.flac`, `.wav` (max 500MB)
- Drag & drop interface with progress tracking
- Files organized by user ID

### 3. 🕺 BPM Detection
- **Cloud Function** using tools like Essentia/SonicAPI
- BPM visualized alongside waveform
- Stored in Firestore for each track

### 4. 🎼 Melodic Key Detection
- Detect keys (e.g., `C#m`, `F`, `G`)
- Show results in Camelot Wheel format
- Suggest compatible key transitions

### 5. 🎯 AI Hot Cue Suggestion
- Analyze song structure to mark: intro, build, drop, breakdown, outro
- Cue markers editable by user
- Visual display over waveform

### 6. 🎛️ Harmonic Key Recommendation
- Use Camelot + Circle of Fifths AI engine
- Suggest matching tracks by key/BPM/energy
- Visual selector for compatible next songs

### 7. 🔋 Track Energy Analysis
- Analyze tempo consistency, loudness, spectral flatness
- Score (1–10) + energy graph over time
- Store in Firestore & render in UI

### 8. 📝 Metadata Editor
- Fields: Title, Artist, Genre, Album, BPM, Key, Tags
- Batch editing support
- Export `.cue` or `.json` metadata files

---

## 🎨 UI/UX Style Guide

### 🔷 Colors
| Element     | Hex Code   | Use Case                            |
|-------------|------------|-------------------------------------|
| Primary     | `#29ABE2`  | Buttons, highlights, headings       |
| Background  | `#121E2E`  | Main background, dark theme base    |
| Accent      | `#4AC0F2`  | Interactive elements, sliders       |

### ✍️ Typography
- **Headings**: `Space Grotesk`, sans-serif
- **Body**: `Inter`, sans-serif

### 🧭 Design Principles
- Mobile-first, minimalist layout
- Waveform visualizations
- Subtle micro-interactions:
  - Upload progress
  - Cue placement
  - Analysis loading

### 🖼️ Iconography
- Lucide / Feather icons
- Custom icons for BPM, Key, Cue, Energy
- Visuals: waveform graphs, piano roll-style layouts

---

## ⚙️ Tech Stack & Architecture

### 🔥 Firebase Services

| Service             | Purpose                                      |
|---------------------|----------------------------------------------|
| Firebase Auth       | User login & session management              |
| Firebase Storage    | Upload & manage audio files                  |
| Firestore           | Track metadata, cues, and analysis results   |
| Cloud Functions     | Run BPM/Key/Energy detection, AI logic       |
| Firebase Hosting    | Host PWA/React/NextJS frontend (optional)    |
| Firebase Analytics  | Track user engagement (optional)             |

### 🧠 AI Integrations

- **Gemini**: Multimodal model for hot cue detection and recommendations. [Learn more](https://gemini.google.com/)
- **Genkit**: Framework to access and orchestrate AI models, audio analysis, and prompt-based tools. [Docs](https://firebase.google.com/docs/genkit)

---

## 🛠️ Frontend Framework

| Tech        | Purpose                                      |
|-------------|----------------------------------------------|
| TypeScript  | Strict, scalable JavaScript variant          |
| Next.js     | Server-side rendering + routing              |
| TailwindCSS | Utility-first CSS for modern design          |

---

## 🌱 Future Enhancements

- 🎚 Playlist creation + export for Rekordbox, Serato, Traktor
- 🔗 Spotify / YouTube integration for streaming previews
- 🤖 On-device ML model for offline cue predictions
- 🌓 Dark/Light mode toggle
- 🔁 Shareable cue templates and presets by track

---

## 📁 Project Structure

```shell
dJYING/
│
├── /public             # Static assets (logos, icons, fonts)
├── /src
│   ├── /components     # React components
│   ├── /pages          # Next.js routing
│   ├── /styles         # Tailwind config, global styles
│   ├── /utils          # Helper functions
│   ├── /firebase       # Firebase init and config
│   └── /services       # Audio analysis, AI models
├── /functions          # Firebase Cloud Functions (AI + audio)
├── .firebaserc         # Firebase project configuration
├── tailwind.config.js  # TailwindCSS config
├── next.config.js      # Next.js config
└── README.md           # You're here!
````

---

## 📞 Contact & Contribution

Want to contribute, test, or suggest a feature?

* GitHub Issues & PRs are welcome
* Contact: [team@dJYING.app](mailto:team@dJYING.app)
* Follow us on [Instagram](https://instagram.com/dJYINGapp) for sneak peeks

---

> DJYING – Because every great mix starts with great prep.

