# 🚀 BuildFlow MERN

BuildFlow is a full-stack project management application built with the **MERN Stack**. It helps users create and manage projects, organize tasks, and collaborate through a clean and responsive interface.

## 🌐 Live Demo

* **Frontend:** https://build-flow-mern.vercel.app/login
* **Backend API:** https://build-flow-mern-backend-19c1869df-leclercs-projects-6739f3e2.vercel.app/

## ✨ Features

* User Authentication (Register & Login)
* Create, Update, and Delete Projects
* Task Management
* Secure REST API
* Responsive Design
* MongoDB Atlas Database Integration

## 🛠️ Tech Stack

### Frontend

* React
* React Router
* Axios
* CSS

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication

### Deployment

* Frontend: Vercel
* Backend: Vercel
* Database: MongoDB Atlas

## 📁 Project Structure

```text
BuildFlow-MERN/
├── client/      # React Frontend
├── server/      # Express Backend
└── README.md
```

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/TahirHameed106/BuildFlow-MERN.git
cd BuildFlow-MERN
```

### 2. Install dependencies

Frontend:

```bash
cd client
npm install
```

Backend:

```bash
cd ../server
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the server folder and add your MongoDB Atlas connection string and JWT secret.

Example:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

### 4. Run the project

Backend:

```bash
npm run dev
```

Frontend:

```bash
npm start
```

## 🚀 Deployment

* **Frontend:** Deployed on **Vercel**
* **Backend:** Deployed on **Vercel**
* **Database:** **MongoDB Atlas**

## 📌 Project Status

✅ Completed core features with full-stack integration.

Future improvements may include:

* Team collaboration
* File uploads
* Notifications
* Dashboard analytics

## 👨‍💻 Author

**Tahir Hameed**

GitHub: https://github.com/TahirHameed106
