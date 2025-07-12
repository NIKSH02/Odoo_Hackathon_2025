const router = require("express").Router();
const {
  getAllItems,
  getUserItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} = require("../controllers/item.controller");
const verifyJWT = require("../middlewares/auth.middleware");
const checkProfileComplete = require("../middlewares/profileComplete.middleware");

// Debug middleware
const debugMiddleware = (req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log('Headers content-type:', req.headers['content-type']);
  console.log('Body keys:', Object.keys(req.body));
  console.log('Files:', req.files ? Object.keys(req.files) : 'No files');
  next();
};

// Public Routes
router.get("/", getAllItems); // List/browse items (with filters)
router.get("/:id", getItemById); // Item detail

// Protected Routes
router.get("/user/my-items", verifyJWT, getUserItems); // Get current user's items
router.post("/", verifyJWT, checkProfileComplete, debugMiddleware, createItem); // Add new item
router.put("/:id", verifyJWT, checkProfileComplete, updateItem); // Edit item (lister/admin)
router.delete("/:id", verifyJWT, deleteItem); // Remove item (lister/admin)

module.exports = router;
