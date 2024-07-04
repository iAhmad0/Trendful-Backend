require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");
const connectDB = require("./db/connect");
const categoryRouter = require("./routes/categoryRouter");
const buyerRouter = require("./routes/buyerRouter");
const sellerRouter = require("./routes/sellerRouter");
const adminRouter = require("./routes/adminRouter");
const orderRouter = require("./routes/orderRouter");
const chatRouter = require("./routes/chatRouter");
const messageRouter = require("./routes/messageRouter");
const pointRouter = require("./routes/pointsRouter");
const rewardRouter = require("./routes/rewardsRouter");
const paymentRouter = require("./routes/paymentRouter");
const advertisingRouter = require("./routes/advertisingRouter");
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

const app = express();
app.use(express.json());

app.use("/", cors(), categoryRouter);
app.use("/", cors(), buyerRouter);
app.use("/", cors(), sellerRouter);
app.use("/", cors(), adminRouter);
app.use("/", cors(), orderRouter);
app.use("/", cors(), advertisingRouter);
app.use("/chats", cors(), chatRouter);
app.use("/messages", cors(), messageRouter);
app.use("/points", cors(), pointRouter);
app.use("/rewards", cors(), rewardRouter);
app.use("/", cors(), paymentRouter);

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
