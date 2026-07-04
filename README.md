# 🚀 BuildFlow MERN

BuildFlow is a full-stack **Project Management and Team Collaboration Platform** built with the **MERN Stack**. It combines project management, AI-powered productivity tools, document storage, and communication features into a single modern dashboard.

## 🌐 Live Demo

- **Frontend:** https://build-flow-mern.vercel.app/login
- **Backend API:** https://build-flow-mern-backend.vercel.app/

---

## ✨ Features

### 🔐 Authentication
- Secure User Registration & Login
- JWT Authentication
- Role-based access (Manager & User)

### 📋 Task Tracker
- Create Tasks
- Delete Tasks
- Organize tasks by:
  - Pending
  - In Progress
  - Completed

### 🤖 AI Document Generator
Generate professional documents instantly using **Google Gemini AI**.

Supported document types include:
- Leave Requests
- Formal Letters
- Reports
- Custom Documents

Export generated documents as **PDF**.

### 📝 AI Meeting Summarizer
- Paste meeting notes
- Generate concise AI-powered summaries
- Extract key action items

### 📧 Email Sender
- Send emails directly from the dashboard
- Custom recipient, subject, and message

### 📁 Document Management
- Upload files
- View stored documents
- Delete documents
- Manager document repository

### 🚨 Request Management
- View and manage user requests
- Dashboard notification count

### 📱 Responsive Design
- Desktop
- Tablet
- Mobile Friendly

---

## 🛠️ Tech Stack

### Frontend
- React
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Google Gemini API
- Nodemailer

### Database
- MongoDB Atlas

### Deployment
- Frontend: Vercel
- Backend: Vercel

---

## 📂 Project Structure

```text
BuildFlow-MERN/
├── client/
├── server/
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/TahirHameed106/BuildFlow-MERN.git
cd BuildFlow-MERN
```

### Install Dependencies

Frontend

```bash
cd client
npm install
```

Backend

```bash
cd ../server
npm install
```

### Environment Variables

Create a `.env` file inside the `server` folder.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_google_gemini_api_key

EMAIL_USER=your_email

EMAIL_PASS=your_email_password
```

---

## 🚀 Running the Application

Backend

```bash
npm run dev
```

Frontend

```bash
npm start
```

---

## 📸 Features Overview

- 🔐 Authentication
- 📋 Task Tracker
- 🤖 AI Document Generator
- 📝 AI Meeting Summarizer
- 📧 Email Sender
- 📁 Document Management
- 🚨 Request Management
- 📱 Responsive Dashboard

---

## 🔮 Future Enhancements

- Team collaboration workspace
- Calendar integration
- Task deadlines & reminders
- Real-time notifications
- AI task prioritization
- Dashboard analytics
- Activity history

---

## 👨‍💻 Author

**Tahir Hameed**

GitHub: https://github.com/TahirHameed106

---

⭐ If you found this project helpful, consider giving it a star!
