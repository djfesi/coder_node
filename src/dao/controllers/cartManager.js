const fs = require("fs").promises;
const ProductManager = require('./productManager'); // Asegúrate de ajustar la ruta al archivo ProductManager.js

class CartManager {
  constructor(path) {
    this.path = path;
    this.productManager = new ProductManager(`${__dirname}/../../../data/products.json`);
  }
  // Creamos el carro de compras
  async createCart() {
    const carts = await this._getCarts();
    const newCart = {
      id: carts.length > 0 ? Math.max(...carts.map((c) => c.id)) + 1 : 1,
      products: [],
    };
    carts.push(newCart);
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return newCart.id;
  }

  // Traemos los productos del carro, algo que no especificaba
  // la consigna si devolviamos el ID de los prod o hacemos un get 
  // del producto por ID para mostrarlo

  async getCartProducts(cartId) {
    const carts = await this._getCarts();
    const cart = carts.find((cart) => cart.id === cartId);
    return cart ? cart.products : null;
  }

  // Agregamos productos al carro indicado por ID
  async addProductToCart(cartId, productId) {
    const carts = await this._getCarts();
    const cart = carts.find((c) => c.id === cartId);
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    const product = await this.productManager.getProductById(productId);
    if (!product || product === "Producto no encontrado") {
      throw new Error("Producto no encontrado");
    }

    const productIndex = cart.products.findIndex(
      (p) => p.product === productId
    );
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
  }

  // Get privado de carros cargados
  async _getCarts() {
    try {
      const data = await fs.readFile(this.path, "utf8");
      return JSON.parse(data);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CartManager;
