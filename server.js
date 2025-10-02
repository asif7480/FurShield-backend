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

const allowedOrigins = [
  "http://localhost:5173",
  "https://aptechmetrostargate.com:254",
  "http://aptechmetrostargate.com:254"
];

app.use(cors({
  origin: function (origin, callback) {
    console.log("Origin trying to access:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed from this origin: " + origin));
    }
  },
  credentials: true
}));
// app.use(cors({
//     origin: "http://localhost:5173",
//     credentials: true
// }))

app.get("/", (request, response) => {
    response.status(200).json({
        message: "Health check route working fine."
    })
})

app.use(router)

connectDB()
app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server is running at port: ${port}`);
})

export default app