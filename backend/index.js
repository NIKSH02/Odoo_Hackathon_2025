const cookieParser = require("cookie-parser");
const Cors = require("cors");
const express = require("express");
const fileUpload = require("express-fileupload");
const connectDB = require("./src/config/db.js");
const dotenv = require("dotenv");
const userRouter = require("./src/routes/user.route");
const itemRouter = require("./src/routes/item.route");
const swapRouter = require("./src/routes/swap.route");
const pointsRouter = require("./src/routes/points.route");
const adminRouter = require("./src/routes/admin.route");
const orderRouter = require("./src/routes/order.route");

dotenv.config();

const app = express();

app.use(
  Cors({
    origin: [
      "http://localhost:5173", // Vite default
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.use(cookieParser()); // This is a third-party middleware function in Express. It parses cookies attached to the client request object.

app.use(
  fileUpload({
    useTempFiles: false, // Use memory storage instead of temp files
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
    abortOnLimit: true,
    debug: true, // Enable debug logging
  })
);

// Global debug middleware
app.use((req, res, next) => {
  if (req.path.includes('/items') && req.method === 'POST') {
    console.log('=== INCOMING REQUEST ===');
    console.log('Content-Type:', req.headers['content-type']);
    console.log('req.files exists:', !!req.files);
    console.log('req.files keys:', req.files ? Object.keys(req.files) : 'no files');
    console.log('req.body keys:', Object.keys(req.body));
    console.log('========================');
  }
  next();
});

app.use(express.json()); // This is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.urlencoded({ extended: true })); // This is a built-in middleware function in Express. It parses incoming requests with urlencoded payloads and is based on body-parser.
app.use(express.static("public")); // This is a built-in middleware function in Express. It serves static files and is based on serve-static.

app.use("/api/users", userRouter); 
app.use("/api/items", itemRouter);
app.use("/api/swaps", swapRouter);
app.use("/api/points", pointsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/orders", orderRouter);
connectDB();


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
