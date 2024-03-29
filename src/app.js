const express = require("express");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");

const productRouter = require("./routers/products.router");
const cartRouter = require("./routers/carts.router");
const viewsRouter = require("./routers/views.router");
const app = express();

// HBS
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routers
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter); // Views

const httpServer = app.listen(8080, () => {
  console.log("Server running on port 8080");
});

const wsServer = new Server(httpServer);
app.set("ws", wsServer);

wsServer.on("connection", (client) => {
  console.log(client.id);
});
