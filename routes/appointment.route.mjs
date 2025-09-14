import express from 'express';

import {
  createAppointment,
  deleteAppointment,
  getAllAppointments,
  getOwnerAppointments,
  getVetAppointments,
  updateAppointment,
} from '../controllers/appointment.controller.mjs';
import { verifyToken } from '../middlewares/auth.middleware.mjs';
import { checkRole } from '../middlewares/role.middleware.mjs';

const appointmentRouter = express.Router();


appointmentRouter.post("/", verifyToken, checkRole("owner"), createAppointment);
appointmentRouter.get("/", verifyToken, checkRole("admin"), getAllAppointments);
appointmentRouter.get("/owner", verifyToken, checkRole("owner"), getOwnerAppointments);
appointmentRouter.get("/vet", verifyToken, checkRole("vet"), getVetAppointments);
appointmentRouter.put("/:id", verifyToken, checkRole("vet"), updateAppointment);
appointmentRouter.delete("/:id", verifyToken, checkRole("owner", "vet"), deleteAppointment);

export default appointmentRouter;
