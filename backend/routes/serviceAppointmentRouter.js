// routes/serviceAppointmentRouter.js
import express from "express";
import { getAuth } from "@clerk/express";

const checkAuth = (req, res, next) => {
  const auth = getAuth(req);
  if (!auth?.userId) {
    return res.status(401).json({ success: false, message: "Unauthenticated: Please sign in." });
  }
  next();
};

import {
  getServiceAppointments,
  getServiceAppointmentById,
  createServiceAppointment,
  updateServiceAppointment,
  cancelServiceAppointment,
  getServiceAppointmentStats,
  getServiceAppointmentsByPatient,
} from "../controllers/serviceAppointmentController.js";


const router = express.Router();

/* FIXED ROUTES FIRST */
router.get("/", getServiceAppointments);
router.get("/stats/summary", getServiceAppointmentStats);

router.post("/", checkAuth, createServiceAppointment);

// must be before /:id
router.get("/me", checkAuth, getServiceAppointmentsByPatient);

/* ID ROUTES LAST */
router.get("/:id", getServiceAppointmentById);
router.put("/:id", updateServiceAppointment);
router.post("/:id/cancel", cancelServiceAppointment);

export default router;
