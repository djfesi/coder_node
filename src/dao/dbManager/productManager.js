const ProductModel = require("./../models/product.model");

class ProductManager {
  constructor() {}

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

    // Validacion para chequear la existencia del mismo
    const replicatedProduct = await this.getProducts({ code });
    if (replicatedProduct) {
      console.error("El código del producto ya existe.");
      return;
    }

    const statusValidate = typeof status === "boolean" ? status : true;
    const newProduct = { ...product, status: statusValidate };

    try {
      const response = await ProductModel.create(newProduct);
      return response;
    } catch (error) {
      console.error("Error al crear el producto:", error);
      throw error;
    }
  }

  async getProducts(conditions, limit = 0) {
    try {
      const products = await ProductModel.find(conditions).limit(limit); ;
      return products;
    } catch (error) {
      return [];
    }
  }

  async getProductById(id) {
    try {
      const product = await ProductModel.findById(id);
      if (!product) {
        const notFound = "Producto no encontrado";
        return notFound;
      }
      return product;
    } catch (error) {
      console.log(error);
      return;
    }
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
      throw new Error("Todos los campos son obligatorios.");
    }

    // Validamos que el stock y precio sean numeros positivos
    if (!typeof stock === "number" || stock <= 0) {
      console.error("El stock debe ser un numero positivo mayor que cero.");
      throw new Error("El stock debe ser un numero positivo mayor que cero.");
    }

    if (!typeof price === "number" || price <= 0) {
      console.error("El precio debe ser un valor positivo.");
      throw new Error("El precio debe ser un valor positivo.");
    }

    const product = await ProductModel.findById(id);

    // Validamos que exista el producto a modificar
    if (!product) return console.error("Producto no encontrado");
    /* Y en caso de modificar el code que no exista otro producto
      con el mismo codigo.*/
    if (code && product.code !== code) {
      const codeExists = await ProductModel.findOne({ code });
      if (codeExists) {
        console.error("El código que quiere asignarle al producto ya existe.");
        throw new Error(
          "El código que quiere asignarle al producto ya existe."
        );
      }
    }
    try {
      const updated = await ProductModel.findByIdAndUpdate(id, updatedProduct, {
        new: true,
      });
      return updated;
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const result = await ProductModel.findByIdAndDelete(id);
      if (!result) {
        return "Producto no encontrado";
      }
      return "Producto eliminado";
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      throw error;
    }
  }
}

module.exports = ProductManager;
