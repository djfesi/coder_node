const express = require("express");
const ProductManager = require("../controllers/productManager");
const router = express.Router();
const path = `${__dirname}/../../data/products.json`;

const productManager = new ProductManager(path);

// Obtener los productos
router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit;
    let products = await productManager.getProducts();
    if (limit) {
      if (isNaN(limit) || limit <= 0) {
        res.status(400).json({ error: "El limite establecido es incorrecto." });
      }
      products = products.slice(0, parseInt(limit));
    }
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Hubo un error al obtener los productos." });
  }
});

// Obtener un producto por su ID
router.get("/:pid", async (req, res) => {
  try {
    const product = await productManager.getProductById(
      parseInt(req.params.pid)
    );
    if (product === "Producto no encontrado") {
      res.status(404).json({ error: "Producto no encontrado." });
    } else {
      res.json(product);
    }
  } catch (error) {
    res.status(500).json({ error: "Hubo un error al obtener el producto." });
  }
});

// Agregar un nuevo producto
router.post("/", async (req, res) => {
  try {
    const product = await productManager.addProduct(req.body);
    if (product) res.status(201).json(product);
    else res.status(400).send("Error en los datos del producto");
  } catch (error) {
    res.status(500).json({ error: "Hubo un error al obtener el producto." });
  }
});

// Actualizar un producto por ID
router.put("/:pid", async (req, res) => {
  try {
    const updatedProduct = await productManager.updateProduct(
      parseInt(req.params.pid),
      req.body
    );
    if (updatedProduct) res.json(updatedProduct);
    else res.status(404).send("Producto no encontrado");
  } catch (error) {
    res.status(500).json({ error: "Hubo un error al obtener el producto." });
  }
});

// Eliminar un producto por ID
router.delete("/:pid", async (req, res) => {
  try {
    const message = await productManager.deleteProduct(
      parseInt(req.params.pid)
    );
    res.send(message);
  } catch (error) {
    res.status(500).json({ error: "Hubo un error al obtener el producto." });
  }
});

module.exports = router;
