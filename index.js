const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const stripe = require("stripe")(process.env.STRIPE_KEY);


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
app.set("trust proxy", 1);
/* -------------------- DATABASE -------------------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Database connected"))
  .catch(console.error);

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.json());
app.use(cookieParser());

const allowedOrigin = process.env.CLIENT_URL;

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin || origin === allowedOrigin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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

            const token = jwt.sign(sanitizeUser(user), process.env.SECRET_KEY, {
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
      secretOrKey: process.env.SECRET_KEY,
    },
    async (payload, done) => {
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

app.get("/", (req, res) => {
  res.json({ status: "OK" });
});

/* -------------------- STRIPE PAYMENT (UNCHANGED) -------------------- */
const calculateOrderAmount = (items) => {
  return 1400;
};

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

/* -------------------- SERVER -------------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
