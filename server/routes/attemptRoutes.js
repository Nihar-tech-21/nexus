const express = require("express");
const router = express.Router();
const {
  submitAttempt,
  getAttemptsByQuiz,
} = require("../controllers/attemptController");
const protect = require("../middlewares/authMiddleware");

// POST → record attempt
router.post("/", submitAttempt);

// GET → get results for a specific quiz
router.get("/:quizId", protect, getAttemptsByQuiz);

module.exports = router;
