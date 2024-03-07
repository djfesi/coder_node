const fs = require("fs").promises;

class ProductManager {
  constructor(pathUse) {
    this.path = pathUse;
  }

  async addProduct(product) {
    const {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
      status,
    } = product;
    // VALIDACIONES:
    // Comprobamos que ningun dato este vacio
    if (
      !title ||
      !description ||
      !price ||
      !thumbnail ||
      !code ||
      !stock ||
      !category
    ) {
      console.error("Todos los campos son obligatorios.");
      return;
    }

    if (!typeof stock === "number" || stock <= 0) {
      console.error("El stock debe ser un numero positivo mayor que cero.");
      return;
    }

    if (!typeof price === "number" || price <= 0) {
      console.error("El precio debe ser un valor positivo.");
      return;
    }

    // Traemos todos los productos almacenados
    const products = await this.getProducts();
    // Validacion para chequear la existencia del mismo
    if (products.some((p) => p.code === code)) {
      console.error("El código del producto ya existe.");
      return;
    }

    /* Asignacion de ID en caso que hubiese productos cargados 
    se busca el mayor para sumarle 1 sino se asigna el 1. */
    const newId =
      products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

    const statusValidate = typeof status === "boolean" ? status : true;

    const newProduct = { ...product, id: newId, status: statusValidate };

    // Pusheamos al array para luego sobreescribir el archivo
    products.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(products));
    return newProduct;
  }

  async getProducts() {
    try {
      const products = await fs.readFile(this.path, "utf8");
      return JSON.parse(products);
    } catch (error) {
      return [];
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    const product = products.find((product) => product.id === id);
    if (!product) {
      const notFound = "Producto no encontrado";
      return notFound;
    }
    return product;
  }

  async updateProduct(id, updatedProduct) {
    const { title, description, price, thumbnail, code, stock, category } =
      updatedProduct;
    // VALIDACIONES:
    // Comprobamos que ningun dato este vacio
    if (
      !title ||
      !description ||
      !price ||
      !thumbnail ||
      !code ||
      !stock ||
      !category
    ) {
      console.error("Todos los campos son obligatorios.");
      return;
    }

    // Validamos que el stock y precio sean numeros positivos
    if (!typeof stock === "number" || stock <= 0) {
      console.error("El stock debe ser un numero positivo mayor que cero.");
      return;
    }

    if (!typeof price === "number" || price <= 0) {
      console.error("El precio debe ser un valor positivo.");
      return;
    }

    const products = await this.getProducts();
    const index = products.findIndex((product) => product.id === id);
    // Validamos que exista el producto a modificar
    if (index === -1) return console.error("Producto no encontrado");
    /* Y en caso de modificar el code que no exista otro producto 
    con el mismo codigo.*/
    if (
      products[index].code !== code &&
      products.some((p) => p.code === code)
    ) {
      console.error("El código del producto ya existe.");
      return;
    }
    products[index] = { ...products[index], ...updatedProduct };
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[index];
  }

  async deleteProduct(id) {
    let products = await this.getProducts();
    const lengthBefore = products.length;
    products = products.filter((product) => product.id !== id);
    if (products.length === lengthBefore) return "Producto no encontrado";
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return "Producto eliminado";
  }
}

module.exports = ProductManager;
