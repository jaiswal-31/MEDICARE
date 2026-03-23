// controllers/appointmentController.js

import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import dotenv from "dotenv";
import { getAuth } from "@clerk/express";
import { clerkClient } from "@clerk/clerk-sdk-node";

dotenv.config();

const MAJOR_ADMIN_ID = process.env.MAJOR_ADMIN_ID || null;

/* ---------------- helper ---------------- */
const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

/* =========================================================
   GET ALL APPOINTMENTS
   ========================================================= */
export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    return res.json({ success: true, appointments });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
};

/* =========================================================
   GET APPOINTMENT BY ID
   ========================================================= */
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }
    return res.json({ success: true, appointment });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
};

/* =========================================================
   GET APPOINTMENTS BY PATIENT (ME)
   ========================================================= */
export const getAppointmentsByPatient = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const appointments = await Appointment.find({ createdBy: userId }).sort({ date: 1, time: 1 });
    return res.json({ success: true, appointments });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
};

/* =========================================================
   CREATE APPOINTMENT
   ========================================================= */
export const createAppointment = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { doctorId, patientName, mobile, age, gender, date, time, fee, fees, notes = "", email, paymentMethod } = req.body;

    if (!doctorId || !patientName || !mobile || !date || !time) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    const numericFee = safeNumber(fee ?? fees ?? 0);
    if (numericFee === null) {
      return res.status(400).json({ success: false, message: "Invalid fee" });
    }

    let doctor;
    try {
      doctor = await Doctor.findById(doctorId);
    } catch (err) {
      return res.status(400).json({ success: false, message: "Invalid doctorId" });
    }

    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const existing = await Appointment.findOne({ doctorId, createdBy: userId, date, time, status: { $ne: "Canceled" } });
    if (existing) {
      return res.status(409).json({ success: false, message: "Slot already booked" });
    }

    const created = await Appointment.create({
      doctorId,
      doctorName: doctor.name,
      speciality: doctor.specialization,
      doctorImage: { url: doctor.imageUrl || doctor.image || "" },
      patientName,
      mobile,
      age,
      gender,
      date,
      time,
      fees: numericFee,
      status: "Confirmed",
      payment: {
        method: paymentMethod === "Cash" ? "Cash" : "Online",
        status: paymentMethod === "Online" ? "Paid" : "Pending",
        amount: numericFee,
      },
      notes,
      email,
      createdBy: userId,
      owner: doctor.owner || MAJOR_ADMIN_ID,
    });

    return res.status(201).json({ success: true, appointment: created });
  } catch (err) {
    console.error("createAppointment ERROR:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =========================================================
   UPDATE APPOINTMENT
   ========================================================= */
export const updateAppointment = async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json({ success: true, appointment: updated });
  } catch (err) {
    return res.status(500).json({ success: false });
  }
};

/* =========================================================
   CANCEL APPOINTMENT
   ========================================================= */
export const cancelAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    appt.status = "Canceled";
    await appt.save();
    return res.json({ success: true, appointment: appt });
  } catch (err) {
    return res.status(500).json({ success: false });
  }
};

/* =========================================================
   GET STATS
   ========================================================= */
export const getStats = async (req, res) => {
  try {
    const total = await Appointment.countDocuments();
    return res.json({ success: true, stats: { total } });
  } catch (err) {
    return res.status(500).json({ success: false });
  }
};

/* =========================================================
   GET APPOINTMENTS BY DOCTOR
   ========================================================= */
export const getAppointmentsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const appointments = await Appointment.find({ doctorId });
    return res.json({ success: true, appointments });
  } catch (err) {
    return res.status(500).json({ success: false });
  }
};

/* =========================================================
   GET REGISTERED USER COUNT
   ========================================================= */
export const getRegisteredUserCount = async (req, res) => {
  try {
    const totalUsers = await clerkClient.users.getCount();
    return res.json({ success: true, totalUsers });
  } catch (err) {
    return res.status(500).json({ success: false });
  }
};