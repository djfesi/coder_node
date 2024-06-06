const express = require("express");
const { generateProducts } = require("../mocks/generateProducts");

const router = express.Router();

// Obtener los productos por mock
router.get("/", (req, res) => {
  const products = [];
  for (let i = 0; i < 50; i++) {
    products.push(generateProducts(100));
  }

  res.status(200).json(products);
});

module.exports = router;
