const fs = require("fs").promises;

class ProductManager {
  constructor(pathUse) {
    this.path = pathUse;
  }

  async addProduct(product) {
    const { title, description, price, thumbnail, code, stock } = product;
    // VALIDACIONES:
    // Comprobamos que ningun dato este vacio
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.error("Todos los campos son obligatorios.");
      return;
    }

    /* Como se me sugirio en la primer pre-entrega validamos que el stock 
    sea un numero positivo */
    if (!typeof stock === "number" || stock <= 0) {
      console.error("El stock debe ser un numero positivo mayor que cero.");
      return;
    }

    if (!typeof price === "number" || price <= 0) {
      console.error("El precio debe ser un valor positivo.");
      return;
    }

    // Traemos todos los productos almacenados
    const products = await this.getProducts();
    // Validacion para chequear la existencia del mismo
    if (products.some((p) => p.code === code)) {
      console.error("El código del producto ya existe.");
      return;
    }

    /* Asignacion de ID en caso que hubiese productos cargados 
    se busca el mayor para sumarle 1 sino se asigna el 1. */
    const newId =
      products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

    const newProduct = { ...product, id: newId };

    // Pusheamos al array para luego sobreescribir el archivo
    products.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(products));
    return newProduct;
  }

  async getProducts() {
    try {
      const products = await fs.readFile(this.path, "utf8");
      return JSON.parse(products);
    } catch (error) {
      return [];
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    const product = products.find((product) => product.id === id);
    if (!product) {
      const notFound = "Producto no encontrado";
      return notFound;
    }
    return product;
  }

  async updateProduct(id, updatedProduct) {
    const { title, description, price, thumbnail, code, stock } =
      updatedProduct;
    // VALIDACIONES:
    // Comprobamos que ningun dato este vacio
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.error("Todos los campos son obligatorios.");
      return;
    }

    // Validamos que el stock y precio sean numeros positivos
    if (!typeof stock === "number" || stock <= 0) {
      console.error("El stock debe ser un numero positivo mayor que cero.");
      return;
    }

    if (!typeof price === "number" || price <= 0) {
      console.error("El precio debe ser un valor positivo.");
      return;
    }

    const products = await this.getProducts();
    const index = products.findIndex((product) => product.id === id);
    // Validamos que exista el producto a modificar
    if (index === -1) return console.error("Producto no encontrado");
    /* Y en caso de modificar el code que no exista otro producto 
    con el mismo codigo.*/
    if (
      products[index].code !== code &&
      products.some((p) => p.code === code)
    ) {
      console.error("El código del producto ya existe.");
      return;
    }
    products[index] = { ...products[index], ...updatedProduct };
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[index];
  }

  async deleteProduct(id) {
    let products = await this.getProducts();
    const lengthBefore = products.length;
    products = products.filter((product) => product.id !== id);
    if (products.length === lengthBefore) return "Producto no encontrado";
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return "Producto eliminado";
  }
}

module.exports = ProductManager;

//  DESAFÍO ENTREGABLE 2 - PROCESO DE TESTING
// const main = async () => {
//   try {
//     const productManager = new ProductManager();

//     // PASO 1: Resultado []

//     console.log(await productManager.getProducts());

//     // PASO 2: Se agrega un producto.

//     await productManager.addProduct({
//       title: "producto prueba",
//       description: "Este es un producto prueba",
//       price: 200,
//       thumbnail: "Sin imagen",
//       code: "abc123",
//       stock: 25,
//     });

//     // PASO 3: Resultado producto cargado

//     console.log(await productManager.getProducts());

//     // PASO 4: Se espera error dado que ya se encuentra cargado.
//     await productManager.addProduct({
//       title: "producto prueba",
//       description: "Este es un producto prueba",
//       price: 200,
//       thumbnail: "Sin imagen",
//       code: "abc123",
//       stock: 25,
//     });

//     // PASO 5: Busqueda por Id con ambas opciones de resultados.
//     console.log(await productManager.getProductById(1));
//     console.log(await productManager.getProductById(4)); // No debería encontrarlo

//     // PASO 6: Modificación de producto.
//     console.log(
//       await productManager.updateProduct(1, {
//         title: "producto prueba MODIFICADO",
//         description: "Este es un producto prueba MODIFICADO",
//         price: 200,
//         thumbnail: "Sin imagen",
//         code: "abc123",
//         stock: 25,
//       })
//     );

//     // PASO 7: Eliminar producto simulación ambos casos
//     console.log(await productManager.deleteProduct(1));
//     console.log(await productManager.deleteProduct(50)); // No debería encontrarlo
//   } catch (error) {
//     console.log(`Hubo un error: ${error}`);
//   }
// };

// Ejecutamos 
// main();