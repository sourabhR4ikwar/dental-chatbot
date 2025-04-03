# 🦷 Dental Appointment Assistant – Documentation

A conversational, AI-powered assistant for booking and managing appointments at a dental clinic.

---

## 🏗️ Architecture Overview

The appointment scheduling assistant is built as a **serverless, conversational application** powered by OpenAI’s GPT-4, with backend logic written in **Next.js App Router**. It enables users to interact naturally via chat to manage dental appointments for themselves or their families.

### 🎯 High-Level Goals
- Provide a **human-like conversational assistant**
- Support **identity verification**, **emergency handling**, and **family scheduling**
- Use a fast, testable mock backend

### 🧱 Core Components

| Layer                        | Description                                                                 |
|-----------------------------|-----------------------------------------------------------------------------|
| **Frontend / Chat UI**      | A minimal chat interface powered by GPT-4 and Next.js            |
| **`/api/chat/route.ts`**    | Main orchestrator that sends messages to GPT-4 and handles tool responses   |
| **OpenAI GPT-4**            | Conversational brain that interprets user input and calls backend tools     |
| **Tools (Function Calling)**| Defines what GPT-4 is allowed to do (e.g. `bookAppointment`, `logEmergency`)|
| **API Routes (Next.js)**    | Handlers for each tool call, executing backend logic                        |
| **Mock DB (`mockDB.json`)** | Stores patients, appointments, available slots, and emergency reports       |

---

## 🛠️ Technologies Used

- **Next.js (App Router)** – API routing and server functions
- **OpenAI GPT-4** – Natural conversation and tool-calling
- **TypeScript** – Type-safe development
- **Node.js** – Execution environment for APIs
- **Mock JSON DB** – Lightweight file-based data store
- **Tailwind CSS** *(optional)* – UI styling

---

## 🧠 Design Decisions & Rationale

### ✅ GPT-4 Tool Calling
GPT determines when to call backend logic using OpenAI's function-calling system, enabling human-like conversations with structured backend actions.

### ✅ Identity Verification
Users must verify their identity (name + DOB) before rescheduling, canceling, or viewing appointments.

### ✅ Emergency Logging ≠ Slot Booking
Emergencies are triaged, not scheduled. They’re logged via `logEmergency` and flagged for follow-up.

### ✅ Family Scheduling Logic
Uses `bookFamilyAppointments` to:
- Collect multiple patient names, DOBs, and appointment types
- Find **N** consecutive slots
- Book each member in a coordinated way

### ✅ Flexible Backend (Mock DB)
Mock JSON DB supports:
- New and existing patients
- Slot availability
- Emergency queue
- Easy testing and resetting

---

## 🚀 Setup & Usage Instructions

### 📦 Install

```bash
git clone <your-repo-url>
cd dental-chatbot
npm install
```

---

### 🔐 Environment Setup

Create a `.env.local`:

```env
OPENAI_API_KEY=your-openai-api-key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

### ▶️ Run

```bash
npm run dev
```

Visit the app at `http://localhost:3000`

---

### 🧪 Test the Bot

Try prompts like:

- “I want to book a cleaning next Monday at 10am.”
- “I need to cancel my appointment.”
- “I have a dental emergency — my molar is cracked.”
- “Can I book checkups for me and my two kids starting at 9am?”

---

## 💬 Supported Features

- ✅ New & Existing Patient Flows
- 📅 Book, Cancel, Reschedule
- 👪 Book Family Appointments (Back-to-Back)
- 🚨 Emergency Triage
- 🕒 Slot Availability + Time Suggestions
- 🧾 Insurance & Payment Info
- 📍 Location & Hours

---

## 🔒 Next Steps (for Production)

- Replace mock DB with a real database (PostgreSQL, MongoDB)
- Add user auth/session for persistent identity
- Build admin dashboard for managing appointments
- Deploy to Vercel / Railway / Render

---