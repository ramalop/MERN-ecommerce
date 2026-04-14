import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { addProductFormElements } from "@/config";
import { addNewProduct, deleteProduct, editProduct, fetchAllProducts } from "@/store/admin/product-slice";
import { Item } from "@radix-ui/react-select";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const initialFormData = {
  image: "",
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: ""
};

const AdminProducts = () => {
  const [openCreateProductsDialogue, setOpenCreateProductsDialogue] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const { productList ,isLoading} = useSelector((state) => state.adminProducts);

  

  const dispatch = useDispatch();

  useEffect(() => {
  if (uploadedImageUrl) {
    setFormData((prev) => ({
      ...prev,
      image: uploadedImageUrl,
    }));
  }
}, [uploadedImageUrl]);

  function onSubmit(e) {
    e.preventDefault();
    currentEditedId !==null?
    dispatch(editProduct({
      id:currentEditedId,formData
    })).then((data)=>{
      if (data?.payload.success){
        dispatch(fetchAllProducts())
        setFormData(initialFormData)
        setOpenCreateProductsDialogue(false)
        setCurrentEditedId(null)
      }
    }) :
    dispatch(
      addNewProduct({
        ...formData,
        image: uploadedImageUrl,
      }),
    ).then((data) => {

      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        setOpenCreateProductsDialogue(false);
        setImageFile(null);
        setFormData(initialFormData);
        toast.success("Product added successfully");
      }
    });
  }

  function handleDelete(getCurrentProductId){
    dispatch(deleteProduct(getCurrentProductId)).then((data)=>{
      if (data?.payload?.success){
        dispatch(fetchAllProducts())
        toast.success("Product Deleted Successfully")
      }
    })
    
  }
//to disable the form submission button 
 function isFormValid(){
  return Object.keys(formData).map((key)=>formData[key]!=="").every((item)=>item)
 }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);


  return (
  <Fragment>
    <div className="mb-5 w-full flex justify-end">
      <Button onClick={() => setOpenCreateProductsDialogue(true)}>
        Add new product
      </Button>
    </div>

    {/* 🔥 Products Grid / Skeleton */}
    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-2">
      {isLoading ? (
        // ✅ Skeleton UI
        [1,2,3,4,5,6,7,8].map((i) => (
          <div
            key={i}
            className="border rounded-lg p-3 flex flex-col gap-3"
          >
            {/* Image */}
            <Skeleton className="w-full h-[180px] rounded-md" />

            {/* Title */}
            <Skeleton className="h-4 w-[70%]" />

            {/* Price */}
            <div className="flex justify-between">
              <Skeleton className="h-4 w-[30%]" />
              <Skeleton className="h-4 w-[30%]" />
            </div>

            {/* Buttons */}
            <div className="flex gap-2 mt-2">
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-full rounded-md" />
            </div>
          </div>
        ))
      ) : productList && productList.length > 0 ? (
        // ✅ Actual Products
        productList.map((productItem) => (
          <AdminProductTile
            key={productItem._id}
            setCurrentEditedId={setCurrentEditedId}
            setOpenCreateProductsDialogue={setOpenCreateProductsDialogue}
            setFormData={setFormData}
            product={productItem}
            handleDelete={handleDelete}
          />
        ))
      ) : (
        // ✅ Empty State
        <div className="col-span-full text-center py-10">
          No products found
        </div>
      )}
    </div>

    {/* 🔥 Sheet */}
    <Sheet
      open={openCreateProductsDialogue}
      onOpenChange={() => {
        setOpenCreateProductsDialogue(false);
        setFormData(initialFormData);
        setCurrentEditedId(null);
      }}
    >
      <SheetContent side="right" className="overflow-auto p-3">
        <SheetHeader>
          <SheetTitle>
            {currentEditedId !== null ? "Edit Product" : "Add New Product"}
          </SheetTitle>
          <SheetDescription>
            Fill the form below to add a new product.
          </SheetDescription>
        </SheetHeader>

        <ProductImageUpload
          imageFile={imageFile}
          setImageFile={setImageFile}
          uploadedImageUrl={uploadedImageUrl}
          setUploadedImageUrl={setUploadedImageUrl}
          setImageLoadingState={setImageLoadingState}
          imageLoadingState={imageLoadingState}
          isEditMode={currentEditedId !== null}
        />

        <div className="py-6">
          <CommonForm
            onSubmit={onSubmit}
            formControls={addProductFormElements}
            formData={formData}
            setFormData={setFormData}
            buttonText={currentEditedId !== null ? "Edit" : "Add"}
            isBtnDisabled={!isFormValid()}
          />
        </div>
      </SheetContent>
    </Sheet>
  </Fragment>
);
};

export default AdminProducts;
