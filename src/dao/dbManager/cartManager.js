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
    const carts = await Cart.findById(cartId).populate('products.product').lean();
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

  // Actualizar la cantidad de un producto
  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");
    const productIndex = cart.products.findIndex(p => p.product.toString() === productId.toString());
    if (productIndex === -1) throw new Error("Producto no encontrado en el carrito");
    cart.products[productIndex].quantity = quantity;
    await cart.save();
}

// Eliminar un producto del carro
async removeProductFromCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");
    const newProducts = cart.products.filter(p => p.product.toString() !== productId.toString());
    cart.products = newProducts;
    await cart.save();
}

// Vaciar el carro por completo
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

module.exports = CartManager;
