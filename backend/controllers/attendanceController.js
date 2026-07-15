import Attendance from "../models/Attendance.js";

export const getAttendance = async (req, res) => {
  const filter = {};
  if (req.query.date) filter.date = req.query.date;
  const records = await Attendance.find(filter).populate("student").sort({ date: -1 });
  res.json(records);
};

export const markAttendance = async (req, res) => {
  const { student, date, status, remarks } = req.body;
  const record = await Attendance.findOneAndUpdate(
    { student, date },
    { student, date, status, remarks },
    { new: true, upsert: true }
  );
  res.status(201).json(record);
};

export const deleteAttendance = async (req, res) => {
  const record = await Attendance.findByIdAndDelete(req.params.id);
  if (!record) return res.status(404).json({ message: "Record not found" });
  res.json({ message: "Attendance record removed" });
};
