const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const User = require("./model/User");

const productsRoute = require("./routes/Product");
const usersRoute = require("./routes/User");
const authRoute = require("./routes/Auth");
const brandsRoute = require("./routes/Brand");
const categoryRoute = require("./routes/Category");
const cartRoute = require("./routes/Cart");
const orderRoute = require("./routes/Order");

const { sanitizeUser, cookieExtractor, isAuth } = require("./services/common");

const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;

const app = express();
const SECRET_KEY = "SECRET_KEY";

/* -------------------- DB -------------------- */
mongoose
  .connect("mongodb://localhost:27017/ekartdb")
  .then(() => console.log("✅ Database connected"))
  .catch(console.error);

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
     exposedHeaders: ["X-Total-Count"],
  }),
);

app.use(passport.initialize());

/* -------------------- DEBUG LOGS -------------------- */
app.use((req, res, next) => {
  console.log("🔥 Incoming:", req.method, req.url);
  console.log("🍪 Cookies:", req.cookies);
  next();
});

/* -------------------- PASSPORT LOCAL -------------------- */
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email }).exec();
        if (!user) return done(null, false);

        crypto.pbkdf2(
          password,
          user.salt,
          310000,
          32,
          "sha256",
          (err, hashedPassword) => {
            if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
              return done(null, false);
            }

            const token = jwt.sign(sanitizeUser(user), SECRET_KEY, {
              expiresIn: "1h",
            });

            return done(null, { token });
          },
        );
      } catch (err) {
        done(err);
      }
    },
  ),
);

/* -------------------- PASSPORT JWT -------------------- */
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: SECRET_KEY,
    },
    async (payload, done) => {
      console.log("✅ JWT payload:", payload);
      try {
        const user = await User.findById(payload.id);
        if (!user) return done(null, false);
        return done(null, sanitizeUser(user));
      } catch (err) {
        return done(err, false);
      }
    },
  ),
);

/* -------------------- ROUTES -------------------- */
app.use("/auth", authRoute);
app.use("/products", isAuth(), productsRoute);
app.use("/users", isAuth(), usersRoute);
app.use("/brands", isAuth(), brandsRoute);
app.use("/categories", isAuth(), categoryRoute);
app.use("/cart", isAuth(), cartRoute);
app.use("/orders", isAuth(), orderRoute);

app.get("/", (_, res) => res.json({ status: "OK" }));

/* -------------------- SERVER -------------------- */
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
