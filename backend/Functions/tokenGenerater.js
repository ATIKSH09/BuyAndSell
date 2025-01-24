import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (user) => {
  return jwt.sign({ mongoId: user._id }, process.env.ACCESS_TOKEN_SECRET);
};

export { generateToken };
