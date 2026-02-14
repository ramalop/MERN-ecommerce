import React, { useState } from "react";
import img from "../../assets/account.jpg";
import Address from "@/components/shopping-view/address";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { createNewOrder } from "@/store/shop/order-slice";
import {toast} from "sonner"

const ShoppingCheckout = () => {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [didPaymentStarted,setDidPaymentStarted] = useState(false)
  const {approvalURL} = useSelector((state)=>state.shopOrder)
  const dispatch = useDispatch()

  const totalAmount = (cartItems?.items || []).reduce((sum, item) => {
    const priceToUse = item?.salePrice || item?.price;
    return sum + priceToUse * item.quantity;
  }, 0);
  console.log(currentSelectedAddress);

  function handleInitiatePaypalPayment() {
    if(cartItems.length===0){
      toast.error("Your cart is empty. Please add some items to proceed")
      return
    }
    if(currentSelectedAddress===null){
      toast.error("Please select an address to proceed")
      return
    }
    const orderData = {
      userId: user?.id,
      cartId: cartItems._id,
      cartItems: cartItems.items.map((singleItem) => ({
        productId: singleItem?.productId,
        title: singleItem?.title,
        image: singleItem?.image,
        price:
          singleItem?.salePrice > 0 ? singleItem.salePrice : singleItem.price,
        quantity: singleItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: totalAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };
    dispatch(createNewOrder(orderData)).then((data)=>{
      console.log(data,"orderData");
      if(data?.payload?.success){
        setDidPaymentStarted(true)
      }else{
        setDidPaymentStarted(false)
      }
      
    })
    
  }
  if(approvalURL){
    window.location.href = approvalURL
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={img}
          alt="account image"
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address selectedId={currentSelectedAddress?._id} setCurrentSelectedAddress={setCurrentSelectedAddress} />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsContent key={item.productId} cartItem={item} />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total </span>
              <span className="font-bold">${totalAmount} </span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button onClick={handleInitiatePaypalPayment} className="w-full">
              {didPaymentStarted?"Proccessing Payment":"Checkout"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCheckout;
