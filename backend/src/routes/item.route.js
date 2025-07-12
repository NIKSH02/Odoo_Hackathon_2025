const router = require("express").Router();
const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} = require("../controllers/item.controller");
const verifyJWT = require("../middlewares/auth.middleware");

// Public Routes
router.get("/", getAllItems); // List/browse items (with filters)
router.get("/:id", getItemById); // Item detail

// Protected Routes
router.post("/", verifyJWT, createItem); // Add new item
router.put("/:id", verifyJWT, updateItem); // Edit item (lister/admin)
router.delete("/:id", verifyJWT, deleteItem); // Remove item (lister/admin)

module.exports = router;
