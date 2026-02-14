import React, { useEffect, useRef } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

const ProductImageUpload = ({
  imageFile,
  setImageFile,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  imageLoadingState,
  isEditMode
}) => {
  const inputRef = useRef(null);
  function handleImageFileChange(e) {
    console.log(e.target.files);
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setImageFile(selectedFile);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }
  function handleDrop(e) {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(droppedFile);
  }
  function handleRemoveImage(e) {
    setImageFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  const uploadImageToCloudinary = async ()=>{
    setImageLoadingState(true)
    const data = new FormData()
    data.append("my_products",imageFile)
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/products/upload-image`,data)
    console.log(response.data);
    
    if(response?.data?.success){
        setUploadedImageUrl(response.data.result.url)
        setImageLoadingState(false)
    }
  }

  useEffect(()=>{
    if(imageFile !== null){
        uploadImageToCloudinary()
    }
  },[imageFile])
  return (
    
    <div className="w-full max-w-md mx-auto mt-4">
      <Label className="text-large font-semibold mb-2 block">
        Upload Image
      </Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${isEditMode?"opacity-60":""} border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id="image-upload"
          className="hidden"
          type="file"
          ref={inputRef}
          onChange={handleImageFileChange}
          disable = {isEditMode}
        />
        {!imageFile ? (
          <Label
            htmlFor="image-upload"
            className={`${isEditMode?"cursor-not-allowed":""}flex flex-col items-center justify-center h-32 cursor-pointer`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag and Drop or click to upload image</span>
          </Label>
        ) : (
          imageLoadingState?
          <Skeleton className="h-10 bg-gray-100"/>:
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileIcon className="w-7 h-7 text-primary mr-2" />
            </div>
            <p className="text-sm font-medium">{imageFile.name}</p>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleRemoveImage}
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImageUpload;
