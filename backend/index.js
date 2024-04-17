const express = require("express")
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const fs = require('fs');
const app = express();
const PORT = 5000;
app.use(cors());
mongoose.connect("mongodb://127.0.0.1:27017/priceoyeRegister", {

  useNewUrlParser: true,
});

const db = mongoose.connection;

db.on('error', (error) => console.error('MongoDB connection error:', error));
db.once('open', () => console.log('Connected to MongoDB'));

app.use(express.json());


const storage = multer.diskStorage({
  destination: './uploads', // Verify this destination folder exists
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });


app.use("/profile", express.static("upload/images"));
app.post("/upload", upload.single("profile"), function (req, res) {
  console.log(req.file);
  res.json({
    msg: "succes",
    url: `http://localhost:5000/profile/${req.filename}`,
  });
});

const watchesData = fs.readFileSync("./Watchs.json");
const watches = JSON.parse(watchesData);
const mobileData = fs.readFileSync("./Mobiles.json")
const mobiles = JSON.parse(mobileData)
const infinixData = fs.readFileSync("./infinix.json")
const infinix = JSON.parse(infinixData)







// Define the API endpoint to handle form submissions

app.post("/api/products", upload.array("images", 5), async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const images = req.files.map((file) => file.filename); // Save the filenames of the uploaded images

    const newProduct = {
      name: name,
      price: price,
      description: description,
      images: images,
    };

    const result = await db.collection("products").insertOne(newProduct);
    res.status(201).json(result.ops[0]);
  } catch (error) {
    console.error("Error creating product:", error);
    res.sendStatus(500);
  }
});
app.use("/uploads", express.static("uploads"));

app.post("/uploades", async (req, res) => {
  try {
    const { name, discount, price } = req.body;
    const newProduct = {
      name: name,
      discount: discount,
      price: price,
    };
    db.collection("products")
      .insertOne(newProduct)
      .then((result) => {
        res.status(201).json(result.ops[0]);
      })
      .catch((error) => {
        console.error("Error creating product:", error);
        res.sendStatus(500);
      });
  } catch (error) {
    res.send(error);
  }
});

// Watch data

// GET route for fetching all watches
app.get("/watches", (req, res) => {
  res.json(watches);
});

// GET route for fetching a specific watch by ID
app.get("/watches/:id", (req, res) => {
  const watchId = parseInt(req.params.id);
  const watch = watches.find((watch) => watch.id === watchId);

  if (watch) {
    res.json(watch);
  } else {
    res.status(404).json({ error: "Watch not found." });
  }
});

//Mobiles data
app.get("/latestmobiles", (req, res) => {
  res.send(mobiles);
});

//route for mobiles detail
app.get("/mobile/:id", (req, res) => {
  const mobileId = parseInt(req.params.id)
  const detail = mobiles.find((detail) => detail.id === mobileId)
  if (detail) {
    res.json(detail)
  }
  else {
    res.json("not found")
  }
})



// Search endpoint
app.get('/api/mobiles/search', (req, res) => {
  const { brand, minPrice, maxPrice } = req.body;

  // Perform a search based on the provided parameters
  let results = mobiles;

  if (brand) {
    results = results.filter(mobile => mobile.brand === brand);
  }

  if (minPrice) {
    results = results.filter(mobile => mobile.price >= parseFloat(minPrice));
  }

  if (maxPrice) {
    results = results.filter(mobile => mobile.price <= parseFloat(maxPrice));
  }

  res.json(results);
});



app.get("/infinix", (req, res) => {
  res.send(infinix)
})


const User = mongoose.model('User', {
  name: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  imageUrl1: String,
});
// Define a route to handle form data submission

app.post('/register', async (req, res) => {
  const { name, lastName, email, password, imageUrl1 } = req.body;

  // Do something with the formData, e.g., save it to a database
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, lastName, email, password: hashedPassword, imageUrl1 });
    await user.save();
    res.status(201).json({ status: 200, message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({
        email: email,
        password: password
      }, 'secret453gt')
      res.json({ status: 200, user, msg: "success", token })
    } else {
      res.status(401).json({ status: 401, error: 'Invalid login credentials' });
    }
  } catch (error) {
    res.status(500).json({ status: 500, error: 'Login failed' });
  }

})

app.post('/api/upload', upload.single('image'), (req, res) => {
  res.json({ message: 'File uploaded successfully', url: `req.file  ` });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
