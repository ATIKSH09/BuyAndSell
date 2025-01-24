import express from "express";
import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { generateToken } from "../Functions/tokenGenerater.js";
import { authenticateToken } from "../middlewares/jwtauth.js";
import Item from "../models/Item.js";
import { nanoid } from "nanoid";
import mongoose from "mongoose";
import { EventEmitter } from "events";

EventEmitter.defaultMaxListeners = 20; // Or another appropriate number

const ObjectId = mongoose.Types.ObjectId;
const router = Router();

router.get("/", (req, res) => {
  res.send("working fine");
});

// register route
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).send("User Already Exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    res.cookie("token", generateToken(user), {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).send("Registered Successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("Invalid Email");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(420).send("wrong password");
    }
    res.cookie("token", generateToken(user), {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).send("Logged in Successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/getProfile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.mongoId);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).send("Logged out Successfully");
});

router.get("/checkLogin", authenticateToken, (req, res) => {
  try {
    res.status(200).send("Logged In");
  } catch (error) {
    console.log(error);
  }
});

router.post("/sendBuyRequest/:id", authenticateToken, async (req, res) => {
  try {
    const buyer = await User.findById(req.user.mongoId);
    const item = await Item.findById(req.params.id);
    const seller = await User.findOne({ email: item.seller.email });
    const toPush = {
      buyer: {
        email: buyer.email,
        name: buyer.name,
      },
      seller: {
        email: seller.email,
        name: seller.name,
      },
      item: {
        mongoid: item._id,
        name: item.name,
        price: item.price,
      },
      status: "Pending",
      id: nanoid(10),
    };
    if(buyer.email == seller.email){
      res.status(409).send("You cannot buy your own item");
    }
    seller.incomingRequests.push(toPush);
    buyer.outgoingRequests.push(toPush);
    await seller.save();
    await buyer.save();
    res.status(200).send("Order Request Sent");
  } catch (error) {
    console.log(error);
  }
});

// getRequests route

router.get("/getRequests", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.mongoId);
    const allRequests = {
      incomingRequests: user.incomingRequests,
      outgoingRequests: user.outgoingRequests,
    };
    res.status(200).send(allRequests);
  } catch (error) {
    console.log(error);
  }
});

router.post("/acceptRequest/:id", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.mongoId);

    // Validate seller and incoming requests

    const sellerIncomingRequests = user.incomingRequests;
    const request = sellerIncomingRequests.find(
      (r) => r.id.toString() === req.params.id
    );

    const buyer = await User.findOne({ email: request.buyer.email });

    // Validate buyer and outgoing requests

    const buyerOutgoingRequests = buyer.outgoingRequests || [];
    const oldRequest = buyerOutgoingRequests.find(
      (r) => r.id.toString() === req.params.id
    );

    // Update buyer's request status and message
    oldRequest.status = req.body.status;
    if (oldRequest.status == "Accepted") {
      oldRequest.message = req.body.message;
    } else {
      oldRequest.message = "Rejected by Seller";
    }

    // Update seller's incoming requests
    user.incomingRequests = sellerIncomingRequests.filter(
      (r) => r.id.toString() !== req.params.id
    );

    // Save changes to both buyer and seller

    if (req.body.status === "Accepted") {
      // remove the item for GB
      await Item.findByIdAndDelete(oldRequest.item.mongoid);
      // add the item to the buyer purchased list
      buyer.purchased.push({ ...oldRequest.item, soldOn: new Date() });
      // add the item to the seller sold list
      user.sold.push({ ...oldRequest.item, soldOn: new Date() });
      user.inProgress = user.inProgress.filter(
        (item) => !item.id.equals(new ObjectId(oldRequest.item.mongoid))
      );
    }

    await buyer.save();
    await user.save();

    res.status(200).send("Request accepted successfully");
  } catch (error) {
    console.error("Error accepting request:", error);
    res.status(500).send("Failed to accept request");
  }
});

export default router;
