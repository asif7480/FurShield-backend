import express from 'express';

import {
  createPet,
  deletePet,
  getAllPets,
  getOwnerPets,
  getPetById,
  getPetRecordsForVet,
  updatePet,
} from '../controllers/pet.controller.mjs';
import { verifyToken } from '../middlewares/auth.middleware.mjs';
import upload from '../middlewares/multer.middleware.mjs';
import { checkRole } from '../middlewares/role.middleware.mjs';

const petRouter = express.Router();


petRouter.post("/", verifyToken, checkRole("owner","admin"),upload.single("image"), createPet);
petRouter.get("/", getAllPets)
petRouter.get("/ownerPets", verifyToken, checkRole("owner","admin"), getOwnerPets);
petRouter.get("/:id", verifyToken, checkRole("owner","admin"), getPetById);
petRouter.put("/:id", verifyToken, checkRole("owner","admin"), updatePet);
petRouter.delete("/:id", verifyToken, checkRole("owner","admin"), deletePet);
petRouter.get("/:petId/records", verifyToken, checkRole("vet","admin"), getPetRecordsForVet);

export default petRouter;
