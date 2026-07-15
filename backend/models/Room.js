import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    number: { type: String, required: true, unique: true, trim: true },
    floor: { type: String, trim: true },
    type: { type: String, enum: ["Single", "Double", "Triple", "Dormitory"], default: "Double" },
    capacity: { type: Number, required: true, default: 2 },
    status: { type: String, enum: ["Active", "Maintenance", "Closed"], default: "Active" }
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
