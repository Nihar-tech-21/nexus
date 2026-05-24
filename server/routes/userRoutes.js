const express = require("express");
const router = express.Router();
const { deleteUser } = require("../controllers/userController");
const protect = require("../middlewares/authMiddleware");

// @route   DELETE /api/users/:id
router.delete("/:id", protect, deleteUser);

module.exports = router;
