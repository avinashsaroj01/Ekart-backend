const express = require("express");
const app = express();
const mongoose = require("mongoose");
const productsRoute = require("./routes/Product");
const usersRoute = require("./routes/User");
const authRoute = require("./routes/Auth");
const brandsRoute = require("./routes/Brand");
const categoryRoute = require("./routes/Category");
const cartRoute = require("./routes/Cart");
const orderRoute = require("./routes/Order");
const cors = require("cors");
//middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // React app
    credentials: true,
    exposedHeaders: ["X-Total-Count"],
  })
);

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://localhost:27017/ekartdb");
  console.log("database connected");
}
app.get("/", (req, res) => {
  res.json({ status: "success" });
});
// product routes
app.use("/products", productsRoute);

// user routes
app.use("/users", usersRoute);
app.use("/auth", authRoute);

//brand routes
app.use("/brands", brandsRoute);

// category routes

app.use("/categories", categoryRoute);

// cart routes
app.use("/cart", cartRoute);
// order routes
app.use("/orders", orderRoute);
app.listen(5000, () => {
  console.log("Server statred at port : 5000");
});


