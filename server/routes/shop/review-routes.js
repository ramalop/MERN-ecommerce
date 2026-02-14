const express = require("express")
const { getReviews, addReview } = require("../../controller/shop/review-controller")

const router = express.Router()

router.get("/getReviews/:productId",getReviews)
router.post("/addReview",addReview)

module.exports = router