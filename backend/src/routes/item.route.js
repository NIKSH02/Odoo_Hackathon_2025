const router = require("express").Router();
const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} = require("../controllers/item.controller");
const verifyJWT = require("../middlewares/auth.middleware");
const { upload } = require("../middlewares/multer.middleware");

// Public Routes
router.get("/", getAllItems); // List/browse items (with filters)
router.get("/:id", getItemById); // Item detail

// Protected Routes
router.post("/", verifyJWT, upload.array("images", 5), createItem); // Add new item
router.put("/:id", verifyJWT, upload.array("images", 5), updateItem); // Edit item (lister/admin)
router.delete("/:id", verifyJWT, deleteItem); // Remove item (lister/admin)

module.exports = router;
