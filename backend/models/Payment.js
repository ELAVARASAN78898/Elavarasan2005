import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    receipt: { type: String, required: true, unique: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    type: { type: String, enum: ["Rent", "Mess", "Deposit", "Fine"], default: "Rent" },
    amount: { type: Number, required: true },
    paid: { type: Number, required: true, default: 0 },
    status: { type: String, enum: ["Paid", "Partial", "Pending"], default: "Pending" },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
