const Category = require("../model/Category");

exports.fetchCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ message: "error fetchingg categoriess" });
  }
};
