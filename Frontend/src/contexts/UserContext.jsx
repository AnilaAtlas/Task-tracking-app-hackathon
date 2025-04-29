import React, { createContext, useState, useEffect } from "react";
import { BACKEND_URL } from "../config";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/user`, {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token}` },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UserContext.Provider value={{ users }}>
      {children}
    </UserContext.Provider>
  );
};
