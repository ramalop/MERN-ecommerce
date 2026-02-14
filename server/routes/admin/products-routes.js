const express = require("express")

const { handleImageUpload, addProduct, editProduct, deleteProduct, fetchAllProducts } = require("../../controller/admin/products-controller")
const { upload } = require("../../helpers/cloudinary")

const router = express.Router()

router.post("/upload-image", upload.single("my_products"), handleImageUpload)
router.post("/add", addProduct)
router.put("/edit/:id", editProduct)
router.delete("/delete/:id", deleteProduct)
router.get("/get", fetchAllProducts)
module.exports = router