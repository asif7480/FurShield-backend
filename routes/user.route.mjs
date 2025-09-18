import express from "express"
import { getAllOwners, getAllShelters, getAllVets } from "../controllers/user.controller.mjs"
const userRouter = express.Router()


userRouter.get("/owners", getAllOwners)
userRouter.get("/vets", getAllVets)
userRouter.get("/shelters", getAllShelters)

export default userRouter