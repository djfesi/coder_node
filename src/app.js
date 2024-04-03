const express = require("express");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const productRouter = require("./routers/products.router");
const cartRouter = require("./routers/carts.router");
const viewsRouter = require("./routers/views.router");
const messagesModel = require("./dao/models/messages.model");
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

const connectToDatabase = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://fede:fede1234@ecommerce.z3spuc0.mongodb.net/",
      { dbName: "ecommerce" }
    );
    console.log("Connect to MongoDB");
    const httpServer = app.listen(8080, () => {
      console.log("Server running on port 8080");
    });

    const wsServer = new Server(httpServer);
    app.set("ws", wsServer);

    wsServer.on("connection", async (clientSocket) => {
      const messages = await messagesModel
        .find({})
        .sort({ createdAt: 1 })
        .exec();
      messages.forEach((message) => {
        clientSocket.emit("message", message);
      });

      clientSocket.on("message", async (data) => {
        const newMessage = new messagesModel({
          user: data.user,
          message: data.message,
        });
        const savedMessage = await newMessage.save();
        wsServer.emit("message", savedMessage);
      });

      clientSocket.on("user-connected", (user) => {
        clientSocket.broadcast.emit("user-joined", user);
      });
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

connectToDatabase();
