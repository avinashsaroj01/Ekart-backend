const Product = require("../model/Product");




const getUnsplashImages = async (query) => {
  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${query}&per_page=3&client_id=${process.env.UNSPLASH_ACCESS_KEY}`,
  );

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    return [];
  }

  return data.results.map(
    (img) => img.urls.raw + "&auto=format&fit=crop&w=500&q=80",
  );
};


exports.createProduct = async (req, res) => {
  try {
    let productData = { ...req.body };

    if (!req.body.thumbnail || req.body.thumbnail.trim() === "") {
      try {
        const searchQuery = `${req.body.brand || ""} ${req.body.category || ""}`;
        const images = await getUnsplashImages(searchQuery);

        if (images.length > 0) {
          productData.thumbnail = images[0];
          productData.images = images;
        }
      } catch (unsplashError) {
        console.log("Unsplash error:", unsplashError.message);
        // Continue without blocking product creation
      }
    }

    const product = await Product.create(productData);
    res.status(201).json(product);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};




exports.fetchAllProducts = async (req, res) => {
  // filter = {"category":["smartphone","laptops"]}
  // sort = {_sort:"price",_order="desc"}
  // pagination = {_page:1,_limit=10}
  // TODO : we have to try with multiple category and brands after change in front-end
  let condition = {};
  if (!req.query.admin) {
    condition.deleted = { $ne: true };
  }

  let query = Product.find(condition);
  let totalProductsQuery = Product.find(condition);

  if (req.query.category) {
    query = query.find({ category: req.query.category });
    totalProductsQuery = totalProductsQuery.find({
      category: req.query.category,
    });
  }
  if (req.query.brand) {
    query = query.find({ brand: req.query.brand });
    totalProductsQuery = totalProductsQuery.find({ brand: req.query.brand });
  }
  //TODO : How to get sort on discounted Price not on Actual price
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  const totalDocs = await totalProductsQuery.clone().countDocuments();
  console.log({ totalDocs });

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec();
    res.set("X-Total-Count", totalDocs);
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};