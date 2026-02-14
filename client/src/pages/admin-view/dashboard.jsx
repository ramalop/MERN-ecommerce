import React, { Fragment, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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

  // ✅ sync uploaded image → formData
  useEffect(() => {
    if (uploadedImageUrl) {
      setFormData((prev) => ({
        ...prev,
        image: uploadedImageUrl,
      }));
    }
  }, [uploadedImageUrl]);

  function handleDelete(id) {
    dispatch(deleteProduct(id)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getAllDashboardData());
      }
    });
  }
  function onSubmit(e) {
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
  }

  return (
    <>
      {isLoading ? (
        <Skeleton />
      ) : (
        <div className="flex gap-4 flex-col overflow-auto">
          <RecentOrdersForAdmin recentOrders={recentOrders} />
          <Separator/>
          <LowStockProductsForAdmin
            products={lowStockProducts}
            setCurrentEditedId={setCurrentEditedId}
            setOpenCreateProductsDialogue={setOpenCreateProductsDialogue}
            setFormData={setFormData}
            handleDelete={handleDelete}
          />
          <Separator/>
          <RecentUsersForAdmin recentUsers={recentUsers}/>
          <Sheet
            open={openCreateProductsDialogue}
            onOpenChange={() => {
              setOpenCreateProductsDialogue(false);
              setCurrentEditedId(null);
              setFormData(initialFormData);
            }}
          >
            <SheetContent side="right" className="overflow-auto w-full">
              <SheetHeader>
                <SheetTitle>Edit Product</SheetTitle>
                <SheetDescription>Update product details</SheetDescription>
              </SheetHeader>

              <ProductImageUpload
                imageFile={imageFile}
                setImageFile={setImageFile}
                uploadedImageUrl={uploadedImageUrl}
                setUploadedImageUrl={setUploadedImageUrl}
                imageLoadingState={imageLoadingState}
                setImageLoadingState={setImageLoadingState}
              />

              <CommonForm
                formControls={addProductFormElements}
                formData={formData}
                setFormData={setFormData}
                buttonText="Update Product"
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
