import React from "react";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import UserCartItemsContent from "./cart-items-content";
import { useNavigate } from "react-router-dom";

const UserCartWrapper = ({ cartItems, setOpenCartSheet }) => {
  const totalAmount = (cartItems || []).reduce((sum, item) => {
    const priceToUse = item?.salePrice || item?.price;
    return sum + priceToUse * item.quantity;
  }, 0);

  const navigate = useNavigate();

  return (
    <SheetContent side="right" className="w-screen max-w-none sm:max-w-md">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>
      <div className="mt-8 space-y-4">
        {cartItems && cartItems?.length > 0
          ? cartItems.map((item) => (
              <UserCartItemsContent key={item.title} cartItem={item} />
            ))
          : null}
      </div>
      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <span className="font-bold">Total </span>
          <span className="font-bold">${totalAmount} </span>
        </div>
      </div>
      <Button
        onClick={() => {
          navigate("/shop/checkout");
          setOpenCartSheet(false);
        }}
        className="w-full mt-6"
      >
        CheckOut
      </Button>
    </SheetContent>
  );
};

export default UserCartWrapper;
