// index.mjs
import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "./Database/index.mjs";
import userRoutes from "./Routes/userRoutes.mjs";
import taskRoutes from "./Routes/taskRoutes.mjs";
import tokenVerification from "./middlewareFolder/tokenVerification.mjs";

const PORT = process.env.PORT || 3001;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// 4. Custom request logger (method + URL)
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.originalUrl}`);
  next();
});

// 5. Routes
app.use("/api/users", userRoutes);                   
app.use(
  "/api/tasks",
  tokenVerification,
  taskRoutes
);

// 6. 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// 7. Error handler
app.use((err, req, res, next) => {
  console.error("💥 Error:", err);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
});

// 8. Start server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
