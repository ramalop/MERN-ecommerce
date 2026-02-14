import Order from "../../models/Order.js"
import Products from "../../models/Products.js"
import User from "../../models/User.js"

export const getRecentData = async (req, res) => {
    try {
        const [
            recentOrders,
            recentDeliveredOrders,
            recentUsers,
            recentProducts,
            lowStockProducts
        ] = await Promise.all([

            Order.find().sort({ _id: -1 }).limit(5),

            Order.find({ orderStatus: "delivered" })
                .sort({ _id: -1 })
                .limit(5),

            User.find().sort({ _id: -1 }).limit(5),

            Products.find().sort({ _id: -1 }).limit(4),

            Products.find({ totalStock: { $lte: 10 } })
                .sort({ totalStock: 1 })
                .limit(5)

        ])
        res.json({
            success: true,
            data: {
                recentOrders,
                recentDeliveredOrders,
                recentUsers,
                recentProducts,
                lowStockProducts
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Some error Occurred"
        })
    }

}


export const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find()
        res.status(200).json({
            success:true,
            data:allUsers
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Some error Occurred"
        })
    }


}
