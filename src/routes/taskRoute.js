const express = require("express");
const { fetch, fetchAll, create, update, remove } = require("../controller/taskController");
const authMiddleware = require("../middleware/authMiddleware");

const route = express.Router();

/**
 * @swagger
 * /api/tasks/fetch/{title}:
 *   get:
 *     summary: Fetch a task by title
 *     description: Fetches a task by its title
 *     parameters:
 *       - name: title
 *         in: path
 *         description: The title of the task to fetch
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task details
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal Server error
 */
route.get("/fetch/:title", authMiddleware, fetch);

/**
 * @swagger
 * /api/tasks/fetchAll:
 *   get:
 *     summary: Get all tasks
 *     description: Fetches all tasks from the list
 *     responses:
 *       200:
 *         description: List of tasks
 *       500:
 *         description: Internal Server error
 */
route.get("/fetchAll", authMiddleware, fetchAll);

/**
 * @swagger
 * /api/tasks/create:
 *   post:
 *     summary: Create a new task
 *     description: Adds a new task to the task list
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *             required:
 *               - title
 *               - status
 *     responses:
 *       200:
 *         description: Task created successfully
 *       500:
 *         description: Internal Server error
 */
route.post("/create", authMiddleware, create);

/**
 * @swagger
 * /api/tasks/update/{title}:
 *   put:
 *     summary: Update a task by title
 *     description: Updates a task by its title
 *     parameters:
 *       - name: title
 *         in: path
 *         description: The title of the task to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal Server error
 */
route.put("/update/:title", authMiddleware, update);

/**
 * @swagger
 * /api/tasks/remove/{title}:
 *   delete:
 *     summary: Delete a task by title
 *     description: Deletes a task based on the title
 *     parameters:
 *       - name: title
 *         in: path
 *         description: The title of the task to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal Server error
 */
route.delete("/remove/:title", authMiddleware, remove);

module.exports = route;
