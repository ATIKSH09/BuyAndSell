import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  purchased: {
    type: Array,
    default: [],
  },
  inProgress: {
    type: Array,
    default: [],
  },
  sold: {
    type: Array,
    default: [],
  },
  incomingRequests: {
    type: [
      {
        buyer: {
          email: { type: String, required: true },
          name: { type: String, required: true },
        },
        seller: {
          email: { type: String, required: true },
          name: { type: String, required: true },
        },
        item: {
          mongoid: { type: String, required: true },
          name: { type: String, required: true },
          price: { type: Number, required: true },
        },
        status: { type: String, default: "pending" },
        id: { type: String, required: true },
      },
    ],
    default: [],
  },
  outgoingRequests: {
    type: [
      {
        buyer: {
          email: { type: String, required: true },
          name: { type: String, required: true },
        },
        seller: {
          email: { type: String, required: true },
          name: { type: String, required: true },
        },
        item: {
          mongoid: { type: String, required: true },
          name: { type: String, required: true },
          price: { type: Number, required: true },
        },
        message: { type: String, default: "pending" },
        status: { type: String, default: "pending" },
        id: { type: String, required: true },
      },
    ],
    default: [],
  },

  isAdmin: {
    type: Boolean,
    default: false,
  },
  itmesSold: {
    type: Number,
    default: 0,
  },
  since: {
    type: Date,
    default: new Date(),
  },
});

const User = mongoose.model("User", userSchema);
export default User;
