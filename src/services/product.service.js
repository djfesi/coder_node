const ProductModel = require("./../models/product.model");
const { CustomError } = require("./errors/customError");
const { ErrorCodes } = require("./errors/errorCode");
const {
  generateInvalidProductDataError,
} = require("./errors/productsErrors/prodcutErrors");

class ProductService {
  async addProduct(product, owner) {
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
      req.logger.error(`InvalidProductData`);
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

    if (typeof Number(stock) != "number" || stock <= 0) {
      req.logger.error(`InvalidProductData`);
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

    if (typeof Number(price) != "number"  || price <= 0) {
      req.logger.error(`InvalidProductData`);
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
      req.logger.error(`DuplicateProductCode`);
      throw CustomError.createError({
        name: "DuplicateProductCode",
        cause: { code },
        message: "El código del producto ya existe.",
        code: ErrorCodes.PRODUCT_CREATION_ERROR,
      });
    }
    
    const newProduct = {
      ...product,
      owner: owner ? owner : "admin",
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
      req.logger.error(`Error fetching products: ${error.message}`);
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
      req.logger.error(`Error fetching product`);
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
      req.logger.error(`Error updating product: Invalid data fields`);
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
      req.logger.error(`Error updating product: Invalid data`);
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
      req.logger.error(`Error updating product: Invalid data`);
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

    const product = await ProductModel.findById(id);
    if (!product) {
      req.logger.error(`Error product not found`);
      throw CustomError.createError({
        name: "ProductNotFoundError",
        cause: { id },
        message: "Producto no encontrado",
        code: ErrorCodes.DATABASE_ERROR,
      });
    }
    if (code && product.code !== code) {
      const codeExists = await ProductModel.findOne({ code });
      if (codeExists) {
        req.logger.error(`Error code product duplicate`);
        throw CustomError.createError({
          name: "DuplicateProductCode",
          cause: { code },
          message: "El código que quiere asignarle al producto ya existe.",
          code: ErrorCodes.PRODUCT_CREATION_ERROR,
        });
      }
    }

    return await ProductModel.findByIdAndUpdate(id, updatedProduct, {
      new: true,
    });
  }

  async deleteProduct(id) {
    req.logger.error(`Error deleting product`);
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
