# Civic Hero 🛡️
> **Report. Track. Earn. Change Your City.**

Civic Hero is an AI-powered, accessible, gamified citizen engagement platform built for reporting and tracking municipal and civic issues (garbage, potholes, water leaks, broken streetlights, damaged roads, open drains) in tier-1, tier-2, and tier-3 Indian cities.

---

## 🌟 Core Principle
Every screen instantly answers 3 fundamental questions:
1. **What can I do here?** (Fast 3-step AI reporting, quick voice notes, camera captures)
2. **What's happening with my report?** (Live horizontal stepper timeline, before/after photo proof, assigned field officer details)
3. **What did I earn?** (Real-time XP points, level progression, badges gallery, neighborhood leaderboard)

---

## 📱 Three Integrated Personas in One App

### 1. 🚶 Citizen App (Mobile-First)
- **Tagline Banner & XP Progress**: Instant view of your level (*Ward Guardian*), XP balance, and unlocked badges.
- **3-Step AI Auto-Detect Report Flow**:
  - **Step 1: Capture** — Photo capture/upload, sample presets, live voice notes with Web Speech API and voice-to-text.
  - **Step 2: AI Auto-Detect** — AI classifies category (*Garbage, Pothole, Water Leak, Streetlight, Road Damage, Open Drain*) & severity (*Low, Medium, High, Critical*) with editable chips, plus auto GPS coordinates.
  - **Step 3: Duplicate Detection** — Prompts if a similar report exists within 45m: *"Someone already reported this nearby — merge your report to boost its priority?"* (+15 bonus XP).
  - **1-Tap Submit** — Awards +25 XP with celebratory confetti.
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
- **Citizen Voice Note Player**: Play audio descriptions directly on the field.
- **One-Tap Workflow**: *Start Work* → *Mark Resolved*.
- **Mandatory Resolution Proof**: Upload "After" photo and completion remarks to close tickets, automatically notifying the citizen and granting them +50 bonus XP.

---

## 🌐 Multilingual & Accessibility (WCAG 2.1 AA)
- **7 Supported Indian Languages**: English, हिन्दी (Hindi), मराठी (Marathi), தமிழ் (Tamil), తెలుగు (Telugu), বাংলা (Bengali), ಕನ್ನಡ (Kannada).
- **First-Class Voice Input**: Integrated Web Speech API with fallback simulation and animated waveform indicators.
- **Large Tap Targets**: Minimum 44x44px for smooth mobile touch.
- **Accessible Contrast**: WCAG 2.1 AA compliant color ratios across all status badges and buttons.
- **Screen Reader Optimized**: Complete `aria-label` coverage on all interactive elements.

---

## 🚀 Getting Started

### Installation
```bash
# Clone repository
git clone https://github.com/tanishagothwad/Civic-Hero.git
cd Civic-Hero

# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle
npm run build
```

---

## 🛠️ Technology Stack
- **Framework**: React 19 + TypeScript + Vite 6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Maps**: Leaflet + OpenStreetMap
- **Animations**: Canvas Confetti & Tailwind Animations
- **State**: Centralized In-Memory Reactive AppContext
