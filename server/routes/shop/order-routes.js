const express = require("express")
const { createOrder, capturePayment, getAllOrdersByUser, getOrderDetails } = require("../../controller/shop/order-controller")

const router = express.Router()


router.post("/create",createOrder)
router.post("/capture",capturePayment)
router.get("/getAllOrders/:userId",getAllOrdersByUser)
router.get("/getOrderDetals/:id",getOrderDetails)


module.exports = router