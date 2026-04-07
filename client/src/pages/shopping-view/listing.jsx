
import ProductFilter from "@/components/shopping-view/filter";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/product-slice";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join("&");
}

function ShoppingListing() {
  const dispatch = useDispatch();

  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  //for add to card button loading state
    const [loadingProductId, setLoadingProductId] = useState(null);

  const categorySearchParam = searchParams.get("category");

 
  const handleSort = useCallback((value) => {
    setSort(value);
  }, []);


  const handleFilter = useCallback((sectionId, option) => {
    setFilters((prev) => {
      const currentValues = prev[sectionId] || [];

      const updatedValues = currentValues.includes(option)
        ? currentValues.filter((v) => v !== option)
        : [...currentValues, option];

      const updatedFilters = {
        ...prev,
        [sectionId]: updatedValues,
      };

      sessionStorage.setItem("filters", JSON.stringify(updatedFilters));
      return updatedFilters;
    });
  }, []);


  const handleGetProductDetails = useCallback(
    (id) => {
      dispatch(fetchProductDetails(id));
    },
    [dispatch]
  );


  const handleAddToCart = useCallback(
    (id, stock) => {
      
      const cartList = cartItems?.items || [];
      const cartItem = cartList.find((item) => item.productId === id);

      if (cartItem && cartItem.quantity >= stock) {
        toast.error(`Only ${stock} quantity is available`);
        return;
      }
      setLoadingProductId(id)
      dispatch(
        addToCart({
          userId: user?.id,
          productId: id,
          quantity: 1,
        })
      ).then((data) => {
        setLoadingProductId(null)
        if (data?.payload?.success) {
          dispatch(fetchCartItems(user?.id));
          toast.success("Product Added To Cart");
        }
      });
    },
    [dispatch, cartItems, user]
  );

  //  INITIAL LOAD
  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [categorySearchParam]);

  // UPDATE URL PARAMS
  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const query = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(query));
    }
  }, [filters, setSearchParams]);

  //  FETCH PRODUCTS
  useEffect(() => {
    if (filters !== null && sort !== null) {
      dispatch(
        fetchAllFilteredProducts({
          filterParams: filters,
          sortParams: sort,
        })
      );
    }
  }, [dispatch, sort, filters]);

  //  OPEN PRODUCT DETAILS
  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] mt-10 gap-6 p-4 md:p-6">
      
      {/* FILTER */}
      <ProductFilter filters={filters} handleFilter={handleFilter} />

      <div className="bg-background w-full rounded-lg shadow-sm">
        
        {/* HEADER */}
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex gap-1">
                <ArrowUpDownIcon className="h-4 w-4" />
                Sort by
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                {sortOptions.map((item) => (
                  <DropdownMenuRadioItem key={item.id} value={item.id}>
                    {item.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {productList?.length > 0 &&
            productList.map((productItem) => (
              <ShoppingProductTile
                key={productItem._id} 
                product={productItem}
                handleGetProductDetails={handleGetProductDetails}
                handleAddToCart={handleAddToCart}
                loading={loadingProductId === productItem._id}
              />
            ))}
        </div>
      </div>

      {/* PRODUCT DETAILS MODAL */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingListing;

