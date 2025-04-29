import React from "react";

const TaskCard = ({ task }) => {
  return (
    <div className="task-card">
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <small>Assigned to: {task.assignedTo?.name || "Unassigned"}</small>
    </div>
  );
};

export default TaskCard;
