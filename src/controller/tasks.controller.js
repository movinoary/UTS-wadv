const taskRepo = require("../repositories/task.repository");

const listTasks = async (req, res, next) => {
  try {
    const { status, priority, sort, order, limit, offset } = req.query;
    const { data, total } = await taskRepo.findMany({
      status,
      priority,
      sort,
      order,
      limit,
      offset,
    });
    const numLimit = Number(limit) || 10;
    const numOffset = Number(offset) || 0;
    res.status(200).json({
      data,
      pagination: {
        total,
        limit: numLimit,
        offset: numOffset,
        hasNext: numOffset + numLimit < total,
        hasPrev: numOffset > 0,
        nextOffset: numOffset + numLimit < total ? numOffset + numLimit : null,
        prevOffset: numOffset > 0 ? Math.max(0, numOffset - numLimit) : null,
      },
    });
  } catch (err) {
    next(err);
  }
};

const createTask = async (req, res, next) => {
  try {
    const task = await taskRepo.create({
      ...req.body,
      userId: req.body.userId || 1,
    });
    res.status(201).set("Location", `/api/v1/tasks/${task.id}`).json({
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

const getTask = async (req, res, next) => {
  try {
    const task = await taskRepo.findById(req.params.id);
    if (!task)
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: `Task ID ${req.params.id} tidak ditemukan.`,
        },
      });
    res.status(200).json({ data: task });
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await taskRepo.update(req.params.id, req.body);
    if (!task)
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: `Task ID ${req.params.id} tidak ditemukan.`,
        },
      });
    res.status(200).json({ data: task });
  } catch (err) {
    next(err);
  }
};

const replaceTask = async (req, res, next) => {
  try {
    const task = await taskRepo.update(req.params.id, req.body);
    if (!task)
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: `Task ID ${req.params.id} tidak ditemukan.`,
        },
      });
    res.status(200).json({ data: task });
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const ok = await taskRepo.remove(req.params.id);
    if (!ok)
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: `Task ID ${req.params.id} tidak ditemukan.`,
        },
      });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const getTasksByUser = async (req, res, next) => {
  try {
    const result = await taskRepo.findByUser(req.params.userId);
    if (!result)
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: `User ID ${req.params.userId} tidak ditemukan.`,
        },
      });
    res.status(200).json({
      data: {
        user: { id: result.id, name: result.name, email: result.email },
        tasks: result.tasks,
        total: result.tasks.length,
      },
    });
  } catch (err) {
    next(err);
  }
};

const INDONESIAN_DAYS = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];
const INDONESIAN_MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const formatDateDetail = (date) => {
  const day = INDONESIAN_DAYS[date.getDay()];
  const month = INDONESIAN_MONTHS[date.getMonth()];
  const paddedHour = String(date.getHours()).padStart(2, "0");
  const paddedMinute = String(date.getMinutes()).padStart(2, "0");
  const paddedSecond = String(date.getSeconds()).padStart(2, "0");

  return `${day}, ${date.getDate()} ${month} ${date.getFullYear()} ${paddedHour}:${paddedMinute}:${paddedSecond}`;
};

const formatDuration = (milliseconds) => {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours} jam ${minutes} menit ${seconds} detik`;
};

const worklogs = async (req, res, next) => {
  try {
    const task = await taskRepo.findById(req.params.id);
    if (!task)
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: `Task ID ${req.params.id} tidak ditemukan.`,
        },
      });

    const createdAt = new Date(task.createdAt);
    const updatedAt = new Date(task.updatedAt);
    const duration = formatDuration(updatedAt - createdAt);
    const startTime = formatDateDetail(createdAt);
    const endTime = formatDateDetail(updatedAt);

    res.status(200).json({
      data: {
        taskId: task.id,
        title: task.title,
        userId: task.user.id,
        startTime,
        endTime,
        description: task.description,
        duration,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listTasks,
  createTask,
  getTask,
  updateTask,
  replaceTask,
  deleteTask,
  getTasksByUser,
  worklogs,
};
