const express = require("express");
const ProductManager = require("./productManager");

const app = express();

const path = `${__dirname}/../assets/products.json`;
const productManager = new ProductManager(path);

// Endpoint para verificar si esta corriendo nuestra API
app.get("/test", (_, res) => {
  res.end("Curso NODE JS - Coderhouse => API Productos");
});

// Endpoint para obtener los productos
app.get("/products", async (req, res) => {
  try {
    const limit = req.query.limit;
    let products = await productManager.getProducts();

    if (limit) {
      if (isNaN(limit) || limit <= 0) {
        res.status(400).json({ error: "El limite establecido es incorrecto." });
        return;
      }
      products = products.slice(0, limit);
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Hubo un error al obtener los productos." });
  }
});

// Endpoint para obtener un producto por su ID
app.get("/products/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);

    if (product === "Producto no encontrado") {
      res.status(404).json({ error: "Producto no encontrado." });
    } else {
      res.json(product);
    }
  } catch (error) {
    res.status(500).json({ error: "Hubo un error al obtener el producto." });
  }
});

app.use(express.urlencoded({ extended: true }));

app.listen(8080, () => {
  console.log("Server run");
});
