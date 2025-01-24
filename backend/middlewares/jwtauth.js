import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import express from "express";

dotenv.config();

const authenticateToken = (req, res, next) => {
  const token = req.cookies["token"];
  if (token == null) return res.status(401).send("Please Login First");

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

export { authenticateToken };
