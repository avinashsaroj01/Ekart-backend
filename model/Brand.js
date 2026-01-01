const mongoose = require("mongoose");
const { Schema } = mongoose;
const brandSchema = new Schema({
  value: { type: String, required: true },
  label: { type: String, required: true },
});

const Brand = mongoose.model("Brand", brandSchema);

brandSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
brandSchema.set("toJSON", {
  virtuals: true,
});
brandSchema.set("toObject", {
  virtuals: true,
});
brandSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  },
});

module.exports = Brand;
