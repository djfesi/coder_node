const express = require("express");
const ProductManagerDB = require("../dao/dbManager/productManager");
const { default: mongoose } = require("mongoose");

const router = express.Router();

const productManagerDB = new ProductManagerDB();
// Obtener los productos
router.get("/", async (req, res) => {
  try {
    let limit = parseInt(req.query.limit);
    limit = !isNaN(limit) && limit > 0 ? limit : 10;
    let products = await productManagerDB.getProducts({}, limit);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Hubo un error al obtener los productos." });
  }
});

// Obtener un producto por su ID
router.get("/:pid", async (req, res) => {
  try {
    // Validamos que el id sea correcto
    const validation = mongoose.Types.ObjectId;
    if (req.params.pid) {
      if (!validation.isValid(req.params.pid)) {
        return res.status(404).json({ error: "ID Invalido." });
      }
    }
    const product = await productManagerDB.getProductById(req.params.pid);
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
    const product = await productManagerDB.addProduct(req.body);
    if (product) {
      await req.app.get("ws").emit("newProduct", product);
      res.status(201).json(product);
    } else res.status(400).send("Error en los datos del producto");
  } catch (error) {
    res.status(500).json({ error: "Hubo un error al obtener el producto." });
  }
});

// Actualizar un producto por ID
router.put("/:pid", async (req, res) => {
  // Validamos que el id sea correcto
  const validation = mongoose.Types.ObjectId;
  if (req.params.pid) {
    if (!validation.isValid(req.params.pid)) {
      return res.status(404).json({ error: "ID Invalido." });
    }
  }
  try {
    const updatedProduct = await productManagerDB.updateProduct(
      req.params.pid,
      req.body
    );
    if (updatedProduct) res.json(updatedProduct);
    else res.status(404).send("Producto no encontrado");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un producto por ID
router.delete("/:pid", async (req, res) => {
  // Validamos que el id sea correcto
  const validation = mongoose.Types.ObjectId;
  if (req.params.pid) {
    if (!validation.isValid(req.params.pid)) {
      return res.status(404).json({ error: "ID Invalido." });
    }
  }
  try {
    const message = await productManagerDB.deleteProduct(req.params.pid);
    await req.app.get("ws").emit("removeProduct", req.params.pid);
    res.send(message);
  } catch (error) {
    res.status(500).json({ error: "Hubo un error al obtener el producto." });
  }
});

module.exports = router;
