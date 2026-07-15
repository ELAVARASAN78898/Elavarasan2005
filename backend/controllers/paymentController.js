import Payment from "../models/Payment.js";

function computeStatus(amount, paid) {
  if (paid >= amount) return "Paid";
  if (paid > 0) return "Partial";
  return "Pending";
}

function generateReceipt() {
  const rand = () => Math.floor(Math.random() * 90000000 + 10000000);
  const suffix = Math.floor(Math.random() * 900 + 100);
  return `RCPT-${rand()}-${suffix}`;
}

export const getPayments = async (req, res) => {
  const payments = await Payment.find().populate("student").sort({ createdAt: -1 });
  res.json(payments);
};

export const getPaymentSummary = async (req, res) => {
  const payments = await Payment.find();
  const collected = payments.reduce((sum, p) => sum + p.paid, 0);
  const total = payments.reduce((sum, p) => sum + p.amount, 0);
  res.json({ collected, pending: total - collected, total });
};

export const createPayment = async (req, res) => {
  const { student, type, amount, paid } = req.body;
  const payment = await Payment.create({
    receipt: generateReceipt(),
    student,
    type,
    amount,
    paid,
    status: computeStatus(amount, paid)
  });
  res.status(201).json(payment);
};

export const updatePayment = async (req, res) => {
  const { amount, paid } = req.body;
  const updates = { ...req.body };
  if (amount !== undefined && paid !== undefined) {
    updates.status = computeStatus(amount, paid);
  }
  const payment = await Payment.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!payment) return res.status(404).json({ message: "Payment not found" });
  res.json(payment);
};

export const deletePayment = async (req, res) => {
  const payment = await Payment.findByIdAndDelete(req.params.id);
  if (!payment) return res.status(404).json({ message: "Payment not found" });
  res.json({ message: "Payment removed" });
};
