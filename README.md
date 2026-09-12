# EverTales AI – Intelligent Digital Memory Archive

A full-stack web app for preserving personal memories (text, photos, voice) with
AI-powered speech-to-text transcription and automatic tag generation.

## Stack
- **Frontend:** React.js (Vite) + Tailwind CSS + React Router + Axios
- **Backend:** Node.js + Express + MySQL
- **AI:** Whisper (speech-to-text), NLP-based auto-tagging

## Project Structure
```
evertales-ai/
├── backend/          # Express API server
│   ├── src/
│   │   ├── config/       # DB connection config
│   │   ├── models/       # SQL query layer (Users, Stories, Media, Tags, Categories)
│   │   ├── controllers/  # Request handlers / business logic
│   │   ├── routes/       # Express route definitions
│   │   └── middleware/   # Auth (JWT) + file upload (multer)
│   └── uploads/      # Uploaded photos/voice files
├── frontend/         # React app
│   └── src/
│       ├── pages/        # Landing, Login, Register, Dashboard, AddStory, etc.
│       ├── components/   # Reusable UI pieces (Navbar, StoryCard, ...)
│       ├── services/     # Axios API client
│       └── routes/       # React Router config
└── database/
    └── schema.sql    # MySQL schema matching the SRS
```

## Getting Started

### 1. Database
```bash
mysql -u root -p < database/schema.sql
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in DB credentials + JWT secret
npm run dev             # starts on http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev             # starts on http://localhost:5173
```

## Development Roadmap (from SRS)
- **Phase 1:** Authentication, Database, Story CRUD ✅ (scaffolded)
- **Phase 2:** Media Upload, Story Library, Search
- **Phase 3:** AI Speech-to-Text, AI Tag Generation
- **Phase 4:** UI Improvements, Testing, Deployment

## Notes
- `npm install` was **not** run in this scaffold (no network access here) — run it
  yourself in each folder before starting the servers.
- All controller functions currently contain `TODO` comments marking where to
  fill in real logic — the routing (routes → controllers → models) is already
  wired up for you.
