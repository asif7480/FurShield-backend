import express from 'express';

import appointmentRouter from './appointment.route.mjs';
import authRouter from './auth.routes.mjs';
import articleRouter from './careArticle.route.mjs';
import cartRouter from './cart.route.mjs';
import healthRecordRouter from './healthRecord.route.mjs';
import notificationRouter from './notification.route.mjs';
import petRouter from './pet.route.mjs';
import productRouter from './product.route.mjs';
import ratingRouter from './rating.route.mjs';
import shelterPetRouter from './shelterPet.route.mjs';

const router = express.Router()
 
router.use("/api/v1/auth", authRouter);
router.use("/api/v1/pets", petRouter);
router.use("/api/v1/products", productRouter);
router.use("/api/v1/health-record", healthRecordRouter);
router.use("/api/v1/appointments", appointmentRouter);
router.use("/api/v1/shelter-pets", shelterPetRouter);
router.use("/api/v1/cart", cartRouter);
router.use("/api/v1/articles", articleRouter);
router.use("/api/v1/notifications", notificationRouter);
router.use("/api/v1/ratings", ratingRouter);


export default router