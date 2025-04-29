import React, { createContext, useState, useEffect, useContext } from "react";
import { BACKEND_URL } from "../config";
import { UserContext } from "./UserContext"; // 👈 import UserContext

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { users } = useContext(UserContext); // 👈 get users
  const [tasks, setTasks] = useState([]);

  const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? { Authorization: `Bearer ${user.token}` } : {};
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/tasks`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });
      const data = await res.json();
  
      if (Array.isArray(data)) {
        setTasks(data); // 👈 Save tasks directly, no manual user mapping
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.error(err);
    }
  };
  
  

  const createTask = async (task) => {
    try {
      await fetch(`${BACKEND_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(task),
      });
      await fetchTasks(); // <-- Fetch again after creating new task
    } catch (err) {
      console.error(err);
    }
  };
  

  const updateTask = async (id, updates) => {
    try {
      await fetch(`${BACKEND_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(updates),
      });
      setTasks((prev) => prev.map((task) => (task._id === id ? { ...task, ...updates } : task)));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${BACKEND_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: {
          ...getAuthHeaders(),
        },
      });
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [users]); // 👈 Important: refetch tasks when users are ready!

  return (
    <TaskContext.Provider value={{ tasks, createTask, updateTask, deleteTask, fetchTasks }}>
      {children}
    </TaskContext.Provider>
  );
  
  
};
