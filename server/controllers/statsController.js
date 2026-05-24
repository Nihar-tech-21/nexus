// controllers/statsController.js
const Stats = require("../models/StatsModel");

// Get current stats
exports.getStats = async (req, res) => {
  try {
    let stats = await Stats.findOne();
    if (!stats) stats = await Stats.create({});
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Increment specific field
exports.incrementStat = async (req, res) => {
  try {
    const { type } = req.body; // "signup" | "created" | "attempted"
    let stats = await Stats.findOne();
    if (!stats) stats = await Stats.create({});

    if (type === "signup") stats.signups += 1;
    else if (type === "created") stats.quizzesCreated += 1;
    else if (type === "attempted") stats.quizzesAttempted += 1;

    await stats.save();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
