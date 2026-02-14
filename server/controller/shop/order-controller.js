const paypal = require("../../helpers/paypal")
const Order = require("../../models/Order")
const Cart = require("../../models/Cart")
const Product = require("../../models/Products")

const createOrder = async (req, res) => {
    try {
         const { userId,cartId, cartItems, addressInfo, orderStatus, paymentMethod, paymentStatus, totalAmount, orderDate, orderUpdateDate, paymentId, payerId } = req.body

         const create_payment_json = {
            intent:"sale",
            payer:{
                payment_method:"paypal"

            },
            redirect_urls:{
                return_url:`${process.env.CLIENT_BASE_URL}/shop/paypal-return` ,
                cancel_url:`${process.env.CLIENT_BASE_URL}/shop/paypal-cancel` ,
            },
            transactions:[
                {
                    item_list:{
                        items:cartItems.map((item)=>({
                            name:item.title,
                            sku:item.productId,
                            price:item.price.toFixed(2),
                            currency:'USD',
                            quantity:item.quantity
                        }))
                    },
                    amount:{
                        currency:'USD',
                        total:totalAmount.toFixed(2)
                    },
                    description:'description'
                }
            ]
         }
         paypal.payment.create(create_payment_json,async(error,paymentInfo)=>{
            if(error){
                console.log(error);
                return res.status(500).json({
                    success:false,
                    message:"Error while creating paypal payment"
                })
                
            }else {
        const newlyCreatedOrder = new Order({
          userId,
          cartId,
          cartItems,
          addressInfo,
          orderStatus,
          paymentMethod,
          paymentStatus,
          totalAmount,
          orderDate,
          orderUpdateDate,
          paymentId,
          payerId,
        });

        await newlyCreatedOrder.save();

        const approvalURL = paymentInfo.links.find(
          (link) => link.rel === "approval_url"
        ).href;

        res.status(201).json({
          success: true,
          approvalURL,
          orderId: newlyCreatedOrder._id,
        });
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};
const capturePayment = async (req, res) => {
    try {
       const {paymentId,payerId,orderId} = req.body
       let order = await Order.findById(orderId)
       if(!order){
        return res.status(404).json({
            success:false,
            message:"Order can not be found"
        })
       }
       order.paymentStatus="paid";
       order.orderStatus = "confirmed";
       order.paymentId=paymentId;
       order.payerId = payerId
       //decrease the total stock from db when the order is successful for each cartItems
       for(let item of order.cartItems){
        let product = await Product.findById(item.productId)
        if(!product){
            return res.status(400).json({
                success:false,
                message:`Not enough stocks for ${product.title}`
            })
        }
        product.totalStock -= item.quantity
        await product.save()
       }
       const getCartId = order.cartId
       await Cart.findByIdAndDelete(getCartId)
       await order.save()
       res.status(200).json({
        success:true,
        message:"order confirmed",
        data:order
       })
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Some error occured"
        })
    }
}
const getAllOrdersByUser = async(req,res)=>{
    try {
        const {userId} = req.params
        const orders = await Order.find({userId})
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
const getOrderDetails = async(req,res)=>{
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

module.exports = { createOrder, capturePayment ,getAllOrdersByUser,getOrderDetails}