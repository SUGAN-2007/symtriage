# Symtriage - Medical Symptom Triage Application

AI-powered symptom triage assessment with urgency classification and department recommendations. Built with React, Tailwind, Framer Motion (frontend) and Express, Supabase (backend).

## 🚀 Quick Start

### Prerequisites
- Node.js 18+, npm 9+
- OpenRouter API key
- Supabase account

### Setup

```bash
# Backend
cd backend && npm install
# Create .env with: OPENROUTER_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
npm run dev  # http://localhost:5000

# Frontend (new terminal)
cd frontend && npm install
npm run dev  # http://localhost:5173
```

## 📁 Project Structure

```
symptriage/
├── frontend/              React 19.1, Vite, Tailwind, Framer Motion
│   ├── src/
│   │   ├── components/   Header, AnimatedButton, AnimatedCard
│   │   ├── pages/        Home, Chatbot (main), About
│   │   ├── hooks/        useReducedMotion (accessibility)
│   │   └── App.jsx       Router with 3 pages
├── backend/               Express, Supabase, OpenRouter AI
│   ├── index.js          POST /triage endpoint
│   ├── supabase.js       Database client
│   └── symptoms.js       ~90 symptom keywords + body parts
└── README.md
```

## 🎯 Key Features

- **AI Triage**: GPT-4o-mini analyzes symptoms → urgency (Low/Medium/High) + department
- **Smooth Animations**: Framer Motion with accessibility (prefers-reduced-motion)
- **Privacy**: Anonymized logging, no PHI stored
- **Responsive**: Mobile-optimized with animated mobile menu
- **Error Handling**: Intent validation, shake animation on errors

## 🔧 Frontend Stack
- React 19.1.1, React Router 7.12.0
- Vite 7.1.7, Tailwind 4.1.18
- Framer Motion 12.26.2
- Run: `npm run dev` | Build: `npm run build`

## ⚙️ Backend Stack
- Express 5.2.1, CORS enabled
- Supabase (@supabase/supabase-js 2.90.1)
- OpenRouter API (GPT-4o-mini routing)
- Run: `npm run dev` | Port: 5000

## 📊 API: POST /triage

**Request**: `{ "message": "I have a fever and headache" }`

**Response** (200):
```json
{
  "urgency": "Medium",
  "department": "Emergency Medicine",
  "explanation": "...",
  "medical_attention": "Seek care within 24h",
  "disclaimer": "Not a diagnosis"
}
```

## .env Template (Backend)
```
OPENROUTER_API_KEY=sk-or-v1-xxx
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx
```

## 🎨 UI/UX
- **Colors**: Primary #4a51bd, Urgency (Green/Yellow/Red)
- **Animations**: 150-350ms entrance/interaction, GPU-accelerated
- **Accessibility**: All animations respect system preferences

## 📱 Pages
- **Home**: Hero + How It Works (animated stagger)
- **Chatbot**: Symptom input → Assessment results with urgency badge
- **About**: Triage info, limitations, disclaimer

## 🔒 Security
- Intent validation (symptom queries only)
- Service role key server-side only
- Anonymized logs (symptoms only)
- No PII stored

## 📝 Troubleshooting
- Port 5000 in use? Kill process or change port in index.js
- Build fails? Run `npm install` in respective directory
- Backend not found? Ensure running on http://localhost:5000

## ⚠️ Medical Disclaimer
Educational tool only. NOT a substitute for professional medical advice. Always consult healthcare professionals.

---
**Author**: SUGAN-2007 | **License**: ISC | **Repo**: https://github.com/SUGAN-2007/symtriage
