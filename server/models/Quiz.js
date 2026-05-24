const mongoose = require("mongoose");

// 🧩 Question Schema
const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  type: { type: String, enum: ["mcq", "short"], required: true },

  // ✅ For MCQs
  options: {
    type: [String],
    validate: {
      validator: function (v) {
        return this.type === "mcq" ? v && v.length === 4 : true; // must have 4 options for MCQ
      },
      message: "MCQ type questions must have 4 options.",
    },
  },
  correctIndex: {
    type: Number,
    validate: {
      validator: function (v) {
        return this.type === "mcq" ? v !== undefined : true;
      },
      message: "MCQ must have a correct option index.",
    },
  },

  // ✅ For short answers
  correctAnswerText: {
    type: String,
    validate: {
      validator: function (v) {
        return this.type === "short" ? v && v.trim().length > 0 : true;
      },
      message: "Short answer questions must have a correct answer text.",
    },
  },

  marks: { type: Number, default: 1 },
});

// 🧾 Quiz Schema
const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    questions: {
      type: [questionSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "Quiz must contain at least one question.",
      },
    },

    createdBy: {
      type: String, // username for display
      required: true,
    },

    createdById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    timePerQuestion: { type: Number, default: 20 },

    shareableLink: { type: String },
  },
  { timestamps: true }
);

quizSchema.pre("remove", async function (next) {
  try {
    await Attempt.deleteMany({ quizId: this._id });
    console.log(`Deleted all attempts for quiz: ${this.title}`);
    next();
  } catch (err) {
    console.error("Error deleting attempts for quiz:", err);
    next(err);
  }
});

// 🔹 Optional: TTL index for automatic deletion after 15 days
quizSchema.index({ createdAt: 1 }, { expireAfterSeconds: 15 * 24 * 60 * 60 });

module.exports = mongoose.model("Quiz", quizSchema);
