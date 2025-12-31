const express = require("express");
const app = express();
const mongoose = require("mongoose");
const productRoutes = require("./routes/Product");
//middleware

app.use(express.json());
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://localhost:27017/ekartdb");
  console.log("database connected");
}
app.get("/", (req, res) => {
  res.json({ status: "success" });
});

app.use("/", productRoutes);
app.listen(5000, () => {
  console.log("Server statred at port : 5000");
});
