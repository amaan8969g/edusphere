# 🎓 EduSphere — Next-Gen Learning Management System

EduSphere is a **full-stack Learning Management System (LMS)** designed to provide an interactive and modern learning experience for students, instructors, and administrators.

The platform supports **online courses, video lessons, quizzes, live virtual classrooms, real-time chat, aptitude practice, educational articles, certificates, and role-based dashboards**.

---

## 🌐 Live Project

### Backend API

🚀 **Deployed Backend:**
https://edusphere-m3ff.onrender.com

> The backend API is currently deployed on Render. The React frontend can be run locally or deployed separately.

### GitHub Repository

📦 **Source Code:**
https://github.com/amaan8969g/Education-Sphere

---

## ✨ Features

### 👨‍🎓 Student Features

* 📚 Browse and enroll in courses
* 🎥 Watch video-based course lessons
* 📊 Track course and lesson progress
* 📝 Attempt timed quizzes
* ⚡ Automatic quiz evaluation
* 🔄 Retake quizzes
* 🧠 Practice aptitude questions
* 🎓 Earn course completion certificates
* 🔴 Join live virtual classes
* 💬 Participate in real-time classroom chat
* 📰 Read educational articles
* 📱 Responsive student dashboard

### 👨‍🏫 Instructor Features

* 📚 Create and manage courses
* 🎥 Add video lessons
* 🗂️ Organize courses into modules
* 📝 Create and manage quizzes
* ⏱️ Configure timed assessments
* 🔴 Schedule live classes
* 📡 Host virtual classroom sessions
* 💬 Communicate with students through real-time chat
* 📱 Generate attendance QR codes
* 📰 Publish educational articles
* 📊 Monitor student performance

### 🛡️ Administrator Features

* 📊 System analytics dashboard
* 👥 Manage users
* 👨‍🏫 Manage instructors
* 🎓 Manage students
* 🗂️ Manage course categories
* 🔐 Role-based access control
* 📈 Monitor platform activity
* ⚙️ Manage platform resources

---

# 🛠️ Technology Stack

## Frontend

| Technology       | Purpose                 |
| ---------------- | ----------------------- |
| React 18         | User interface          |
| Vite             | Frontend build tool     |
| React Router     | Application routing     |
| Tailwind CSS     | Styling                 |
| Axios            | API communication       |
| Lucide React     | Icons                   |
| Socket.io Client | Real-time communication |

## Backend

| Technology         | Purpose                 |
| ------------------ | ----------------------- |
| Node.js            | Server runtime          |
| Express.js         | REST API framework      |
| MongoDB            | Database                |
| Mongoose           | MongoDB ODM             |
| Socket.io          | Real-time communication |
| JWT                | Authentication          |
| bcryptjs           | Password hashing        |
| Helmet             | Security headers        |
| CORS               | Cross-origin requests   |
| Express Rate Limit | API protection          |
| Multer             | File uploads            |
| QRCode             | QR code generation      |

## Testing

| Tool       | Purpose               |
| ---------- | --------------------- |
| Jest       | Backend testing       |
| Supertest  | API testing           |
| Vitest     | Frontend unit testing |
| Cypress    | End-to-end testing    |
| Playwright | Browser testing       |

---

# 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │     React Client    │
                    │     Vite + React    │
                    └──────────┬──────────┘
                               │
                               │ HTTP / Axios
                               ▼
                    ┌─────────────────────┐
                    │   Express Backend   │
                    │    Node.js API      │
                    └──────────┬──────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
          ┌──────────┐  ┌────────────┐  ┌───────────┐
          │ MongoDB  │  │ Socket.io  │  │   JWT     │
          │  Atlas   │  │ Real-time  │  │   Auth    │
          └──────────┘  └────────────┘  └───────────┘
```

---

# 📁 Project Structure

```text
EduSphere/
│
├── client/                         # React frontend
│   │
│   ├── src/
│   │   ├── api/                    # Axios API services
│   │   ├── components/             # Reusable components
│   │   ├── context/                # React contexts
│   │   ├── pages/
│   │   │   ├── admin/              # Admin pages
│   │   │   ├── instructor/         # Instructor pages
│   │   │   ├── student/            # Student pages
│   │   │   └── public/             # Public pages
│   │   ├── router/                 # Application routes
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/                         # Express backend
│   │
│   ├── config/                     # Database configuration
│   ├── controllers/                # Business logic
│   ├── middleware/                 # Authentication & validation
│   ├── models/                     # Mongoose models
│   ├── routes/                     # API routes
│   ├── services/                   # Services & Socket.io
│   ├── uploads/                    # Uploaded files
│   ├── server.js                   # Backend entry point
│   └── package.json
│
├── package.json                    # Root configuration
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have the following installed:

* [Node.js](https://nodejs.org/) v18 or higher
* npm v9 or higher
* MongoDB or MongoDB Atlas
* Git

---

# 📥 Installation

## 1. Clone the Repository

```bash
git clone https://github.com/amaan8969g/Education-Sphere.git
```

Move into the project:

```bash
cd Education-Sphere
```

---

## 2. Install Backend Dependencies

```bash
cd server
npm install
```

---

## 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

---

# 🔐 Environment Variables

## Backend

Create:

```text
server/.env
```

Add:

```env
PORT=5000
NODE_ENV=development

MONGO_URI=mongodb://127.0.0.1:27017/edusphere

CLIENT_URL=http://localhost:5173

JWT_SECRET=your_secure_jwt_secret
```

### MongoDB Atlas

If you are using MongoDB Atlas, replace the local MongoDB connection string:

```env
MONGO_URI=mongodb://127.0.0.1:27017/edusphere
```

with your Atlas connection string:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/edusphere
```

> Never commit your `.env` file or database credentials to GitHub.

---

## Frontend

Create:

```text
client/.env
```

For local development:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

For the deployed backend:

```env
VITE_API_BASE_URL=https://edusphere-m3ff.onrender.com/api
```

After changing Vite environment variables, restart the frontend development server.

---

# ▶️ Running the Application

## Start Backend

Open a terminal:

```bash
cd server
npm run dev
```

Backend will run on:

```text
http://localhost:5000
```

---

## Start Frontend

Open another terminal:

```bash
cd client
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

---

# 🔗 API Configuration

During local development:

```text
Frontend
http://localhost:5173

        ↓

Backend
http://localhost:5000/api
```

When using the deployed backend:

```text
Frontend
Your deployed frontend URL

        ↓

Backend
https://edusphere-m3ff.onrender.com/api
```

---

# 🔌 API Overview

| Module         | Endpoint           | Description                                 |
| -------------- | ------------------ | ------------------------------------------- |
| Authentication | `/api/auth`        | Registration, login and user authentication |
| Courses        | `/api/courses`     | Course and lesson management                |
| Enrollments    | `/api/enrollments` | Course enrollment and progress              |
| Quizzes        | `/api/quizzes`     | Quiz creation, attempts and results         |
| Articles       | `/api/articles`    | Educational article management              |
| Classes        | `/api/classes`     | Live class scheduling and sessions          |
| Admin          | `/api/admin`       | Administration and system management        |

---

# 🔐 Authentication

EduSphere uses **JWT-based authentication**.

The authentication flow is:

```text
User
  │
  ▼
Login / Register
  │
  ▼
Backend Authentication
  │
  ▼
JWT Token
  │
  ▼
Authenticated API Requests
  │
  ▼
Role-Based Authorization
```

Supported roles:

```text
Student
Instructor
Admin
```

Protected routes verify the user's authentication token and role before allowing access.

---

# 👥 User Roles

| Role             | Capabilities                                                      |
| ---------------- | ----------------------------------------------------------------- |
| 👤 Guest         | Browse public courses, articles and authentication pages          |
| 🎓 Student       | Enroll, learn, take quizzes, attend classes and earn certificates |
| 👨‍🏫 Instructor | Create courses, quizzes, articles and live classes                |
| 🛡️ Admin        | Manage users, instructors, categories and platform analytics      |

---

# 🎥 Course Learning

Students can:

1. Browse available courses
2. Enroll in a course
3. Open course modules
4. Watch video lessons
5. Mark lessons as completed
6. Track learning progress
7. Complete quizzes
8. Finish the course
9. Receive a completion certificate

---

# 📝 Quiz System

The quiz engine supports:

* Multiple-choice questions
* Timed quizzes
* Automatic evaluation
* Score calculation
* Point-based questions
* Quiz attempts
* Result tracking
* Retakes

Example flow:

```text
Instructor creates quiz
        ↓
Instructor adds questions
        ↓
Student starts quiz
        ↓
Timer begins
        ↓
Student submits answers
        ↓
Automatic evaluation
        ↓
Score generated
        ↓
Result displayed
```

---

# 🔴 Live Virtual Classroom

EduSphere provides real-time virtual classroom functionality using **Socket.io**.

Features include:

* Live classroom sessions
* Real-time communication
* Classroom chat
* Session management
* Attendance support
* QR-based attendance

---

# 🧠 Aptitude Hub

The Aptitude Hub allows students to practice questions across different domains.

Students can:

* Practice aptitude questions
* Attempt assessments
* View results
* Improve their performance

---

# 📰 Educational Articles

Instructors can publish educational content directly on EduSphere.

Article functionality includes:

* Create articles
* Edit articles
* Publish articles
* Browse public articles
* Display educational and technical content

---

# 🎓 Certificates

Students can receive certificates after successfully completing eligible courses.

The certificate system is connected to course completion and student progress.

---

# 📊 Admin Dashboard

Administrators can monitor the platform through a centralized dashboard.

The dashboard provides information such as:

* Total users
* Students
* Instructors
* Courses
* Enrollments
* Platform activity
* Categories
* System statistics

---

# 🧪 Testing

## Backend Tests

```bash
cd server
npm test
```

## Frontend Tests

```bash
cd client
npm run test
```

## End-to-End Tests

```bash
cd client
npm run e2e
```

---

# 📜 Available Scripts

## Root

```bash
npm run client
npm run server
npm run build
npm run start
npm run test
```

## Server

```bash
npm run dev
npm start
npm test
```

## Client

```bash
npm run dev
npm run build
npm run preview
npm run test
```

> Available scripts may vary depending on the current `package.json` configuration.

---

# 🚀 Deployment

## Backend Deployment

The EduSphere backend is deployed using **Render**.

Production backend:

```text
https://edusphere-m3ff.onrender.com
```

The backend uses environment variables for:

* MongoDB connection
* JWT secret
* Client URL
* Production environment configuration

### Render Environment Variables

Configure the following variables in the Render dashboard:

```env
NODE_ENV=production
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret
CLIENT_URL=your_frontend_url
```

Do not expose these credentials publicly.

---

# 🌐 Frontend Deployment

The React frontend can be deployed separately using a frontend hosting platform.

Before deployment, configure:

```env
VITE_API_BASE_URL=https://edusphere-m3ff.onrender.com/api
```

Then create a production build:

```bash
cd client
npm run build
```

The generated production files will be located in:

```text
client/dist/
```

---

# 🔒 Security

EduSphere implements several security mechanisms:

* JWT authentication
* Password hashing with bcryptjs
* Role-based authorization
* Helmet security headers
* CORS configuration
* Rate limiting
* Protected API routes
* Environment-based secrets
* Input validation

### Important

Never commit:

```text
.env
.env.local
.env.production
```

to GitHub.

Add them to `.gitignore`:

```gitignore
node_modules/
.env
.env.*
!.env.example
uploads/*
```

---

# 🤝 Contributing

Contributions are welcome.

### 1. Fork the repository

```bash
git fork https://github.com/amaan8969g/Education-Sphere.git
```

### 2. Create a feature branch

```bash
git checkout -b feature/AmazingFeature
```

### 3. Commit your changes

```bash
git add .
git commit -m "Add AmazingFeature"
```

### 4. Push your branch

```bash
git push origin feature/AmazingFeature
```

### 5. Open a Pull Request

Submit your Pull Request through GitHub.

---

# 📄 License

This project is licensed under the **MIT License**.

See the `LICENSE` file for more information.

---

# 👨‍💻 Author

**Amaan**

GitHub:
https://github.com/amaan8969g

---

# ❤️ Acknowledgements

EduSphere was built using modern web technologies to provide an interactive and scalable learning experience.

Special thanks to the open-source community and the developers of the technologies used in this project.

---

<div align="center">

### 🎓 EduSphere

**Learn. Practice. Teach. Grow.**

Made with ❤️ for education and learning.

</div>
