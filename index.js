const express = require("express");
const cors = require("cors");
const app = express(); //------------------------------------------- tell the app use express
const mongoose = require("mongoose"); //----------------------------- to connect to the DB
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");

app.use(express.json()); //to use JSON send via POSTMAN
app.use(cors());

dotenv.config(); //-------------------------------------------------- to use environment variable

mongoose
  .connect(process.env.MONGO_URL) //---------------------------------user:password        .net/db_name
  .then(() => console.log("Db connection successful")) //----------- for successful connection
  .catch((error) => {
    // ---------------------------------------------------------------any error occurred
    console.log(error);
  });

//----------------CREATING OUR REST API

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute); // using our imported userRoute (basically whenever user uses/api/user our browser will use userRoute)
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);

app.listen(5000, () => {
  console.log("Backend server running");
});
