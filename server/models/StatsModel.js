// server/models/statsModel.js
const mongoose = require("mongoose");

const statsSchema = new mongoose.Schema({
  signups: { type: Number, default: 0 },
  quizzesCreated: { type: Number, default: 0 },
  quizzesAttempted: { type: Number, default: 0 },
});

// Prevent OverwriteModelError
module.exports = mongoose.models.Stats || mongoose.model("Stats", statsSchema);
