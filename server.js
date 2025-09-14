import 'dotenv/config';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import connectDB from './config/db.config.mjs';
import errorHandler from './middlewares/error.middleware.mjs';
import router from './routes/index.route.mjs';
import authRouter from './routes/auth.routes.mjs';
import petRouter from './routes/pet.route.mjs';
import productRouter from './routes/product.route.mjs';
import healthRecordRouter from './routes/healthRecord.route.mjs';
import appointmentRouter from './routes/appointment.route.mjs';
import shelterPetRouter from './routes/shelterPet.route.mjs';
import cartRouter from './routes/cart.route.mjs';
import articleRouter from './routes/careArticle.route.mjs';
import notificationRouter from './routes/notification.route.mjs';
import ratingRouter from './routes/rating.route.mjs';

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan("tiny"))
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

// app.use(router)
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/pets", petRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/health-record", healthRecordRouter);
app.use("/api/v1/appointments", appointmentRouter);
app.use("/api/v1/shelter-pets", shelterPetRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/articles", articleRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/ratings", ratingRouter);

connectDB()
app.use(errorHandler)

app.get("/", (request,response) => {
    return response.status(200).json({ message: "Server up and running."})
})

app.listen(port, () => {
    console.log(`Server is running at port: ${port}`);
})

export default app