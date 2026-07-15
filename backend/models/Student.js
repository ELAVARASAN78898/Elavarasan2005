import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    rollNo: { type: String, trim: true },
    department: { type: String, trim: true },
    year: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    bed: { type: mongoose.Schema.Types.ObjectId, ref: "Bed" },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    admittedOn: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
