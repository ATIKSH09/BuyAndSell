import express from "express";
import { Router } from "express";
import Item from "../models/Item.js";
import { authenticateToken } from "../middlewares/jwtauth.js";
import User from "../models/User.js";
import mongoose from "mongoose";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello from item routes");
});

router.post("/sellItem", authenticateToken, async (req, res) => {
  try {
    // const { name, price, description } = req.body;
    const user = await User.findById(req.user.mongoId);
    const item = await Item.create({
      ...req.body,
      seller: {
        name: user.name,
        email: user.email,
      },
    });
    user.inProgress.push({
      id : item._id,
      name : item.name,
      price : item.price,
      addedon : item.addedOn,
    });
    await user.save();
    res.status(200).send("Item added successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/getItems", async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/getSpecificItem/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      res.status(404).send("Item not found");
    }
    res.status(200).json(item);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
