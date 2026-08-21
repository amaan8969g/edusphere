# EduSphere

EduSphere is a full-stack Learning Management System (LMS) with a React + Vite client and an Express + MongoDB server.

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/amaan8969g/Education-Sphere)
[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/amaan8969g/Education-Sphere)

---

## 🚀 Instant One-Click Run in Browser

Anyone can run this project instantly in their browser with zero local setup:

- **GitHub Codespaces**: Click **[Open in GitHub Codespaces](https://codespaces.new/amaan8969g/Education-Sphere)** to launch an interactive cloud environment.
- **Gitpod**: Click **[Open in Gitpod](https://gitpod.io/#https://github.com/amaan8969g/Education-Sphere)** for instant browser-based execution.

---

## Requirements
- Node.js (v18+ recommended)
- npm
- MongoDB (local or MongoDB Atlas)

## Project Layout
- `./client` — React front-end (Vite)
- `./server` — Express API server

## Environment Setup
Create a `.env` file in the `server/` directory:

```env
MONGO_URI=mongodb://127.0.0.1:27017/edusphere
CLIENT_URL=http://localhost:5173
JWT_SECRET=edusphere_jwt_secret_key_production_grade_998811
PORT=5000
NODE_ENV=development
```

## Local Development Setup

Open two terminals:

### 1. Server
```bash
cd server
npm install
npm run dev
```

### 2. Client
```bash
cd client
npm install
npm run dev
```

Default ports:
- **Server API**: `http://localhost:5000`
- **Client App**: `http://localhost:5173`

---

## Build / Production
```bash
# Build Client
cd client
npm run build

# Start Server
cd server
npm start
```

"# edusphere" 
