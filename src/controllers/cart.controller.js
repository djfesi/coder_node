const CartService = require("../services/cart.service");
const TicketService = require("../services/ticket.service");

class CartController {
  constructor() {
    this.cartService = new CartService();
    this.ticketService = new TicketService();
  }

  async createCart(req, res) {
    try {
      req.logger.info("Cart created successfully");
      const cart = await this.cartService.createCart();
      res.status(201).json(cart);
    } catch (error) {
      req.logger.error(`Error creating cart: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }

  async getCartProducts(req, res) {
    try {
      const cartProducts = await this.cartService.getCartProducts(
        req.params.cid
      );
      req.logger.info(`Products fetched for cart ${req.params.cid}`);
      res.json(cartProducts);
    } catch (error) {
      req.logger.error(`Error fetching cart products: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }

  async addProductToCart(req, res) {
    try {
      await this.cartService.addProductToCart(req.params.cid, req.params.pid);
      req.logger.info(`Product ${req.params.pid} added to cart ${req.params.cid}`);
      res.status(200).json({ message: "Producto agregado al carrito" });
    } catch (error) {
      req.logger.error(`Error adding product to cart: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }

  async removeProductFromCart(req, res) {
    try {
      await this.cartService.removeProductFromCart(
        req.params.cid,
        req.params.pid
      );
      req.logger.info(`Product ${req.params.pid} removed from cart ${req.params.cid}`);
      res.status(200).json({ message: "Producto eliminado del carrito" });
    } catch (error) {
      req.logger.error(`Error removing product from cart: ${error.message}`);
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
      req.logger.info(`Product ${req.params.pid} quantity updated to ${quantity} in cart ${req.params.cid}`);
      res.status(200).json({ message: "Cantidad actualizada correctamente" });
    } catch (error) {
      req.logger.error(`Error updating product quantity: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }

  async purchaseCart(req, res) {
    try {
      const result = await this.ticketService.purchaseCart(
        req.params.cid,
        req.user.email
      );
      req.logger.info(`Cart ${req.params.cid} purchased by ${req.user.email}`);
      res.status(200).json({
        message: "Compra realizada con éxito",
        ticket: result.ticket,
        unavailableProducts: result.unavailableProducts
      });
    } catch (error) {
      if (!res.headersSent) {
        if (error.message === "No se pudo completar la compra debido a falta de stock.") {
          req.logger.warning(`Stock unavailable for some products in cart ${req.params.cid}`);
          return res.status(400).json({ message: "Producto sin stock", unavailableProducts: error.unavailableProducts });
        }
        req.logger.error(`Error purchasing cart: ${error.message}`);
        res.status(500).json({ error: error.message });
      }
    }
  }

  async emptyCart(req, res) {
    try {
      await this.cartService.emptyCart(req.params.cid);
      req.logger.info(`Cart ${req.params.cid} emptied`);
      res.status(200).json({ message: "Carrito vaciado correctamente" });
    } catch (error) {
      req.logger.error(`Error emptying cart: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = CartController;
