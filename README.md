# Civic Hero 🏙️
> **Change Your City.**

Civic Hero is an AI-powered, accessible, gamified citizen engagement platform built for reporting and tracking municipal and civic issues (potholes, garbage, water leaks, broken streetlights, road damage, open drains) in tier-1, tier-2, and tier-3 Indian cities.

---

## 🌟 Live Website
👉 **[https://tanishagothwad.github.io/Civic-Hero/](https://tanishagothwad.github.io/Civic-Hero/)**

---

## 🎯 Core Principles
Every screen in Civic Hero instantly answers 3 fundamental questions:
1. **What can I do here?** — Fast 3-step AI reporting, quick voice notes, camera captures.
2. **What's happening with my report?** — Live horizontal stepper timeline, before/after photo verification slider, assigned field officer details.
3. **What did I earn?** — Real-time XP rewards, celebratory confetti, level progression, badge unlock gallery, and neighborhood leaderboards.

---

## 📱 Three Integrated Portals in One App

### 1. 🚶 Citizen Portal (Mobile-First)
- **Tagline Banner & XP Meter**: Real-time level progression (*Ward Guardian*), XP balance, and unlocked badge achievements.
- **3-Step AI Auto-Detect Report Wizard**:
  - **Step 1: Capture** — Photo evidence upload, sample presets, and voice notes with Web Speech API audio transcription.
  - **Step 2: AI Auto-Detect** — AI classifies category (*Pothole, Garbage, Water Leak, Streetlight, Road Damage, Drain*) and severity (*Low, Medium, High, Critical*) with editable chips and GPS location tag.
  - **Step 3: Duplicate Detection** — Prompts if a similar report exists within 45m: *"Someone already reported this nearby — merge your report to boost its priority?"* (+15 bonus XP).
  - **1-Tap Submit** — Awards +25 XP with celebratory particle confetti.
- **"My Reports" & Self-Service Deletion**:
  - Dedicated view tracking all complaints reported by the logged-in citizen.
  - **Delete Listing**: Citizens can delete listings they authored directly from the portal with status-aware confirmation prompts.
- **Issue Tracking & Stepper**: Horizontal status stepper (*Submitted → Acknowledged → In Progress → Resolved*) with before & after resolution comparison slider.
- **Gamification Hub**: Badges catalog (*Pothole Patrol, Clean Streets Hero, First Responder, Drain Doctor, Night Owl, Civic Legend*), level milestones, and Ward & City leaderboards.
- **Notification Center**: Real-time alerts for dispatch, status updates, and resolution bonus XP.

### 2. 🏛️ Municipal Command Center (Desktop HQ)
- **Geographic Complaint Heatmap**: Leaflet interactive map with severity color-coding, density clusters, and instant popups.
- **KPI Analytics Cards**: Issues resolved, average resolution time (4.2 hrs), critical hazard count, top problem wards, and citizen satisfaction score.
- **Filterable Complaints Database**: Multi-criteria search and filters across categories, severities, statuses, and wards.
- **Task Dispatch Engine**: Route issues to field workers (*Ramesh Kumar, Priya Sharma, etc.*) with custom SLA targets (2h, 4h, 12h, 24h) and instructions.

### 3. 👷 Field Worker App (Mobile Ops)
- **Officer Profile & Shift Meter**: Workload tracker for field inspectors and sanitation leads.
- **Assigned Task Queue**: Sorted by priority and GPS distance.
- **Citizen Voice Note Player**: Play audio descriptions directly in the field.
- **One-Tap Workflow**: *Start Work* → *Mark Resolved*.
- **Mandatory Resolution Proof**: Upload "After" photo and completion remarks to close tickets, automatically notifying the citizen and granting them +50 bonus XP.

---

## 🗄️ Backend & Persistence Architecture

Civic Hero uses a hybrid **Firebase Client SDK + Offline-First Local Storage Engine**:

* **Database (Firestore)**:
  * Persistent `listings` collection storing `id`, `ticketNumber`, `title`, `category`, `description`, `address`, `lat`, `lng`, `severity`, `photos` (max 3), `reporterId`, `reporterName`, `status`, `upvotes`, `confirmedBy`, `ward`, `createdAt`, `updatedAt`, `resolvedPhotoUrl`, `flagged`.
  * Real-time updates via Firestore `onSnapshot` listeners and cross-tab storage events.
* **Photo Storage (Firebase Storage)**:
  * Uploads evidence images under `listings/{listingId}/{fileName}` with 10MB limit and automatic cleanup on report deletion.
* **Authentication (Firebase Auth)**:
  * Phone/OTP login with invisible reCAPTCHA verification, plus 1-tap quick demo logins for testing.
* **Rate Limiting**:
  * Enforces a maximum cap of **5 listings per citizen per 24 hours** to prevent spam and abuse.
* **Security Rules**:
  * [`firestore.rules`](./firestore.rules): Restricts deletion strictly to the original author or municipal staff. Protects field officer status transitions and upvote counters.
  * [`storage.rules`](./storage.rules): Restricts uploads to valid image MIME types up to 10MB.

---

## 🌐 Multilingual & Accessibility (WCAG 2.1 AA)
- **7 Supported Indian Languages**: English, हिन्दी (Hindi), मराठी (Marathi), தமிழ் (Tamil), తెలుగు (Telugu), বাংলা (Bengali), ಕನ್ನಡ (Kannada).
- **First-Class Voice Input**: Integrated Web Speech API with fallback simulation and animated waveform indicators.
- **Touch-Friendly Controls**: Minimum 44x44px tap targets for smooth mobile accessibility.
- **Accessible Contrast**: WCAG 2.1 AA compliant color ratios across all Google-themed status badges and buttons.
- **Screen Reader Optimized**: Complete `aria-label` coverage on all interactive elements.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or newer)
- npm

### Installation
```bash
# Clone the repository
git clone https://github.com/tanishagothwad/Civic-Hero.git
cd Civic-Hero

# Install dependencies
npm install

# (Optional) Connect Firebase credentials
cp .env.example .env
# Fill in your Firebase config keys in .env

# Start local development server
npm run dev
```

The app will start at `http://localhost:5173/`.

### Building for Production
```bash
npm run build
```

---

## 🛠️ Technology Stack
- **Frontend Framework**: React 19 + TypeScript + Vite 6
- **Styling**: Tailwind CSS (Google Workspace / Material Design inspired palette)
- **Backend & Storage**: Firebase Firestore, Firebase Storage, Firebase Auth
- **Icons**: Lucide React
- **Maps**: Leaflet + OpenStreetMap
- **Animations**: Canvas Confetti & CSS keyframes
- **State**: Centralized Reactive AppContext with bidirectional Firestore adapter
