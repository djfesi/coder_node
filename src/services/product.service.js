const ProductModel = require("./../models/product.model");

class ProductService {
  async addProduct(product) {
    const { title, description, price, thumbnail, code, stock, category, status } = product;

    if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
      throw new Error("Todos los campos son obligatorios.");
    }

    if (typeof stock !== "number" || stock <= 0) {
      throw new Error("El stock debe ser un número positivo mayor que cero.");
    }

    if (typeof price !== "number" || price <= 0) {
      throw new Error("El precio debe ser un valor positivo.");
    }

    const productCheck = await ProductModel.findOne({ code });
    if (productCheck) {
      throw new Error("El código del producto ya existe.");
    }

    const newProduct = { ...product, status: typeof status === "boolean" ? status : true };
    return await ProductModel.create(newProduct);
  }

  async getProducts(conditions, options) {
    try {
      const products = await ProductModel.paginate(conditions, options);
      return {
        status: "success",
        payload: products.docs,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.hasPrevPage ? `/api/products?page=${products.prevPage}&limit=${options.limit}` : null,
        nextLink: products.hasNextPage ? `/api/products?page=${products.nextPage}&limit=${options.limit}` : null,
      };
    } catch (error) {
      throw new Error(`Error al obtener los productos: ${error.message}`);
    }
  }

  async getProductById(id) {
    const product = await ProductModel.findById(id);
    if (!product) {
      throw new Error("Producto no encontrado");
    }
    return product;
  }

  async updateProduct(id, updatedProduct) {
    const { title, description, price, thumbnail, code, stock, category } = updatedProduct;

    if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
      throw new Error("Todos los campos son obligatorios.");
    }

    if (typeof stock !== "number" || stock <= 0) {
      throw new Error("El stock debe ser un número positivo mayor que cero.");
    }

    if (typeof price !== "number" || price <= 0) {
      throw new Error("El precio debe ser un valor positivo.");
    }

    const product = await ProductModel.findById(id);
    if (!product) throw new Error("Producto no encontrado");

    if (code && product.code !== code) {
      const codeExists = await ProductModel.findOne({ code });
      if (codeExists) throw new Error("El código que quiere asignarle al producto ya existe.");
    }

    return await ProductModel.findByIdAndUpdate(id, updatedProduct, { new: true });
  }

  async deleteProduct(id) {
    const result = await ProductModel.findByIdAndDelete(id);
    if (!result) {
      throw new Error("Producto no encontrado");
    }
    return "Producto eliminado";
  }
}

module.exports = ProductService;
