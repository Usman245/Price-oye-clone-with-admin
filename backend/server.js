// server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const Product = require("./models/Product");
const multer = require("multer");

const app = express();
const PORT = 4000

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/upload", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const imageSchema = new mongoose.Schema({
  filename: String,
  path: String,
});

const Image = mongoose.model("Image", imageSchema);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Set the destination directory
  },
  filename: (req, file, cb) => {
    // Set a custom filename (e.g., timestamp + originalname)
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.productImages + "-" + uniqueSuffix + "-" + file.originalname);
  },
});

// Create the multer instance with custom storage
const upload = multer({ storage });

app.use("/uploads", express.static("uploads"));

// API endpoint for uploading an image
app.post("/upload", upload.single("image"), async (req, res) => {
  const { filename, path } = req.file;

  try {
    // Save image information to the database
    const newImage = new Image({ filename, path });
    const savedImage = await newImage.save();
    res.json({
      message: "Image uploaded successfully",
      imageUrl: `http://localhost:4000/uploads/${filename}`,
    });
  } catch (error) {
    console.error("Error saving image to the database:", error);
    res.status(500).json({ message: "Error saving image to the database" });
  }
});

// Routes
app.post("/product", async (req, res) => {
  try {
    const { name, price, category, featured, brand, stock, discription, imgurl1 } = req.body;

    // Create the product with all the data
    const product = new Product({
      name,
      price,
      category,
      featured,
      brand,
      stock,
      discription,
      imgurl1,
    });
    await product.save();
    res.status(201).json(product,);
  } catch (err) {
    res.status(400);
  }
});
app.get('/getproducts', async (req, res) => {
  try {
    const allProduct = await Product.find();
    res.status(200).json(allProduct)
  }
  catch (err) {
    res.status(401)
  }
})
app.delete('/remove/:productId', async (req, res) => {
  try {
    const product = await Product.findByIdAndRemove(req.params.productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get('/update/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      return res.status(200).json(product);
    }
    res.status(404).json("product not found")
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//featured product route
app.get('/featuredProduct', async (req, res) => {
  try {
    const featuredProducts = await Product.find({ featured: 'yes' });

    if (featuredProducts) {
      // If a featured product is found, return it as JSON
      res.json(featuredProducts);
    } else {
      // If no featured product is found, return a message
      res.json({ message: 'No featured products found' });
    }
  }
  catch (error) {
    res.status(403).json('there is an error')
  }
})
//routes for price
app.get('/under30', async (req, res) => {
  try {
    const minPrice = 10000; // Minimum price
    const maxPrice = 30000; // Maximum price

    // Fetch products within the specified price range
    const productsInRange = await Product.find({
      price: { $gte: minPrice, $lte: maxPrice },
    });

    // Send the filtered products as a JSON response
    res.json(productsInRange);
  } catch (error) {
    console.error('Error searching products by price range:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/under10', async (req, res) => {
  try {
    const minPrice = 0; // Minimum price
    const maxPrice = 10000; // Maximum price

    // Fetch products within the specified price range
    const productsInRange = await Product.find({
      price: { $gte: minPrice, $lte: maxPrice },
    });

    // Send the filtered products as a JSON response
    res.json(productsInRange);
  } catch (error) {
    console.error('Error searching products by price range:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/under50', async (req, res) => {
  try {
    const minPrice = 30000; // Minimum price
    const maxPrice = 50000; // Maximum price

    // Fetch products within the specified price range
    const productsInRange = await Product.find({
      price: { $gte: minPrice, $lte: maxPrice },
    });

    // Send the filtered products as a JSON response
    res.json(productsInRange);
  } catch (error) {
    console.error('Error searching products by price range:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/under80', async (req, res) => {
  try {
    const minPrice = 50000; // Minimum price
    const maxPrice = 80000; // Maximum price

    // Fetch products within the specified price range
    const productsInRange = await Product.find({
      price: { $gte: minPrice, $lte: maxPrice },
    });

    // Send the filtered products as a JSON response
    res.json(productsInRange);
  } catch (error) {
    console.error('Error searching products by price range:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/under2k', async (req, res) => {
  try {
    const minPrice = 80000; // Minimum price
    const maxPrice = 200000; // Maximum price

    // Fetch products within the specified price range
    const productsInRange = await Product.find({
      price: { $gte: minPrice, $lte: maxPrice },
    });

    // Send the filtered products as a JSON response
    res.json(productsInRange);
  } catch (error) {
    console.error('Error searching products by price range:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/upto2k', async (req, res) => {
  try {
    const minPrice = 200000; // Minimum price
    const maxPrice = 1000000; // Maximum price

    // Fetch products within the specified price range
    const productsInRange = await Product.find({
      price: { $gte: minPrice, $lte: maxPrice },
    });

    // Send the filtered products as a JSON response
    res.json(productsInRange);
  } catch (error) {
    console.error('Error searching products by price range:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//update product by id
app.put('/product/update/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Search funcytionality
app.get('/search', async (req, res) => {
  try {
    const { query } = req.query;

    // Perform the search based on the 'query' parameter
    // You can customize the search logic according to your needs

    const results = await Product.find({
      $text: { $search: query },
    });

    res.status(200).json(results);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the servercat
app.listen(4000, () => {
  console.log(`Server is running on port ${PORT} `);
});
