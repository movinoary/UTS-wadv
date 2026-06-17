const express = require("express");
const router = express.Router();
const { getTasksByUser } = require("../controller/tasks.controller");

router.get("/:userId/tasks", getTasksByUser);

module.exports = router;
