# Nexus Quiz Platform 🚀

A full-stack MERN-based quiz platform that enables users to create, share, attempt, and analyze quizzes with an interactive dashboard and performance insights.

## 🌐 Live Demo

**Frontend:** https://nexus-jet-two.vercel.app

---

## 📌 Features

### 🔐 Authentication
- User Signup & Login
- JWT-based Authentication
- Protected Routes

### 📝 Quiz Management
- Create custom quizzes
- Add multiple questions dynamically
- Set timer per question
- Share quiz using a unique link

### 🎯 Quiz Attempt System
- Attempt quizzes seamlessly
- Timer-based quiz experience
- Auto score calculation
- Track completion time

### 📊 Analytics Dashboard
- Leaderboard ranking
- Top scorers visualization
- Score distribution analysis
- Score range breakdown
- Time vs Score performance trend
- CSV export for quiz attempts

### 📱 Responsive Design
- Fully responsive UI
- Mobile-friendly layouts
- Smooth user experience

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- Recharts
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcrypt.js

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## 📂 Project Structure

```txt
Nexus/
│── client/                 # React Frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
│── server/                 # Express Backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── package.json
│   └── server.js
│
│── .gitignore
│── README.md
```

---

## ⚙️ Environment Variables

### Client (`client/.env`)

```env
VITE_BACKEND_URL=https://your-render-backend.onrender.com
```

### Server (`server/.env`)

```env
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

---

## 🚀 Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/nexus.git
cd Nexus
```

### 2️⃣ Setup Frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

### 3️⃣ Setup Backend

```bash
cd server
npm install
npm run dev
```

Backend runs on:

```txt
http://localhost:5000
```

---

## 🔗 API Routes

### Authentication
| Method | Route |
|--------|-------|
| POST | `/api/auth/signup` |
| POST | `/api/auth/login` |

### Quiz
| Method | Route |
|--------|-------|
| POST | `/api/quizzes` |
| GET | `/api/quizzes/:quizId` |

### Attempts
| Method | Route |
|--------|-------|
| POST | `/api/attempts` |
| GET | `/api/attempts/:quizId` |

---

## 📊 Key Functionalities

✅ User Authentication  
✅ Quiz Creation  
✅ Shareable Quiz Links  
✅ Timer-Based Quiz Attempt  
✅ Auto Score Calculation  
✅ Result Analytics Dashboard  
✅ Leaderboard Ranking  
✅ CSV Export of Quiz Attempts  
✅ Responsive Design  

---

## 🎯 Future Improvements

- Google Sheets integration for quiz responses
- Public / Private quiz visibility
- Quiz categories & tags
- Email invitation system
- AI-generated quiz suggestions
- Dark / Light theme toggle

---

## 👩‍💻 Author

**Niharika Dhaka**

LinkedIn:  
https://www.linkedin.com/in/niharika-dhaka

GitHub:  
https://github.com/nihar-tech-21

---

## ⭐ Support

If you found this project useful, consider giving it a **Star ⭐** on GitHub.

Feedback and contributions are always welcome!
