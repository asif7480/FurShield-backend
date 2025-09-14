import express from 'express';

import {
  addCareLog,
  addShelterPet,
  deleteShelterPet,
  getShelterPetById,
  getShelterPets,
  updateAdoptionStatus,
  updateShelterPet,
} from '../controllers/shelterPet.controller.mjs';
import { verifyToken } from '../middlewares/auth.middleware.mjs';
import upload from '../middlewares/multer.middleware.mjs';
import { checkRole } from '../middlewares/role.middleware.mjs';

const shelterPetRouter = express.Router();


shelterPetRouter.post("/", verifyToken, checkRole("shelter"), upload.array("images", 3) , addShelterPet);
shelterPetRouter.get("/", verifyToken, checkRole("shelter"), getShelterPets);
shelterPetRouter.get("/:id", verifyToken, checkRole("shelter"), getShelterPetById);
shelterPetRouter.put("/:id", verifyToken, checkRole("shelter"), updateShelterPet);
shelterPetRouter.delete("/:id", verifyToken, checkRole("shelter"), deleteShelterPet);
shelterPetRouter.post("/:id/care-log", verifyToken, checkRole("shelter"), addCareLog);
shelterPetRouter.put("/:id/adoption-status", verifyToken, checkRole("shelter"), updateAdoptionStatus);

export default shelterPetRouter;
