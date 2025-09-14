import 'dotenv/config';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import connectDB from './config/db.config.mjs';
import errorHandler from './middlewares/error.middleware.mjs';
import router from './routes/index.route.mjs';

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

app.use(router)

connectDB()
app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server is running at port: ${port}`);
})