const router = require("express").Router();
const { createProduct, deleteProduct, updateProduct, getProducts, getProductByName, blackListProduct, removeFromBlackList } = require("../controllers/productController");
const verifyToken = require("../middlewares/verifyToken");
const upload = require("../middlewares/multer");

router.post("/create-product", verifyToken, upload.array("images",4), createProduct);
router.put("/update-product/:id", verifyToken, updateProduct);
router.delete("/delete-product/:id", verifyToken, deleteProduct);
router.get("/get-products",getProducts);
router.get("/get-product-by-name/:name",getProductByName);
router.put("/blacklist-product/:id",verifyToken,blackListProduct);
router.put("/remove-from-blacklist/:id",verifyToken,removeFromBlackList);

module.exports = router;