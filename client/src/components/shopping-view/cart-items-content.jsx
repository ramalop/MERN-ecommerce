import React, { useState } from "react";
import { Button } from "../ui/button";
import { Loader2, Minus, Plus, Trash } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { toast } from "sonner";

const UserCartItemsContent = ({ cartItem }) => {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);

  const [loadingAction, setLoadingAction] = useState({
    type: null,
    productId: null,
  });

  const dispatch = useDispatch();

  function handleCartItemDelete(cartItem) {
    setLoadingAction({
      type: "delete",
      productId: cartItem.productId,
    });

    dispatch(
      deleteCartItem({ userId: user?.id, productId: cartItem.productId }),
    ).then((data) => {
      setLoadingAction({ type: null, productId: null });

      if (data?.payload.success) {
        toast.success("cart item deleted successfully");
      }
    });
  }

  function handleUpdateQuantity(e, currentCartItem, actionType) {
    e.preventDefault();

    if (!currentCartItem) return;

    const cartList = cartItems?.items || [];

    if (actionType === "plus") {
      const cartItem = cartList.find(
        (item) => item.productId === currentCartItem.productId,
      );

      const product = productList.find(
        (p) => p?._id === currentCartItem.productId,
      );

      if (!cartItem || !product) return;

      if (cartItem.quantity >= product.totalStock) {
        toast.error(`Only ${product.totalStock} quantity is available`);
        return;
      }
    }

    const newQuantity =
      actionType === "plus"
        ? currentCartItem.quantity + 1
        : currentCartItem.quantity - 1;

    setLoadingAction({
      type: actionType,
      productId: currentCartItem.productId,
    });

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: currentCartItem.productId,
        quantity: newQuantity,
      }),
    ).then((data) => {
      setLoadingAction({ type: null, productId: null });

      if (data?.payload?.success) {
        toast.success("Cart item updated successfully");
      }
    });
  }

  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className="w-20 h-20 rounded object-cover"
      />

      <div className="flex-1 min-w-0">
        <h3 className="font-extrabold">
          {cartItem?.title.length > 6
            ? cartItem?.title.slice(0, 6)
            : cartItem?.title}
        </h3>

        <div className="flex items-center mt-1 gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={(e) => {
              e.preventDefault();
              e.currentTarget.blur();
              handleUpdateQuantity(e, cartItem, "minus");
            }}
            disabled={
              cartItem?.quantity === 1 ||
              loadingAction.productId === cartItem.productId
            }
          >
            <Minus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>

          <span className="font-semibold min-w-[20px] flex justify-center">
            {loadingAction.productId === cartItem.productId &&
            (loadingAction.type === "plus" ||
              loadingAction.type === "minus") ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              cartItem?.quantity
            )}
          </span>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={(e) => {
              e.preventDefault();
              e.currentTarget.blur();
              handleUpdateQuantity(e, cartItem, "plus");
            }}
            disabled={loadingAction.productId === cartItem.productId}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">increase</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-end shrink-0">
        <p className="font-semibold">
          $
          {(
            (cartItem?.salePrice > 0 ? cartItem.salePrice : cartItem.price) *
            cartItem.quantity
          ).toFixed(2)}
        </p>

        {loadingAction.productId === cartItem.productId &&
        loadingAction.type === "delete" ? (
          <Loader2 className="w-4 h-4 animate-spin mt-1" />
        ) : (
          <Trash
            onClick={() => handleCartItemDelete(cartItem)}
            className="cursor-pointer mt-1"
            size={20}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(UserCartItemsContent);
