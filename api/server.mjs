import express from 'express';
import morgan from 'morgan';
import mongoose from "./Database/index.mjs";
import userRoutes from "./Routes/userRoutes.mjs";
import cors from "cors";
import taskRoutes from './Routes/taskRoutes.mjs';
import tokenVerification from './middlewareFolder/tokenVerification.mjs';

mongoose.connection.on("open", () => console.log("MongoDB connected"));
mongoose.connection.on("error", () => console.log("Error in connecting MongoDB"));

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use("/api", userRoutes);
app.use('/api/tasks', tokenVerification, taskRoutes);

app.use("/", (req, res, next) => {
  console.log("Request URL:", req.url, "method:", req.method);
  next();
});

export default app;
