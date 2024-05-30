const Ticket = require("../models/ticket.model");
const Cart = require("../models/cart.model");
const ProductService = require("./product.service");

class TicketService {
  constructor() {
    this.productService = new ProductService();
  }

  async purchaseCart(cartId, userEmail) {
    const cart = await Cart.findById(cartId).populate("products.product");
    if (!cart) throw new Error("Carrito no encontrado");
    let totalAmount = 0;
    const unavailableProducts = [];

    for (const item of cart.products) {
      const product = item.product;
      if (product.stock >= item.quantity) {
        totalAmount += product.price * item.quantity;
        product.stock -= item.quantity;
        await product.save();
      } else {
        unavailableProducts.push(product.title);
      }
    }

    if (totalAmount > 0) {
      const ticket = new Ticket({
        code: `TICKET-${Date.now()}`,
        purchase_datetime: new Date(),
        amount: totalAmount,
        purchaser: userEmail,
      });
      await ticket.save();
      cart.products = cart.products.filter(item => unavailableProducts.includes(item.product._id));
      await cart.save();
      return { ticket, unavailableProducts };
    } else {
      const error = new Error("No se pudo completar la compra debido a falta de stock.");
      error.unavailableProducts = unavailableProducts;
      throw error;
    }
  }
}

module.exports = TicketService;
