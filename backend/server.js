import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import studentRoutes from "./routes/students.js";
import roomRoutes from "./routes/rooms.js";
import bedRoutes from "./routes/beds.js";
import attendanceRoutes from "./routes/attendance.js";
import paymentRoutes from "./routes/payments.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ status: "HostelHub API running" }));

app.use("/api/students", studentRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/beds", bedRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/payments", paymentRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
