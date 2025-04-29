import express from "express";
const router = express.Router();
import { getTasks, createTask, updateTask, deleteTask, moveTask } from '../Controller/taskController.mjs';

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.patch('/:id/move', moveTask);
router.delete('/:id', deleteTask);

export default router;
