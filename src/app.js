const express = require('express');
const productRouter = require('./routers/products.router');
const cartRouter = require('./routers/carts.router');

const app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


// Routers
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

app.listen(8080, () => {
  console.log('Server running on port 8080');
});
