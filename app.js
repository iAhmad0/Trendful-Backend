require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");
const connectDB = require("./db/connect");
const productRouter = require("./routes/productRouter");
const buyerRouter = require("./routes/buyerRouter");
const sellerRouter = require("./routes/sellerRouter");
const adminRouter = require("./routes/adminRouter");
const orderRouter = require("./routes/orderRouter");
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

const app = express();

app.use(express.json());

// routes

app.use("/", cors(), productRouter);
app.use("/", cors(), buyerRouter);
app.use("/", cors(), sellerRouter);
app.use("/", cors(), adminRouter);
app.use("/", cors(), orderRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// server
const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
