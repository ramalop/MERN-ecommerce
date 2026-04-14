import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import RecentOrdersForAdmin from "@/components/admin-view/recent-order";
import LowStockProductsForAdmin from "@/components/admin-view/low-stock-products";
import ProductImageUpload from "@/components/admin-view/image-upload";
import CommonForm from "@/components/common/form";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

import { Skeleton } from "@/components/ui/skeleton";

import { getAllDashboardData } from "@/store/admin/dashboard-slice";
import { editProduct, deleteProduct } from "@/store/admin/product-slice";
import { addProductFormElements } from "@/config";
import { Separator } from "@/components/ui/separator";
import RecentUsersForAdmin from "@/components/admin-view/recent-users";

const initialFormData = {
  image: "",
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { recentOrders, isLoading, lowStockProducts, recentUsers } =
    useSelector((state) => state.adminRecentData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [openCreateProductsDialogue, setOpenCreateProductsDialogue] =
    useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);

  // fetch dashboard data
  useEffect(() => {
    dispatch(getAllDashboardData());
  }, [dispatch]);

 
  useEffect(() => {
    if (uploadedImageUrl) {
      setFormData((prev) => ({
        ...prev,
        image: uploadedImageUrl,
      }));
    }
  }, [uploadedImageUrl]);

  const handleDelete = useCallback(
    (id) => {
      dispatch(deleteProduct(id)).then((data) => {
        if (data?.payload?.success) {
          dispatch(getAllDashboardData());
        }
      });
    },
    [dispatch],
  );
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();

      dispatch(
        editProduct({
          id: currentEditedId,
          formData,
        }),
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(getAllDashboardData());
          setOpenCreateProductsDialogue(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }
      });
    },
    [dispatch, currentEditedId, formData],
  );

  return (
    <>
      {isLoading ? (
        <div className="flex flex-col gap-3 p-2 bg-gray-100 m-3">
          <div className="flex flex-col gap-2 h-[400px]">
            {[1,2,3,4,5,6,7].map((i)=>(<Skeleton key={i} className="w-full h-[50px]"/>))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {[1,2,3,4].map((i)=>(<Skeleton key={i} className="h-[400px]"/>))}

          </div>
          <div className="flex flex-col gap-2 h-[400px]">
            {[1,2,3,4,5,6,7].map((i)=>(<Skeleton key={i} className="w-full h-[50px]"/>))}
          </div>
          
          
        </div>
      ) : (
        <div className="flex gap-4 flex-col overflow-auto">
          <RecentOrdersForAdmin recentOrders={recentOrders} />
          <Separator />
          <LowStockProductsForAdmin
            products={lowStockProducts}
            setCurrentEditedId={setCurrentEditedId}
            setOpenCreateProductsDialogue={setOpenCreateProductsDialogue}
            setFormData={setFormData}
            handleDelete={handleDelete}
          />
          <Separator />
          <RecentUsersForAdmin recentUsers={recentUsers} />
          <Sheet
            open={openCreateProductsDialogue}
            onOpenChange={() => {
              setOpenCreateProductsDialogue(false);
              setCurrentEditedId(null);
              setFormData(initialFormData);
            }}
          >
            <SheetContent side="right" className="overflow-auto w-full p-3">
              <SheetHeader className="mb-3">
                <SheetTitle>Edit Product</SheetTitle>
                <SheetDescription >Update product details</SheetDescription>
              </SheetHeader>
{/* 
              <ProductImageUpload
                imageFile={imageFile}
                setImageFile={setImageFile}
                uploadedImageUrl={uploadedImageUrl}
                setUploadedImageUrl={setUploadedImageUrl}
                imageLoadingState={imageLoadingState}
                setImageLoadingState={setImageLoadingState}
              /> */}

              <CommonForm
                formControls={addProductFormElements}
                formData={formData}
                setFormData={setFormData}
                buttonText="Edit Product"
                onSubmit={onSubmit}
              />
            </SheetContent>
          </Sheet>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
