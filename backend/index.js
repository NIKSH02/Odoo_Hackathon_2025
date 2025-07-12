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


app.use(express.json()); // This is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.urlencoded({ extended: true })); // This is a built-in middleware function in Express. It parses incoming requests with urlencoded payloads and is based on body-parser.
app.use(express.static("public")); // This is a built-in middleware function in Express. It serves static files and is based on serve-static.

app.use(cookieParser()); // This is a third-party middleware function in Express. It parses cookies attached to the client request object.

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 50 * 1024 * 1024 }, // Optional: limit file size to 50MB
    abortOnLimit: true, // Optional: return 413 when file size is exceeded
  })
); // This is a third-party middleware function in Express. It parses file uploads and is based on express-fileupload.



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
