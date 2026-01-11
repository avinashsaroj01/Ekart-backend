const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  title: String,
  description: String,
  price: { type: Number, min: 0, max: 100000 },
  discountPercentage: { type: Number, min: 0, max: 100 },
  rating: { type: Number, min: 0 },
  stock: { type: Number, min: 1, max: 100 },
  brand: String,
  category: String,
  thumbnail: String,
  images: [String],
  deleted:{type:Boolean,default:false}
});

const Product = mongoose.model("Product", productSchema);

productSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
productSchema.set("toJSON", {
  virtuals: true,
});
productSchema.set("toObject", {
  virtuals: true,
});
productSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  },
});

module.exports = Product;
