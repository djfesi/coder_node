const express = require("express");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const passport = require("passport");

const messagesModel = require("./dao/models/messages.model");
const { dbName, mongoUrl } = require("./dbConfig");
const sessionMiddleware = require("./session/mongoStorage");
const initializeStrategyWithGitHub = require("./config/passport-github.config");
const initializeStrategy = require("./config/passport.config");
const initializeStrategyWithJWT =  require("./config/passport-jwt.config");
const productRouter = require("./routers/products.router");
const cartRouter = require("./routers/carts.router");
const viewsRouter = require("./routers/views.router");
const sessionsRouter = require("./routers/session.router");

const app = express();
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);
initializeStrategy();
initializeStrategyWithGitHub();
initializeStrategyWithJWT()
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser("coder1234"));
// HBS
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

// Routers
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter); // Views

const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongoUrl, { dbName });
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
