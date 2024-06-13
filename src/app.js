const express = require("express");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const passport = require("passport");
require("dotenv/config");

const messagesModel = require("./models/messages.model");
const { dbName, mongoUrl } = require("./dbConfig");
const sessionMiddleware = require("./session/mongoStorage");
const initializeStrategyWithGitHub = require("./config/passport-github.config");
const initializeStrategy = require("./config/passport.config");
const initializeStrategyWithJWT = require("./config/passport-jwt.config");
const productRouter = require("./routers/products.router");
const cartRouter = require("./routers/carts.router");
const viewsRouter = require("./routers/views.router");
const sessionsRouter = require("./routers/session.router");
const mockRouter = require("./routers/mock.router");
const { authorizeUser } = require("./middlewares/auth.middleware");
const { errorHandler } = require("./services/errors/errorHandler");
const { useLogger, logger } = require("./logger");

const app = express();
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(useLogger)
app.use(sessionMiddleware);
initializeStrategy();
initializeStrategyWithGitHub();
initializeStrategyWithJWT();
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser("coder1234"));
// HBS
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");
// Routers
app.use("/api/products", productRouter);
app.use("/api/carts", authorizeUser, cartRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter); // Views
app.use("/mockingproducts", mockRouter) // Mock

app.use(errorHandler)
const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongoUrl, { dbName });
    logger.info("Connected to MongoDB");
    const httpServer = app.listen(8080, () => {
      logger.info("Server running on port 8080");
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
    logger.error("Error connecting to MongoDB:", error);
  }
};

connectToDatabase();
app.get("/loggerTest", (req, res) => {
  req.logger.debug("This is a debug message");
  req.logger.http("This is an HTTP log message");
  req.logger.info("This is an info message");
  req.logger.warning("This is a warning message");
  req.logger.error("This is an error message");
  req.logger.fatal("This is a fatal error message");
  res.send("Logger test completed, check your logs!");
});