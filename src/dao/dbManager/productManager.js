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
    const productCheck = await this.getProducts({ code }, { limit: 1 });
    if (productCheck.payload?.length > 0) {
      console.error("El código del producto ya existe.");
      return null;
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

  async getProducts(conditions, options) {
    try {
      const products = await ProductModel.paginate(conditions, options);
      let response = {
        status: "success",
        payload: products.docs,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.hasPrevPage
          ? `/api/products?page=${products.prevPage}&limit=${options.limit}`
          : null,
        nextLink: products.hasNextPage
          ? `/api/products?page=${products.nextPage}&limit=${options.limit}`
          : null,
      };
      return response;
    } catch (error) {
      res.status(500).json({ status: 'error', error: error.message });
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
      console.error(error);
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
