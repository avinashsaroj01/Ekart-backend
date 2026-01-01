const mongoose = require("mongoose");
const { Schema } = mongoose;
const categorySchema = new Schema({
  value: { type: String, required: true },
  label: { type: String, required: true },
});

const Category = mongoose.model("Category", categorySchema);

categorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});
categorySchema.set("toJSON", {
  virtuals: true,
});
categorySchema.set("toObject", {
  virtuals: true,
});
categorySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  },
});

module.exports = Category;
