const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: { type: String },
  description: { type: String },
  price: { type: Number },
  thumbnail: { type: String },
  code: { type: String },
  stock: { type: Number },
  status: { type: Boolean },
  category: { type: String },
});

ProductSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Product", ProductSchema);
