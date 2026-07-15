import Bed from "../models/Bed.js";

export const getBeds = async (req, res) => {
  const beds = await Bed.find().populate("room").populate("occupant").sort({ createdAt: 1 });
  res.json(beds);
};

export const createBed = async (req, res) => {
  const bed = await Bed.create(req.body);
  res.status(201).json(bed);
};

export const updateBed = async (req, res) => {
  const bed = await Bed.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!bed) return res.status(404).json({ message: "Bed not found" });
  res.json(bed);
};

export const deleteBed = async (req, res) => {
  const bed = await Bed.findByIdAndDelete(req.params.id);
  if (!bed) return res.status(404).json({ message: "Bed not found" });
  res.json({ message: "Bed removed" });
};
