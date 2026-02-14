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
  const { productList } = useSelector((state) => state.adminProducts);

  console.log(formData , "formdata")

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
      console.log(data,"edit")
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
      console.log(data);
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
    console.log(getCurrentProductId);
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

  console.log(productList, "productList");
  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialogue(true)}>
          Add new product
        </Button>
      </div>
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-2">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProductTile
                setCurrentEditedId={setCurrentEditedId}
                setOpenCreateProductsDialogue = {setOpenCreateProductsDialogue}
                setFormData = {setFormData}
                product={productItem}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div>
      <Sheet
        open={openCreateProductsDialogue}
        onOpenChange={() => {setOpenCreateProductsDialogue(false)
          setFormData(initialFormData)
          setCurrentEditedId(null)
        }
        }
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>{currentEditedId !==null?"Edit Product":"Add New Product"}</SheetTitle>
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
            isEditMode={currentEditedId!==null}
          />
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formControls={addProductFormElements}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !==null?"Edit":"Add"}
              isBtnDisabled={!isFormValid()}
            ></CommonForm>
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
};

export default AdminProducts;
