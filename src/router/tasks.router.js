// File: src/router/tasks.router.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controller/tasks.controller");
const validate = require("../middleware/validate");

const {
  createTaskSchema,
  replaceTaskSchema,
  updateTaskSchema,
  listTasksSchema,
} = require("../validations/task.validator");

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Ambil daftar task dengan pagination, filtering, dan sorting
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [todo, in_progress, done]
 *         description: Filter berdasarkan status
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         description: Filter berdasarkan prioritas
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Field untuk sorting
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Urutan sorting
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Jumlah data per halaman
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Jumlah data yang dilewati
 *     responses:
 *       200:
 *         description: Daftar task berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Request query tidak valid
 */
router.get("/", validate(listTasksSchema, "query"), ctrl.listTasks);
/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Buat task baru
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTask'
 *     responses:
 *       201:
 *         description: Task berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Data tidak valid
 */
router.post("/", validate(createTaskSchema, "body"), ctrl.createTask);
router.post("/", validate(createTaskSchema, "body"), ctrl.createTask);
/**
 * @swagger
 * /tasks/{id}/worklogs:
 *   get:
 *     summary: Ambil durasi dan detail waktu task berdasarkan ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID task
 *     responses:
 *       200:
 *         description: Durasi task berhasil diambil
 *       404:
 *         description: Task tidak ditemukan
 */
router.get("/:id/worklogs", ctrl.worklogs);
/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Ambil task berdasarkan ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Task ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task tidak ditemukan
 */
router.get("/:id", ctrl.getTask);
/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Ganti task seluruhnya berdasarkan ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTask'
 *     responses:
 *       200:
 *         description: Task berhasil diganti
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task tidak ditemukan
 */
router.put("/:id", validate(replaceTaskSchema, "body"), ctrl.replaceTask);
/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Perbarui sebagian data task berdasarkan ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTask'
 *     responses:
 *       200:
 *         description: Task berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task tidak ditemukan
 */
router.patch("/:id", validate(updateTaskSchema, "body"), ctrl.updateTask);
/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Hapus task berdasarkan ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       204:
 *         description: Task berhasil dihapus
 *       404:
 *         description: Task tidak ditemukan
 */
router.delete("/:id", ctrl.deleteTask);

module.exports = router;
