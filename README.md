# 🏥 CareSync — Smart Elderly Care & Assisted Living Ecosystem

> **Hackathon MVP** | HTML5 · CSS3 · Vanilla JavaScript | No dependencies, no build tools

---

## 📋 Project Introduction

CareSync is a polished, feature-rich hackathon MVP that reimagines elderly care coordination through a unified digital ecosystem. It bridges the gap between elderly patients, family caretakers, and healthcare providers with a dual-interface design — a simplified **Elderly Mode** for patients and a comprehensive **Caretaker Portal** for family members and care professionals.

---

## 🎯 Problem Statement

Over **140 million elderly individuals** in India live with chronic conditions requiring daily medication management, regular doctor appointments, and constant care coordination. The challenges are:

- **Medication non-adherence** leads to 125,000+ preventable deaths annually in the US alone
- **Caretaker information gaps** — family members often lack real-time visibility into care status
- **Language & accessibility barriers** — most health apps are not elderly-friendly
- **Fragmented care records** — discharge summaries, appointments, and medications exist in silos

CareSync addresses all these pain points in a single, offline-capable web application.

---

## ✨ Key Features

### 👴 Elderly Mode (Default Landing)
- **Personalized Greeting** with today's date and live progress ring (medications taken / total)
- **Medication Schedule Cards** with large "Mark as Taken" buttons, purpose descriptions, and food instructions
- **🔊 Read My Schedule Aloud** using the browser's `window.speechSynthesis` API (English & Hindi)
- **Mood & Symptom Check-In** (Happy 😊, Tired 😴, In Pain 😣, Dizzy 🌀) — logs instantly to Activity Log
- **Upcoming Appointments** with dynamic countdown badges (Today / Tomorrow / In N days)
- **One-Tap SOS Emergency Banner** with audio beep, mailto: alert, and WhatsApp share link

### 🔐 Caretaker & Family Portal (PIN: 1234)
- PIN-protected modal access (Demo PIN clearly displayed for judges)
- Role selector: Primary Caretaker, Family Member, Healthcare Aide
- Real-time stats dashboard (medications, adherence %, appointments, log entries)

### 💊 Medication Management
- Pre-loaded fictional sample medications:
  - Amlodipine 5mg — 09:00 AM (After Breakfast | Blood Pressure Routine)
  - Metformin 500mg — 02:00 PM (With Lunch | Blood Sugar Routine)
  - Atorvastatin 10mg — 09:00 PM (After Dinner | Cholesterol Routine)
- Full CRUD: Add, Edit, Delete medications
- Mark doses as Taken ✅ / Missed ❌ / Reset ↩
- All changes persist in localStorage

### 📅 Appointment Management
- Pre-loaded with 2 sample appointments (Cardiology Checkup, Eye Exam)
- Full CRUD: Add, Edit, Delete appointments
- Dynamic countdown badges, preparation notes
- Sorted chronologically

### 📊 Adherence & Activity Tracking
- Dynamic adherence percentage bar (updates instantly on mark taken/missed)
- 7-day visual streak grid (Great / OK / Poor / Empty)
- Timestamped Activity Log (doses, moods, schedule changes, SOS events, email simulations)

### 📧 Proactive Reminder & Email Centre
- Configurable caretaker email address
- 3 one-click simulation buttons:
  1. **Simulate Upcoming Dose Reminder** — shows next pending medication
  2. **Simulate Missed Medication Alert** — lists all missed meds
  3. **Simulate Doctor Appointment Reminder** — shows next appointment
- Realistic **Email Preview Modal** with Recipient, Subject, Timestamp, and formatted Body
- **Open in Email Client (mailto:)** button for manual dispatch
- All triggers logged to Activity Log

### 🔬 Innovative Features
- **Smart Discharge-Note Parser**: Paste or load a sample discharge summary → Extracts medications and appointments with regex patterns → Checklist review before confirming additions to live schedule
- **Schedule-Conflict & Food-Instruction Warning**: Detects duplicate time slots and conflicting food instructions (not drug-interaction verification — clearly labelled)
- **Text-to-Speech**: Browser-native speech synthesis with English/Hindi language toggle
- **Working Language Toggle**: Key UI labels translate between English and Hindi (हिन्दी)
- **Font Size Controls**: A+ / A− buttons scale root font size (12px–24px range)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Structure | HTML5 (semantic elements) |
| Styling | CSS3 (custom properties, Grid, Flexbox, animations) |
| Logic | Vanilla JavaScript (ES6+, no frameworks) |
| Persistence | `localStorage` (browser-native) |
| Speech | Web Speech API (`window.speechSynthesis`) |
| Audio | Web Audio API (SOS beep) |
| Email | `mailto:` URI scheme |
| Messaging | `wa.me` WhatsApp share URL |
| Build | None — open `index.html` directly |

---

## 🚀 How to Run

```bash
# Option 1: Open directly in browser
# Simply double-click index.html
# OR right-click → Open with → Your browser

# Option 2: Serve locally (optional, for best results)
npx serve .
# Then open http://localhost:3000

# Option 3: Python simple server
python -m http.server 8080
# Then open http://localhost:8080
```

**No installation, no build step, no dependencies.** Works fully offline after first load.

---

## 🔑 Demo PIN

```
Caretaker Portal PIN:  1 2 3 4
```

The PIN is clearly displayed on the portal modal for judges.

---

## 🤖 AI Tools Used

- **Google Antigravity** — primary AI development assistant used to architect, generate, and iterate on all code (HTML, CSS, JavaScript), feature design, and documentation

---

## 📁 Project Structure

```
CareSync/
├── index.html      ← Main application shell & all modals
├── style.css       ← Complete design system (900+ lines)
├── script.js       ← All app logic, state management, features
└── README.md       ← This file
```

---

## ⚠️ Transparent MVP Limitations & Medical Disclaimer

### This is a Hackathon Frontend Demo

| Feature | MVP Implementation | Production Would Require |
|---|---|---|
| Data Persistence | `localStorage` (browser-only) | Encrypted cloud database |
| Authentication | PIN `1234` hardcoded in JS | OAuth2, server-side auth |
| Email Alerts | `mailto:` link + preview modal | Backend email service (SendGrid, SES) |
| WhatsApp SOS | `wa.me` share URL | WhatsApp Business API |
| Schedule Warnings | Frontend time-slot checks | Clinical pharmacist review system |
| Discharge Parser | Regex pattern matching | NLP/ML medical entity extraction |
| Multi-user Sync | None | Real-time WebSocket sync |

### ⛔ Medical Disclaimer

> **ALL medication names, dosages, patient names, doctor names, hospital names, and health data shown in this application are entirely fictional demonstration data created solely for hackathon purposes.**
>
> CareSync is **NOT** a medical device, **NOT** a clinical system, and does **NOT**:
> - Provide medical advice or clinical recommendations
> - Verify drug interactions or contraindications
> - Replace consultation with licensed healthcare professionals
> - Constitute a certified or regulated healthcare application
>
> The schedule-conflict checker is a simple time-slot comparison only — it does **NOT** verify pharmacological drug interactions.
>
> **Always consult a qualified medical professional for health decisions.**

---

## 📝 Sample Data Notes

All sample data is fictional:
- **Patient**: Ramesh Kumar (fictional)
- **Caretaker**: Sunita Kumar (fictional)
- **Medications**: Amlodipine, Metformin, Atorvastatin — common medication names used as examples only
- **Doctors**: Dr. Priya Sharma (Cardiology), Dr. Rajan Mehta (Ophthalmology) — fictional
- **Hospitals**: City Heart Institute, Vision Care Clinic — fictional

---

*Built with ❤️ for hackathon demonstration purposes only.*
