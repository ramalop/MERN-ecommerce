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
    <SheetContent
      side="right"
      className="w-screen max-w-none sm:max-w-md p-0 flex flex-col max-h-screen"
    >
      <div className="shrink-0 border-b bg-background p-6">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
      </div>

      {/* Scrollable Cart Items - Only this section scrolls */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="space-y-4 p-6">
          {cartItems && cartItems.length > 0 ? (
            cartItems.map((item) => (
              <UserCartItemsContent key={item.id} cartItem={item} />
            ))
          ) : (
            <p className="text-center text-gray-500">Your cart is empty</p>
          )}
        </div>
      </div>

      {/* Footer - Fixed */}
      <div className="shrink-0 border-t bg-background p-6 space-y-4">
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">${totalAmount}</span>
        </div>

        <Button
          onClick={() => {
            navigate("/shop/checkout");
            setOpenCartSheet(false);
          }}
          className="w-full"
        >
          CheckOut
        </Button>
      </div>
    </SheetContent>
  );
};

export default UserCartWrapper;
