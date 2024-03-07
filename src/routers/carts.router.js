const express = require("express");
const CartManager = require("../controllers/cartManager");
const router = express.Router();
const path = `${__dirname}/../../data/carts.json`;
const cartManager = new CartManager(path);

// Crear carrito de compras
router.post("/", async (_, res) => {
    try {
        const cartId = await cartManager.createCart();
        res.status(201).json({ id: cartId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Agregar un producto al carrito
router.post("/:cid/products/:pid", async (req, res) => {
  try {
      await cartManager.addProductToCart(parseInt(req.params.cid), parseInt(req.params.pid));
      res.status(200).json({ message: "Producto agregado al carrito" });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


// Obtener productos de un carrito de compras por ID
router.get("/:cid", async (req, res) => {
    try {
        const cartProducts = await cartManager.getCartProducts(parseInt(req.params.cid));
        if (cartProducts) {
            res.json(cartProducts);
        } else {
            res.status(404).json({ error: "Carrito no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
