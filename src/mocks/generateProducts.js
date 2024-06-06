const { fakerES: faker } = require("@faker-js/faker");

const generateProducts = (quantity) => {
  const products = [];
  for (let i = 0; i < quantity; i++) {
    products.push({
      _id: faker.database.mongodbObjectId(),
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
      thumbnail: faker.image.imageUrl(),
      code: faker.number.int({ min: 1000, max: 9999 }),
      stock: faker.number.int({ min: 0, max: 300 }),
      status: faker.datatype.boolean(),
      category: faker.commerce.department(),
      id: faker.number.int(),
    });
  }
  return products;
};

module.exports = { generateProducts };
