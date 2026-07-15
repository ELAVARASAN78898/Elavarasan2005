import express from "express";
import { getAttendance, markAttendance, deleteAttendance } from "../controllers/attendanceController.js";

const router = express.Router();

router.get("/", getAttendance);
router.post("/", markAttendance);
router.delete("/:id", deleteAttendance);

export default router;
