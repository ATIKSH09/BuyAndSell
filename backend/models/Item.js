import mongoose from "mongoose";
const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  seller: {
    type: Object,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  categories: {
    type: Array,
    required: true,
  },
  addedOn: {
    type: Date,
    default: new Date(),
  },
  soldOn: {
    type: Date,
  },
});

const Item = mongoose.model("Item", itemSchema);
export default Item;
