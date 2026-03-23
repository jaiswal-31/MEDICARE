// routes/appointmentRouter.js
import express from "express";
import { clerkMiddleware, requireAuth, getAuth } from "@clerk/express";

const checkAuth = (req, res, next) => {
  const auth = getAuth(req);
  if (!auth?.userId) {
    return res.status(401).json({ success: false, message: "Unauthenticated: Please sign in." });
  }
  next();
};
import {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  getStats,
  getAppointmentsByPatient,
  getAppointmentsByDoctor,
  getRegisteredUserCount,
} from "../controllers/appointmentController.js";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const appointmentRouter = express.Router();

/* =========================
   PUBLIC / FIXED ROUTES
   ========================= */

// list appointments
appointmentRouter.get("/", getAppointments);


// stats
appointmentRouter.get("/stats/summary", getStats);

/* =========================
   AUTHENTICATED ROUTES
   ========================= */

// create appointment
appointmentRouter.post(
  "/",
  checkAuth,
  createAppointment
);

// 🔥 IMPORTANT: /me MUST COME BEFORE /:id
appointmentRouter.get(
  "/me",
  checkAuth,
  getAppointmentsByPatient
);
// appointmentRouter.get("/:id", getAppointmentById);
appointmentRouter.get(
  "/doctor/:doctorId",
  getAppointmentsByDoctor
);

appointmentRouter.post("/:id/cancel", cancelAppointment);
appointmentRouter.get("/paitents/count",getRegisteredUserCount); 
appointmentRouter.put("/:id", updateAppointment);


export default appointmentRouter;
