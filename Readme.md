# SympTriage – AI-Based Medical Symptom Triage System

SympTriage is a **healthcare-focused web application** that helps users understand the **urgency of their symptoms** and the **appropriate medical department** to consult.

The system provides **triage guidance only**.  
It does **NOT** diagnose diseases, prescribe medication, or replace professional medical advice.

  - ####  vercel deploy link : **https://symtriage.vercel.app/**

## 🚀 Overview

Users describe their symptoms in natural language.  
The system validates that the input is health-related, analyzes it using an AI model, and returns:

- Urgency level: **Low / Medium / High**
- Recommended medical department
- A short, calm explanation
- Guidance on whether professional medical attention is advised
- A mandatory medical disclaimer

The design prioritizes **safety, privacy, and responsible AI use in healthcare**.

---

## 🧩 Tech Stack

### Frontend
- **React 19.1** (Vite)
- **React Router**
- **Tailwind CSS** (light, healthcare-safe UI)
- **Framer Motion** (subtle animations with reduced-motion support)

### Backend
- **Supabase edge function**
- **OpenRouter API** (GPT-4o-mini)
- **Supabase** (PostgreSQL – anonymized logging)

---

## 📁 Project Structure

```
symtriage/
├── frontend/
│   ├── src/
│   │   ├── components/     
│   │   ├── pages/          
│   │   ├── hooks/          
│   │   └── App.jsx         
│   └── vite.config.js
│
├── supabase/
│   ├── index.ts                   
│   └── constants.ts         
│
└── README.md
```

---

## 🧠 Core Features

- **Symptom Intent Validation**  
  Rejects non-health or unrelated prompts to prevent misuse.

- **AI Triage Analysis**  
  Classifies urgency and suggests a medical department without diagnosing.

- **Privacy-Aware Logging**  
  Only anonymized symptom data and AI output levels are stored.  
  No names, no personal identifiers, no free-text medical history.

- **Responsive UI**  
  Works cleanly across desktop, tablet, and mobile screens.

- **Accessible Animations**  
  All motion respects system “reduced motion” preferences.

---

## 🔌 API Reference

### `POST /triage`

**Request**
```json
{
  "message": "I have chest discomfort and shortness of breath"
}
```

**Response**
```json
{
  "urgency": "High",
  "department": "Emergency Medicine",
  "explanation": "The symptoms described may require urgent medical evaluation.",
  "medical_attention": "Seek immediate professional medical attention.",
  "disclaimer": "This is not a medical diagnosis and does not replace professional medical advice."
}
```

---

## 🗄️ Database Usage (Supabase)

The database is used **only for system-level logging**, not patient records.

Stored fields include:
- Timestamp
- Anonymized symptom keywords
- Urgency level
- Recommended department

**No personally identifiable information (PII) is stored.**

---

## ⚙️ Environment Variables (Backend)

Create a `.env` file inside `/backend`:

```env
OPENROUTER_API_KEY=sk-or-v1-xxxx
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxxx
```

---

## ▶️ Running the Project Locally

### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## 🔒 Security & Safety Design

- Input restricted to symptom-related health concerns
- AI instructed to avoid diagnoses and treatment advice
- Service role keys never exposed to frontend
- Mandatory medical disclaimers in all responses

---

## 📄 Pages

- **Home** – Introduction, workflow, safety notice
- **Chat** – Symptom input and triage result
- **About** – System explanation, limitations, and disclaimers

---

## ⚠️ Medical Disclaimer

SympTriage is an **educational triage guidance tool only**.  
It does **NOT** provide medical diagnoses, treatment plans, or prescriptions.

Always consult a qualified healthcare professional for medical advice.  
In emergencies, contact emergency services immediately.

---

**Author**: Sugan  
**License**: ISC  
**Repository**: https://github.com/SUGAN-2007/symtriage
