import mongoose from "mongoose";

const bedSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    status: { type: String, enum: ["Vacant", "Occupied", "Reserved"], default: "Vacant" },
    occupant: { type: mongoose.Schema.Types.ObjectId, ref: "Student", default: null }
  },
  { timestamps: true }
);

export default mongoose.model("Bed", bedSchema);
