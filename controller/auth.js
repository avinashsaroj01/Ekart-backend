const User = require("../model/User");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { sanitizeUser, transporter } = require("../services/common");

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

        const token = jwt.sign(sanitizeUser(doc), process.env.SECRET_KEY, {
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

exports.sendResetPasswordOtp = async (req, res) => {
  if (!req.body) req.body = {}; // ✅ guard

  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.passwordResetOtp = otp;
    user.resetOtpExpiresAt = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Reset Password OTP",
      text: `Your password reset OTP is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: "Password reset OTP sent to your email",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({ success: false, message: "Missing details" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (!user.passwordResetOtp || user.passwordResetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.resetOtpExpiresAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    const salt = crypto.randomBytes(16);

    crypto.pbkdf2(
      newPassword,
      salt,
      310000,
      32,
      "sha256",
      async (err, hashedPassword) => {
        if (err) {
          return res.json({ success: false, message: "Password reset failed" });
        }

        user.password = hashedPassword;
        user.salt = salt;
        user.passwordResetOtp = "";
        user.resetOtpExpiresAt = 0;

        await user.save();

        return res.json({
          success: true,
          message: "Password reset successfully",
        });
      },
    );
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
