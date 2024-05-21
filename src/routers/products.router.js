const express = require("express");
const ProductController = require("../controllers/product.controller");

const router = express.Router();
const productController = new ProductController();

// Obtener los productos
router.get("/", (req, res) => productController.getProducts(req, res));

// Obtener un producto por su ID
router.get("/:pid", (req, res) => productController.getProductById(req, res));

// Agregar un nuevo producto
router.post("/", (req, res) => productController.addProduct(req, res));

// Actualizar un producto por ID
router.put("/:pid", (req, res) => productController.updateProduct(req, res));

// Eliminar un producto por ID
router.delete("/:pid", (req, res) => productController.deleteProduct(req, res));

module.exports = router;
