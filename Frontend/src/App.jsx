import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TaskBoard from "./pages/TaskBoard";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import { TaskProvider } from "./contexts/TaskContext";
import { UserProvider } from "./contexts/UserContext";

import "./index.css";

function App() {
  return (
    <AuthProvider>
      <UserProvider>  
      <TaskProvider>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute><TaskBoard /></PrivateRoute>} />
        </Routes>
      </TaskProvider>
      </UserProvider>
    </AuthProvider>
  );
}

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
}

export default App;
