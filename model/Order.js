const mongoose = require("mongoose");

const { Schema } = mongoose;
const paymentMethods = {
  values: ["card", "cash"],
  message: "enum validator failed for payment Methods",
};
const orderSchema = new Schema({
  items: { type: [Schema.Types.Mixed], required: true },
  totalAmount: { type: Number },
  totalItems: { type: Number },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  paymentMethod: { type: String, required: true, enum: paymentMethods },
  selectedAddress: { type: Schema.Types.Mixed, required: true },
  status: { type: String, default: "pending" },

});

const Order = mongoose.model("Order", orderSchema);

const virtual = orderSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
orderSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
module.exports = Order;
