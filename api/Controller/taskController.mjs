import Task from'../models/task.mjs';

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'name');

    if(tasks){
      res.status(200).json({ message: "Task Assigned Successfully", tasks });
    }else{
      res.status(404).json({ error: "Task not Found", status: 404 });
    }
  } catch (err) {
    res.status(500).json({ error: err.message , status:500});
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;
    const task = await Task.create({ title, description, assignedTo});

    if(task){
      res.status(200).json({ message: "Task created successfully!", task });
    }else{
      res.status(404).json({ error: "Task not created", status: 404 });
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message, status:500});
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, description, assignedTo, status } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, assignedTo, status },
      { new: true }
    );
    if(task){
      res.status(200).json({ message: "Task updated successfully!", task });
    }else{
      res.status(404).json({ error: "Task not updated", status: 404 });
  } }catch (err) {
    res.status(500).json({ error: err.message, status:500});
  }
};

const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const moveTask = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(task);
    if(task){
      res.status(200).json({ message: "Task moved successfully!", task });
    }else{
      res.status(404).json({ error: "Task not moved", status: 404 });
  }} catch (err) {
    res.status(500).json({ error: err.message, status:500 });
  }
};
export {getTasks, createTask, updateTask, deleteTask,moveTask}
