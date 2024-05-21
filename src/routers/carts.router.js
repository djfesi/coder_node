const express = require("express");
const CartController = require("../controllers/cart.controller");

const router = express.Router();
const cartController = new CartController();

// Crear carrito de compras
router.post("/", (req, res) => cartController.createCart(req, res));

// Agregar un producto al carrito
router.post("/:cid/products/:pid", (req, res) => cartController.addProductToCart(req, res));

// Obtener productos de un carrito de compras por ID
router.get("/:cid", (req, res) => cartController.getCartProducts(req, res));

// Eliminar un producto específico del carrito
router.delete("/:cid/products/:pid", (req, res) => cartController.removeProductFromCart(req, res));

// Actualizar la cantidad de un producto específico en el carrito
router.put("/:cid/products/:pid", (req, res) => cartController.updateProductQuantity(req, res));

// Eliminar todos los productos del carrito
router.delete("/:cid", (req, res) => cartController.emptyCart(req, res));

module.exports = router;
