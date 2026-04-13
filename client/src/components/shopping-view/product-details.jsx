import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import { setProductDetails } from "@/store/shop/product-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { addReview, getAllReviews } from "@/store/shop/review-slice";
import { Skeleton } from "../ui/skeleton";
import { Loader2 } from "lucide-react";

const ProductDetailsDialog = ({ open, setOpen, productDetails, isLoading }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews, isLoading: isLoadingReviews } = useSelector(
    (state) => state.shopReview,
  );
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  function handleAddReview() {
    setOpen(false);
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      }),
    ).then((data) => {
      console.log(data);

      if (data?.payload?.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getAllReviews(productDetails?._id));
        toast.success("Thanks for the review");
      }
      if (!data?.payload?.success) {
        toast.error(data?.payload?.message || "Failed to add review");
      }
    });
  }
  function handleRatingChange(getRating) {
    setRating(getRating);
  }
  function handleProductDetailsOpen() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }
  function handleAddToCart(currentProductId, getTotalStock) {
    const cartList = cartItems.items || [];
    const cartItem = cartList.find(
      (item) => item.productId === currentProductId,
    );

    if (cartItem && cartItem.quantity >= getTotalStock) {
      toast.error(`Only ${getTotalStock} quantity available`);
      return;
    }
    setLoading(true);
    dispatch(
      addToCart({
        userId: user?.id,
        productId: currentProductId,
        quantity: 1,
      }),
    ).then((data) => {
      setLoading(false);
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast.success("Product added to cart");
      }
    });
  }
  useEffect(() => {
    if (productDetails !== null) dispatch(getAllReviews(productDetails?._id));
  }, [productDetails]);
  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  return (
    <Dialog open={open} onOpenChange={handleProductDetailsOpen}>
      <DialogContent
        className="w-[95vw] max-w-5xl
    grid grid-cols-1 md:grid-cols-2
    gap-4 md:gap-8
    p-4 md:p-8
    max-h-[90vh] overflow-y-auto
    min-h-[500px]"
      >
        {isLoading ? (
          <>
            <div className="relative overflow-hidden rounded-lg">
              <Skeleton className="aspect-square w-full h-full" />
            </div>
            <div className="">
              <div>
                <Skeleton className="h-9 w-3/4 mb-3" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-5/6" />
              </div>
              <div className="flex items-center justify-between mt-5">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="mt-5 mb-5">
                <Skeleton className="h-10 w-full" />
              </div>
              <Separator />
              <div className="max-h-[300px] overflow-auto mt-5">
                <Skeleton className="h-6 w-16 mb-4" />
                <div className="grid gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="grid gap-2 flex-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={productDetails?.image}
                alt={productDetails?.title}
                width={600}
                height={600}
                className="aspect-square w-full object-cover"
              />
            </div>
            <div className="">
              <div>
                <h1 className="text-3xl font-extrabold">
                  {productDetails?.title}
                </h1>
                <p className="text-muted-foreground text-2xl mb-5 mt-4">
                  {productDetails?.description}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p
                  className={`text-3xl font-bold text-primary ${productDetails?.salePrice > 0 ? "line-through" : ""}`}
                >
                  ${productDetails?.price}
                </p>
                {productDetails?.salePrice > 0 ? (
                  <p className="text-2xl font-bold text-muted-foreground">
                    ${productDetails?.salePrice}
                  </p>
                ) : null}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-0.5">
                  <StarRatingComponent rating={averageReview} />
                </div>
                <span className="text-muted-foreground">
                  ({averageReview.toFixed(2)})
                </span>
              </div>
              <div className="mt-5 mb-5">
                {productDetails?.totalStock === 0 ? (
                  <Button className="w-full cursor-not-allowed opacity-60">
                    Out of Stock
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() =>
                      handleAddToCart(
                        productDetails?._id,
                        productDetails?.totalStock,
                      )
                    }
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Add To Cart"
                    )}
                  </Button>
                )}
              </div>
              <Separator />
              <div className="max-h-[300px] overflow-auto">
                <h2 className="text-xl font-bold mb-4">Riviews</h2>
                <div className="grid gap-6">
                  {isLoadingReviews ? (
                    <>
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-4">
                          <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                          <div className="grid gap-2 flex-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-full" />
                          </div>
                        </div>
                      ))}
                    </>
                  ) : reviews && reviews.length > 0 ? (
                    reviews.map((reviewItem) => (
                      <div key={reviewItem?._id} className="flex gap-4">
                        <Avatar className="w-10 h-10 border">
                          <AvatarFallback>
                            {reviewItem?.userName[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold">
                              {reviewItem?.userName}
                            </h3>
                          </div>
                          <div className="flex items-center gap-0.5">
                            <StarRatingComponent
                              rating={reviewItem?.reviewValue}
                            />
                          </div>
                          <p className="text-muted-foreground">
                            {reviewItem.reviewMessage}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <h1>No Reviews</h1>
                  )}
                </div>
                <div className="mt-10 gap-2 flex flex-col">
                  <Label>Write a review</Label>
                  <div className="flex gap-1">
                    <StarRatingComponent
                      rating={rating}
                      handleRatingChange={handleRatingChange}
                    />
                  </div>
                  <Input
                    name="reviewMsg"
                    value={reviewMsg}
                    onChange={(e) => setReviewMsg(e.target.value)}
                    placeholder="write a riview"
                  />
                  <Button
                    onClick={handleAddReview}
                    disabled={reviewMsg.trim() === ""}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsDialog;
