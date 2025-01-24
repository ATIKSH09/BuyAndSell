import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import UserRoutes from "./routes/UserRoutes.js";
import cookieParser from "cookie-parser";
import ItemRoutes from "./routes/ItemRoutes.js";

dotenv.config();
const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/api/user", UserRoutes);
app.use("/api/item", ItemRoutes);

mongoose.connect(process.env.MONGO_URI);

app.get("/", (req, res) => {
  res.send("working fine");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
