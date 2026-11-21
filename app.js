import express from 'express'
import dotenv from 'dotenv'
import cors from "cors";

import { rateLimit } from "express-rate-limit";
dotenv.config();



const app = express();

app.use(
    cors({
        origin:process.env.ORIGIN
    })
)
app.use(express.json({ limit: "16kb" }));


import enquiryRoutes from './routes/enquiry.rotues.js'

// Limit repeated form submissions
const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later."
  }
});
app.get("/", (req, res) => {
  res.send("Solar website API is running!");
});

app.use(
  "/api/enquiries",
  enquiryLimiter,
  enquiryRoutes
);

export default app;