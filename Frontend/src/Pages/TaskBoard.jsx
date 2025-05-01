import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "../Components/TaskCard";
import { BACKEND_URL } from "../config";

const statuses = ["To Do", "In Progress", "Done"];

const TaskBoard = () => {
  const [boardTasks, setBoardTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", assignedTo: "" });

  // Get auth headers
  const getAuthHeaders = () => {
    const authUser = JSON.parse(localStorage.getItem("user"));
    return authUser
      ? {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authUser.token}`,
        }
      : { "Content-Type": "application/json" };
  };

  // Load tasks
  const loadTasks = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/tasks`, { headers: getAuthHeaders() });
      const data = await res.json();
      const list = Array.isArray(data.tasks) ? data.tasks : Array.isArray(data) ? data : [];
      setBoardTasks(list);
    } catch (err) {
      console.error(err);
    }
  };

  // Load users for dropdown
  const loadUsers = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/user`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    loadUsers();
    loadTasks();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${BACKEND_URL}/tasks`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ ...form, status: "To Do" }),
      });
      setForm({ title: "", description: "", assignedTo: "" });
      await loadTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragEnd = async ({ destination, source, draggableId }) => {
    if (!destination || destination.droppableId === source.droppableId) return;
    try {
      await fetch(`${BACKEND_URL}/tasks/${draggableId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: destination.droppableId }),
      });
      await loadTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="board-container">
      <h2>Task Board</h2>
      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <select
          name="assignedTo"
          value={form.assignedTo}
          onChange={handleChange}
          required
        >
          <option value="">Assign To</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>{u.name}</option>
          ))}
        </select>
        <button type="submit">Create Task</button>
      </form>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="task-board">
          {statuses.map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  className="column"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h3>{status}</h3>
                  {boardTasks
                    .filter((task) => task.status === status)
                    .map((task, idx) => (
                      <Draggable key={task._id} draggableId={task._id} index={idx}>
                        {(prov) => (
                          <div
                            ref={prov.innerRef}
                            {...prov.draggableProps}
                            {...prov.dragHandleProps}
                          >
                            <TaskCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TaskBoard;
