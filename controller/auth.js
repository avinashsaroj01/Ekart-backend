const User = require("../model/User");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { sanitizeUser } = require("../services/common");

const SECRET_KEY = "SECRET_KEY";

/* ---------- SIGNUP ---------- */
exports.createUser = async (req, res) => {
  try {
    const salt = crypto.randomBytes(16);

    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async (err, hashedPassword) => {
        if (err) return res.status(400).json(err);

        const user = new User({
          ...req.body,
          password: hashedPassword,
          salt,
        });

        const doc = await user.save();

        const token = jwt.sign(sanitizeUser(doc), SECRET_KEY, {
          expiresIn: "1h",
        });

        // ✅ FIX: use SAME cookie name everywhere
        res.cookie("token", token, {
          httpOnly: true,
          maxAge: 3600000,
        });

        res.status(201).json({ id: doc.id, role: doc.role });
      },
    );
  } catch (err) {
    res.status(400).json(err);
  }
};

/* ---------- LOGIN ---------- */
exports.loginUser = async (req, res) => {
  // req.user.token comes from LocalStrategy (already correct)
  res.cookie("token", req.user.token, {
    httpOnly: true,
    maxAge: 3600000,
  });

  res.status(200).json(req.user.token);
};

/* ---------- CHECK AUTH ---------- */
exports.checkAuth = async (req, res) => {
  console.log("🔥 req.user:", req.user);

  if (req.user) {
    res.json(req.user);
  } else {
    res.sendStatus(401);
  }
};
