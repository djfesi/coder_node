const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  id: Number,
  products: [
    {
      product: Number,
      quantity: Number,
    },
  ],
  category: String,
});

module.exports = mongoose.model("Cart", schema);
