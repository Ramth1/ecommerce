const { addPincode, getPincode } = require("../controllers/pincodeController");
const verifyToken = require("../middlewares/verifyToken")
 
const router = require("express").Router();

router.post("/add-pincodes", verifyToken, addPincode);
router.get("/get-pincode/:pincode", getPincode)

module.exports= router;