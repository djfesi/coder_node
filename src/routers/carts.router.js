const express = require("express");
const CartManagerDB = require("../dao/dbManager/cartManager");

const router = express.Router();
const cartManagerDB = new CartManagerDB();

// Crear carrito de compras
router.post("/", async (_, res) => {
    try {
        const cartId = await cartManagerDB.createCart();
        res.status(201).json({ id: cartId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Agregar un producto al carrito
router.post("/:cid/products/:pid", async (req, res) => {
  try {
      await cartManagerDB.addProductToCart(req.params.cid, req.params.pid);
      res.status(200).json({ message: "Producto agregado al carrito" });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


// Obtener productos de un carrito de compras por ID
router.get("/:cid", async (req, res) => {
    try {
        const cartProducts = await cartManagerDB.getCartProducts(req.params.cid);
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
