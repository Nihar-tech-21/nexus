const Attempt = require("../models/Attempt");
const Quiz = require("../models/Quiz");
const Stats = require("../models/StatsModel");

// Record a new attempt
const submitAttempt = async (req, res) => {
  try {
    const { quizId, participantName, email, score, totalMarks, timeTaken } =
      req.body;

    if (!quizId || !participantName)
      return res.status(400).json({ message: "Quiz ID and name required" });

    const existing = await Attempt.findOne({ quizId, email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You have already attempted this quiz.",
      });
    }

    const attempt = await Attempt.create({
      quizId,
      participantName,
      email,
      score,
      totalMarks,
      timeTaken,
    });
    await Stats.findOneAndUpdate(
      {},
      { $inc: { quizzesAttempted: 1 } },
      { upsert: true, new: true }
    );

    res.status(201).json({ success: true, attempt });
  } catch (err) {
    console.error("Error saving attempt:", err);
    res.status(500).json({ message: "Server error while saving attempt" });
  }
};

// Get all attempts for a specific quiz (for results page)
const getAttemptsByQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Check if current logged-in user is the creator
    if (quiz.createdById.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Access denied. You are not the creator of this quiz.",
      });
    }

    const attempts = await Attempt.find({ quizId })
      .sort([
        ["score", -1], // highest score first
        ["timeTaken", 1], // quicker time wins on tie
      ])
      .lean();

    res.json({ success: true, attempts });
  } catch (err) {
    console.error("Error fetching attempts:", err);
    res.status(500).json({ message: "Server error while fetching attempts" });
  }
};

module.exports = { submitAttempt, getAttemptsByQuiz };
