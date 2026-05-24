const Quiz = require("../models/Quiz");
const Attempt = require("../models/Attempt");
const Stats = require("../models/StatsModel");

const getUserQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdById: req.user._id }).sort({
      createdAt: -1,
    });

    const withLinks = quizzes.map((quiz) => ({
      _id: quiz._id,
      title: quiz.title,
      createdBy: quiz.createdBy,
      timePerQuestion: quiz.timePerQuestion,
      totalQuestions: quiz.questions.length,
      createdAt: quiz.createdAt,
      shareableLink: `${process.env.VITE_FRONTEND_URL}/quiz/${quiz._id}`,
    }));

    res.json(withLinks);
  } catch (error) {
    console.error("Error fetching user quizzes:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching user quizzes" });
  }
};

// Create a new quiz
const createQuiz = async (req, res) => {
  try {
    const { title, questions, timePerQuestion } = req.body;

    if (!req.user || !req.user.name)
      return res.status(401).json({ message: "Unauthorized" });

    if (!title?.trim() || !Array.isArray(questions) || questions.length === 0)
      return res.status(400).json({ message: "Invalid quiz data" });

    const formattedQuestions = questions.map((q) => {
      if (q.type === "short") {
        return {
          question: q.question?.trim(),
          type: "short",
          correctAnswerText: q.correctAnswerText?.trim() || "",
          marks: q.marks ?? 1,
        };
      } else if (q.type === "mcq") {
        return {
          question: q.question?.trim(),
          type: "mcq",
          options: q.options?.filter((opt) => opt?.trim() !== "") || [],
          correctIndex:
            typeof q.correctIndex === "number" ? q.correctIndex : q.correct,
          marks: q.marks ?? 1,
        };
      }
    });

    const newQuiz = await Quiz.create({
      title: title.trim(),
      questions: formattedQuestions,
      createdBy: req.user.name,
      createdById: req.user._id,
      timePerQuestion: timePerQuestion || 20,
    });

    // Generate actual shareable link after saving
    newQuiz.shareableLink = `${process.env.VITE_FRONTEND_URL}/quiz/${newQuiz._id}`;
    await newQuiz.save();

    await Stats.findOneAndUpdate(
      {},
      {
        $inc: { quizzesCreated: 1 },
        $setOnInsert: { signups: 0, quizzesAttempted: 0 },
      },
      { upsert: true, new: true },
    );

    res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      quiz: newQuiz,
    });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ message: "Server error while creating quiz" });
  }
};

// Get quiz by ID
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    res.json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ message: "Server error while fetching quiz" });
  }
};

// 🗑️ Delete a quiz (only by its creator)
const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    if (quiz.createdById.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this quiz" });
    }

    await Attempt.deleteMany({ quizId: quiz._id });

    await quiz.deleteOne();
    res.json({
      success: true,
      message: "Quiz and all related attempts deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res.status(500).json({ message: "Server error while deleting quiz" });
  }
};

module.exports = {
  getUserQuizzes,
  createQuiz,
  getQuizById,
  deleteQuiz,
};
