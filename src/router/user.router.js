const express = require("express");
const router = express.Router();
const { getTasksByUser } = require("../controller/tasks.controller");

/**
 * @swagger
 * /users/{userId}/tasks:
 *   get:
 *     summary: Ambil task milik user tertentu
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID user
 *     responses:
 *       200:
 *         description: Task user berhasil diambil
 *       404:
 *         description: User tidak ditemukan
 */
router.get("/:userId/tasks", getTasksByUser);

module.exports = router;
