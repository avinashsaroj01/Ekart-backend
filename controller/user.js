// signup user

const User = require("../model/User");

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Login  user

exports.checkUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "user doesn't exist" });
    }
    if (user.password != password) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    // success ( user exists)

    res.status(200).json({ message: "Logged in successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
