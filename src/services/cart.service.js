const Cart = require("./../models/cart.model");
const ProductService = require("./product.service");

class CartService {
  constructor() {
    this.productService = new ProductService();
  }

  async createCart() {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    return newCart._id;
  }

  async getCartProducts(cartId) {
    const cart = await Cart.findById(cartId).populate('products.product').lean();
    return cart ? cart.products : null;
  }

  async addProductToCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }
    const product = await this.productService.getProductById(productId);
    if (!product) {
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

  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");
    const productIndex = cart.products.findIndex(p => p.product.toString() === productId.toString());
    if (productIndex === -1) throw new Error("Producto no encontrado en el carrito");
    cart.products[productIndex].quantity = quantity;
    await cart.save();
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");
    cart.products = cart.products.filter(p => p.product.toString() !== productId.toString());
    await cart.save();
  }

  async emptyCart(cartId) {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");
    cart.products = [];
    await cart.save();
  }

  async updateCart(cartId, products) {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");
    cart.products = products.map(p => ({ product: p.product, quantity: p.quantity }));
    await cart.save();
  }
}

module.exports = CartService;
