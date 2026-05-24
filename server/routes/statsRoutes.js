// routes/statsRoutes.js
const express = require("express");
const router = express.Router();
const { getStats, incrementStat } = require("../controllers/statsController");

router.get("/", getStats);
router.post("/increment", incrementStat);

module.exports = router;
