const CartService = require("../services/cart.service");
const TicketService = require("../services/ticket.service");

class CartController {
  constructor() {
    this.cartService = new CartService();
    this.ticketService = new TicketService();
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
      const cartProducts = await this.cartService.getCartProducts(
        req.params.cid
      );
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
      await this.cartService.removeProductFromCart(
        req.params.cid,
        req.params.pid
      );
      res.status(200).json({ message: "Producto eliminado del carrito" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateProductQuantity(req, res) {
    try {
      const { quantity } = req.body;
      await this.cartService.updateProductQuantity(
        req.params.cid,
        req.params.pid,
        quantity
      );
      res.status(200).json({ message: "Cantidad actualizada correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async purchaseCart(req, res) {
    try {
      const result = await this.ticketService.purchaseCart(
        req.params.cid,
        req.user.email
      );
      res.status(200).json({
        message: "Compra realizada con éxito",
        ticket: result.ticket,
        unavailableProducts: result.unavailableProducts
      });
    } catch (error) {
      if (!res.headersSent) {
        if (error.message === "No se pudo completar la compra debido a falta de stock.") {
          return res.status(400).json({ message: "Producto sin stock", unavailableProducts: error.unavailableProducts });
        }
        res.status(500).json({ error: error.message });
      }
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
