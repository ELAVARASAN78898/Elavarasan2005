import Room from "../models/Room.js";
import Bed from "../models/Bed.js";

export const getRooms = async (req, res) => {
  const rooms = await Room.find().sort({ number: 1 });
  const withBeds = await Promise.all(
    rooms.map(async (room) => {
      const beds = await Bed.find({ room: room._id });
      const occupied = beds.filter((b) => b.status === "Occupied").length;
      return { ...room.toObject(), bedCount: beds.length, occupied };
    })
  );
  res.json(withBeds);
};

export const createRoom = async (req, res) => {
  const room = await Room.create(req.body);
  res.status(201).json(room);
};

export const updateRoom = async (req, res) => {
  const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!room) return res.status(404).json({ message: "Room not found" });
  res.json(room);
};

export const deleteRoom = async (req, res) => {
  const room = await Room.findByIdAndDelete(req.params.id);
  if (!room) return res.status(404).json({ message: "Room not found" });
  await Bed.deleteMany({ room: room._id });
  res.json({ message: "Room removed" });
};
