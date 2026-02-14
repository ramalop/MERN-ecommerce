const Order = require("../../models/Order")


const getAllOrdersOfAllUsers = async(req,res)=>{
    try {
        const orders = await Order.find({})
        if(!orders.length>0){
            return res.status(404).json({
                success:false,
                message:"No orders found for this user"
            })
        }
        res.status(200).json({
            success:true,
            data:orders
        })
    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            success:false,
            message:"Some Error Occurred"
        })
    }
}

const getOrderDetailsForAdmin = async(req,res)=>{
    try {
        const {id} = req.params
        const order = await Order.findById(id)
        if(!order){
            return res.status(404).json({
                success:false,
                message:"No orders found with this id"
            })
        }
        res.status(200).json({
            success:true,
            data:order
        })
        
    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            success:false,
            message:"Some Error Occurred"
        })
    }
}
const updateOrderStatus = async(req,res)=>{
    try {
        const {id} = req.params
        const {orderStatus} = req.body
        const order = await Order.findById(id)
        if(!order){
            return res.status(404).json({
                success:false,
                message:"Order not found"
            })
        }
        await Order.findByIdAndUpdate(id,{orderStatus})
        res.status(200).json({
            success:true,
            message:"Order status updated successfully"
        })
    } catch (error) {
       console.log(error);
        
        res.status(500).json({
            success:false,
            message:"Some Error Occurred"
        }) 
    }
}
const getAllDeliveredOrders = async (req, res) => {
    try {
        const allDeliveredOrders = await Order.find({ orderStatus: "delivered" }).sort({ _id: -1 })

        res.status(200).json({
            success:true,
            data:allDeliveredOrders
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Some error Occurred"
        })
    }


}
module.exports = {getAllOrdersOfAllUsers,getOrderDetailsForAdmin,updateOrderStatus,getAllDeliveredOrders}