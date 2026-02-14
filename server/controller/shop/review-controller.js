const Order = require("../../models/Order")
const Product = require("../../models/Products")
const Review = require("../../models/Review")


const addReview = async (req, res) => {
    try {
        const { productId, userId, userName, reviewMessage, reviewValue } = req.body
        if (!productId || !userId || !userName || !reviewMessage || !reviewValue) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        //check if the user has bought this product and product is delivered to him
        const order = await Order.findOne({
            userId,
            "cartItems.productId": productId,
            orderStatus: "delivered"
        })
        if (!order) {
            return res.status(403).json({
                success: false,
                message: "Purchase the product to review it"
            })
        }
        const checkExistingReview = await Review.findOne({
            productId, userId
        })
        //if user has already revied this product
        if (checkExistingReview) {
            return res.status(400).json({
                success: false,
                message: "You already reviewed this product "
            })
        }
        const newReview = new Review({ productId, userId, userName, reviewMessage, reviewValue })
        await newReview.save()
        //get all the reviews for the particular product for calculating average review
        const reviews = await Review.find({ productId })
        const totalReviewsLength = reviews.length
        const averageReview = reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) / totalReviewsLength
        await Product.findByIdAndUpdate(productId, { averageReview })
        res.status(200).json({
            success: true,
            data: newReview
        })
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Some error occured"
        })
    }
}
const getReviews = async (req, res) => {
    try {
        const { productId } = req.params
        const reviews = await Review.find({ productId })
        res.status(200).json({
            success: true,
            data: reviews
        })

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Some error occured"
        })
    }
}
module.exports = { addReview, getReviews }