const ProductModel = require("./../models/product.model");
const { CustomError } = require("./errors/customError");
const { ErrorCodes } = require("./errors/errorCode");
const { generateInvalidProductDataError } = require("./errors/productsErrors/prodcutErrors");

class ProductService {
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

    const hasInvalidFields = [
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
    ].some((v) => !v);
    if (hasInvalidFields) {
      throw CustomError.createError({
        name: "InvalidProductData",
        cause: generateInvalidProductDataError({
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
          category,
        }),
        message: "Todos los campos son obligatorios.",
        code: ErrorCodes.PRODUCT_CREATION_ERROR,
      });
    }

    if (typeof stock !== "number" || stock <= 0) {
      throw CustomError.createError({
        name: "InvalidProductData",
        cause: generateInvalidProductDataError({
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
          category,
        }),
        message: "El stock debe ser un número positivo mayor que cero.",
        code: ErrorCodes.INVALID_TYPES_ERROR,
      });
    }

    if (typeof price !== "number" || price <= 0) {
      throw CustomError.createError({
        name: "InvalidProductData",
        cause: generateInvalidProductDataError({
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
          category,
        }),
        message: "El precio debe ser un valor positivo.",
        code: ErrorCodes.INVALID_TYPES_ERROR,
      });
    }

    const productCheck = await ProductModel.findOne({ code });
    if (productCheck) {
      throw CustomError.createError({
        name: "DuplicateProductCode",
        cause: { code },
        message: "El código del producto ya existe.",
        code: ErrorCodes.PRODUCT_CREATION_ERROR,
      });
    }

    const newProduct = {
      ...product,
      status: typeof status === "boolean" ? status : true,
    };
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
        prevLink: products.hasPrevPage
          ? `/api/products?page=${products.prevPage}&limit=${options.limit}`
          : null,
        nextLink: products.hasNextPage
          ? `/api/products?page=${products.nextPage}&limit=${options.limit}`
          : null,
      };
    } catch (error) {
      throw CustomError.createError({
        name: "DatabaseError",
        cause: error,
        message: `Error al obtener los productos: ${error.message}`,
        code: ErrorCodes.DATABASE_ERROR,
      });
    }
  }

  async getProductById(id) {
    const product = await ProductModel.findById(id);
    if (!product) {
      throw CustomError.createError({
        name: "ProductNotFoundError",
        cause: { id },
        message: "Producto no encontrado",
        code: ErrorCodes.DATABASE_ERROR,
      });
    }
    return product;
  }

  async updateProduct(id, updatedProduct) {
    const { title, description, price, thumbnail, code, stock, category } =
      updatedProduct;

    const hasInvalidFields = [
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
    ].some((v) => !v);
    if (hasInvalidFields) {
      throw CustomError.createError({
        name: "InvalidProductData",
        cause: generateInvalidProductDataError({
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
          category,
        }),
        message: "Todos los campos son obligatorios.",
        code: ErrorCodes.INVALID_TYPES_ERROR,
      });
    }

    if (typeof stock !== "number" || stock <= 0) {
      throw CustomError.createError({
        name: "InvalidProductData",
        cause: generateInvalidProductDataError({ title, description, price, thumbnail, code, stock, category }),
        message: "El stock debe ser un número positivo mayor que cero.",
        code: ErrorCodes.INVALID_TYPES_ERROR,
      });
    }

    if (typeof price !== "number" || price <= 0) {
      throw CustomError.createError({
        name: "InvalidProductData",
        cause: generateInvalidProductDataError({ title, description, price, thumbnail, code, stock, category }),
        message: "El precio debe ser un valor positivo.",
        code: ErrorCodes.INVALID_TYPES_ERROR,
      });
    }

    const product = await ProductModel.findById(id);
    if (!product)
      throw CustomError.createError({
        name: "ProductNotFoundError",
        cause: { id },
        message: "Producto no encontrado",
        code: ErrorCodes.DATABASE_ERROR,
      });
    if (code && product.code !== code) {
      const codeExists = await ProductModel.findOne({ code });
      if (codeExists)
        throw CustomError.createError({
          name: "DuplicateProductCode",
          cause: { code },
          message: "El código que quiere asignarle al producto ya existe.",
          code: ErrorCodes.PRODUCT_CREATION_ERROR,
        });
    }

    return await ProductModel.findByIdAndUpdate(id, updatedProduct, {
      new: true,
    });
  }

  async deleteProduct(id) {
    const result = await ProductModel.findByIdAndDelete(id);
    if (!result) {
      throw CustomError.createError({
        name: "ProductNotFoundError",
        cause: { id },
        message: "Producto no encontrado",
        code: ErrorCodes.DATABASE_ERROR,
      });
    }
    return "Producto eliminado";
  }
}

module.exports = ProductService;
