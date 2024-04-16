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

// Eliminar un producto específico del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        await cartManagerDB.removeProductFromCart(req.params.cid, req.params.pid);
        res.status(200).json({ message: "Producto eliminado del carrito" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar la cantidad de un producto específico en el carrito
router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { quantity } = req.body;
        if (typeof quantity !== 'number' || quantity < 1) {
            return res.status(400).json({ error: "Cantidad inválida" });
        }
        await cartManagerDB.updateProductQuantity(req.params.cid, req.params.pid, quantity);
        res.status(200).json({ message: "Cantidad actualizada correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar todos los productos del carrito
router.delete("/:cid", async (req, res) => {
    try {
        await cartManagerDB.emptyCart(req.params.cid);
        res.status(200).json({ message: "Carrito vaciado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
