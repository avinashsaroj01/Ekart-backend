const Brand = require("../model/Brand");

exports.fetchBrands = async(req, res) => {
  try {
    const brands = await Brand.find({});
    res.status(200).json(brands);
  } catch (error) {
    res.status(400).json({ message: "error fetchingg categoriess" });
  }
};
