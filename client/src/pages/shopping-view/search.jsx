import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/product-slice";
import { getSearchResults, resetSearchResult } from "@/store/shop/search-slice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchResults, isLoading } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    console.log(cartItems);
    const cartList = cartItems?.items || [];
    const cartItem = cartList.find(
      (item) => item.productId === getCurrentProductId,
    );
    if (cartItem && cartItem.quantity >= getTotalStock) {
      toast.error(`Only ${getTotalStock} quantity is available`);
      return;
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      }),
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast.success("Product Added To Cart");
      }
    });
  }
  function handleGetProductDetails(getCurrentProductId) {
    console.log(getCurrentProductId);
    dispatch(fetchProductDetails(getCurrentProductId));
  }
  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const trimmed = keyword.trim();

    if (trimmed.length <= 2) {
      dispatch(resetSearchResult());
      return;
    }

    const timer = setTimeout(() => {
      setSearchParams({ keyword: trimmed });
      dispatch(getSearchResults(trimmed));
    }, 1000);

    return () => clearTimeout(timer);
  }, [keyword]);
  console.log(searchResults, "search result");
  console.log(keyword, "keyword");

  return (
    <div className="container mx-auto mt-10 md:px-6 px-4 py-8">
      <div className="flex justify-center mb-8">
        <div className="flex w-full items-center">
          <Input
            value={keyword}
            name="keyword"
            onChange={(e) => setKeyword(e.target.value)}
            className="py-6"
            placeholder="Search Products..."
          />
        </div>
      </div>
      {isLoading && <Skeleton/>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {searchResults && searchResults.length > 0 ? (
          searchResults.map((result) => {
            return (
              <ShoppingProductTile
                product={result}
                handleAddToCart={handleAddToCart}
                 handleGetProductDetails={handleGetProductDetails}
              />
            );
          })
        ) : searchResults.length==0?(
          <h1 className="col-span-full lg:text-5xl  font-extrabold w-full">Start Typing</h1>
        ):<h1 className="col-span-full text-5xl font-extrabold w-full">No results found!</h1>}
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
};

export default Search;
