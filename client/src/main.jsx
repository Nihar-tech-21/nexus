import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/pages/Home.jsx";
import CreateQuiz from "./components/pages/CreateQuiz.jsx";
import TakeQuiz from "./components/pages/TakeQuiz.jsx";
import Result from "./components/pages/Result.jsx";
import Dashboard from "./components/pages/Dashboard.jsx";
import SignUp from "./components/pages/SignUp.jsx";
import Login from "./components/pages/Login.jsx";

import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/authContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="/create" element={<CreateQuiz />} />
            <Route path="/quiz" element={<TakeQuiz />} />
            <Route path="/quiz/:quizId" element={<TakeQuiz />} />
            <Route path="/result/:quizId" element={<Result />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/auth/register" element={<SignUp />} />
            <Route path="/auth/login" element={<Login />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
