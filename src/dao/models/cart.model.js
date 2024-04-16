const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number },
    },
  ],
});

module.exports = mongoose.model("Cart", CartSchema);
