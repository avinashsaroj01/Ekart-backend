const mongoose = require("mongoose");
  const { Schema } = mongoose;
  const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: Buffer, required: true },
    role: { type: String, required: true, default: "user" },
    addresses: { type: [Schema.Types.Mixed], required: true },
    name: { type: String },
    salt: { type: Buffer },
  });

const User = mongoose.model("User", userSchema);

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
userSchema.set("toJSON", {
  virtuals: true,
});
userSchema.set("toObject", {
  virtuals: true,
});
userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  },
});

module.exports = User;
