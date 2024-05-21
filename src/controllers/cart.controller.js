const CartService = require('../services/cart.service');

class CartController {
  constructor() {
    this.cartService = new CartService();
  }

  async createCart(req, res) {
    try {
      const cart = await this.cartService.createCart();
      res.status(201).json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCartProducts(req, res) {
    try {
      const cartProducts = await this.cartService.getCartProducts(req.params.cid);
      res.json(cartProducts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async addProductToCart(req, res) {
    try {
      await this.cartService.addProductToCart(req.params.cid, req.params.pid);
      res.status(200).json({ message: "Producto agregado al carrito" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async removeProductFromCart(req, res) {
    try {
      await this.cartService.removeProductFromCart(req.params.cid, req.params.pid);
      res.status(200).json({ message: "Producto eliminado del carrito" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateProductQuantity(req, res) {
    try {
      const { quantity } = req.body;
      await this.cartService.updateProductQuantity(req.params.cid, req.params.pid, quantity);
      res.status(200).json({ message: "Cantidad actualizada correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async emptyCart(req, res) {
    try {
      await this.cartService.emptyCart(req.params.cid);
      res.status(200).json({ message: "Carrito vaciado correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = CartController;
