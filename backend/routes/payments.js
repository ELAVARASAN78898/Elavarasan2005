import express from "express";
import {
  getPayments,
  getPaymentSummary,
  createPayment,
  updatePayment,
  deletePayment
} from "../controllers/paymentController.js";

const router = express.Router();

router.get("/", getPayments);
router.get("/summary", getPaymentSummary);
router.post("/", createPayment);
router.put("/:id", updatePayment);
router.delete("/:id", deletePayment);

export default router;
