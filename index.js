const User = require("./model/User");
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
const session = require("express-session");
// const csrf = require("csurf");
const passport = require("passport");
const crypto = require("crypto");
const {isAuth, sanitizeUser} = require("./services/common");


const LocalStrategy = require("passport-local").Strategy;
//middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);
app.use(passport.authenticate("session"));
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

app.use(express.json()); // to parse request.body
app.use("/products", isAuth, productsRoute);
app.use("/users", usersRoute);
app.use("/auth", authRoute);
app.use("/brands", brandsRoute);
app.use("/categories", categoryRoute);
app.use("/cart", cartRoute);
app.use("/orders", orderRoute);

// passport strategy
passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await User.findOne({ email: username }).exec();
      if (!user) {
        done(null, false, { message: "Invalid Credentials" });
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          // TODO: this is just temporary, we will use strong password auth
          console.log({ user });
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            // TODO: We will make addresses independent of login
            done(null, false, { message: "Invalid Credentials" });
          } else {
            done(null, sanitizeUser(user));
          }
        }
      );
    } catch (err) {
      done(err);
    }
  })
);

// this creates session variable req.user on being called .
passport.serializeUser(function (user, cb) {
  console.log("serialize", user);
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});
// this changes sessin variable req.user when called from aouthorised  request
passport.deserializeUser(function (user, cb) {
  console.log("de-serialize", user);

  process.nextTick(function () {
    return cb(null, user);
  });
});
app.listen(5000, () => {
  console.log("Server statred at port : 5000");
});
