import express from "express";
import { getBeds, createBed, updateBed, deleteBed } from "../controllers/bedController.js";

const router = express.Router();

router.get("/", getBeds);
router.post("/", createBed);
router.put("/:id", updateBed);
router.delete("/:id", deleteBed);

export default router;
