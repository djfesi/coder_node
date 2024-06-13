const ProductService = require('../services/product.service'); 

class ProductController {
  constructor() {
    this.productService = new ProductService();
  }

  async addProduct(req, res) {
    const product = await this.productService.addProduct(req.body);
    req.logger.info(`Product added: ${product.title}`);
    res.status(201).json(product);
    // try {
    // } catch (error) {
    //   res.status(500).json({ error: error.message });
    // }
  }

  async getProducts(req, res) {
    const products = await this.productService.getProducts(req.query);
    req.logger.info("Products fetched successfully");
    res.status(200).json(products);
    // try {
    // } catch (error) {
    //   res.status(500).json({ error: error.message });
    // }
  }

  async getProductById(req, res) {
    const product = await this.productService.getProductById(req.params.pid);
    req.logger.info(`Product fetched: ${product.title}`);
    res.status(200).json(product);
    // try {
    // } catch (error) {
    //   res.status(500).json({ error: error.message });
    // }
  }

  async updateProduct(req, res) {
    const updatedProduct = await this.productService.updateProduct(req.params.pid, req.body);
    req.logger.info(`Product updated: ${updatedProduct.title}`);
    res.status(200).json(updatedProduct);
    // try {
    // } catch (error) {
    //   res.status(500).json({ error: error.message });
    // }
  }

  async deleteProduct(req, res) {
    await this.productService.deleteProduct(req.params.pid);
    req.logger.info("Product deleted");
    res.status(200).json({ message: "Producto eliminado" });

  }
}

module.exports = ProductController;
