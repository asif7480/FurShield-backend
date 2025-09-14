import express from 'express';

import {
  addHealthRecord,
  deleteHealthRecord,
  getHealthRecordsByPet,
  updateHealthRecord,
} from '../controllers/healthRecord.controller.mjs';
import { verifyToken } from '../middlewares/auth.middleware.mjs';
import { checkRole } from '../middlewares/role.middleware.mjs';

const healthRecordRouter = express.Router();

healthRecordRouter.post("/", verifyToken, checkRole("owner", "vet"), addHealthRecord);
healthRecordRouter.get("/:petId", verifyToken, checkRole("owner", "vet"), getHealthRecordsByPet);
healthRecordRouter.put("/:id", verifyToken, checkRole("owner", "vet"), updateHealthRecord);
healthRecordRouter.delete("/:id", verifyToken, checkRole("owner", "vet"), deleteHealthRecord);

export default healthRecordRouter;
