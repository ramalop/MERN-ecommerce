const express = require("express")
const { getAllOrdersOfAllUsers, getOrderDetailsForAdmin, updateOrderStatus, getAllDeliveredOrders } = require("../../controller/admin/order-controller")

const router = express.Router()


router.get("/getAllOrders",getAllOrdersOfAllUsers)
router.get("/getOrderDetails/:id",getOrderDetailsForAdmin)
router.put("/update/:id",updateOrderStatus)
router.get("/getAllDeliveredOrders",getAllDeliveredOrders)


module.exports = router;