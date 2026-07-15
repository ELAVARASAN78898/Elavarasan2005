import Student from "../models/Student.js";
import Bed from "../models/Bed.js";

export const getStudents = async (req, res) => {
  const students = await Student.find().populate("room").populate("bed").sort({ createdAt: -1 });
  res.json(students);
};

export const getStudent = async (req, res) => {
  const student = await Student.findById(req.params.id).populate("room").populate("bed");
  if (!student) return res.status(404).json({ message: "Student not found" });
  res.json(student);
};

export const createStudent = async (req, res) => {
  const student = await Student.create(req.body);
  if (req.body.bed) {
    await Bed.findByIdAndUpdate(req.body.bed, { status: "Occupied", occupant: student._id });
  }
  res.status(201).json(student);
};

export const updateStudent = async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!student) return res.status(404).json({ message: "Student not found" });
  res.json(student);
};

export const deleteStudent = async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) return res.status(404).json({ message: "Student not found" });
  if (student.bed) {
    await Bed.findByIdAndUpdate(student.bed, { status: "Vacant", occupant: null });
  }
  res.json({ message: "Student removed" });
};
