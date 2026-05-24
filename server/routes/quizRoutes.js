const express = require("express");
const {
  getUserQuizzes,
  getQuizById,
  createQuiz,
  deleteQuiz,
} = require("../controllers/quizController");

const protect = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", protect, getUserQuizzes);

router.post("/", protect, createQuiz);

router.get("/:id", getQuizById);

router.delete("/:id", protect, deleteQuiz);

module.exports = router;
