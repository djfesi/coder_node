const Cart = require("./../models/cart.model");
const ProductManager = require("./productManager");

class CartManager {
  constructor() {
    this.productManager = new ProductManager();
  }

  // Creamos el carro de compras
  async createCart() {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    return newCart._id;
  }

  // Buscamos el Cart por su Id y devolvemos los productos
  async getCartProducts(cartId) {
    const carts = await Cart.findById(cartId).populate('products.product');
    return carts ? carts.products : null;
  }

  // Agregamos productos al carro indicado por ID
  async addProductToCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }
    const findProduct = await this.productManager.getProductById(productId);
    if (!findProduct) {
      throw new Error("Producto no encontrado");
    }

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId.toString()
    );
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await cart.save();
  }
}

module.exports = CartManager;
