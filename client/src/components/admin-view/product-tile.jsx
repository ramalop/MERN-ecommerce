
import React, { memo, useCallback } from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";

const AdminProductTile = ({
  product,
  setCurrentEditedId,
  setOpenCreateProductsDialogue,
  setFormData,
  handleDelete,
}) => {

  const handleEdit = useCallback(() => {
    setOpenCreateProductsDialogue(true);
    setCurrentEditedId(product?._id);
    setFormData(product);
  }, [product, setCurrentEditedId, setOpenCreateProductsDialogue, setFormData]);

  const onDelete = useCallback(() => {
    handleDelete(product?._id);
  }, [handleDelete, product]);

  return (
    <Card className="w-full max-w-sm mx-auto">
      <div className="relative">
        <img
          src={product?.image}
          alt={product?.title}
          className="w-full h-[300px] object-cover rounded-t-lg"
        />
      </div>

      <CardContent>
        <h2 className="text-xl font-bold mb-2 mt-2">
          {product?.title?.length > 20
            ? product.title.slice(0, 10) + "..."
            : product.title}
        </h2>

        <div className="flex justify-between items-center mb-2">
          <span
            className={`${product?.salePrice > 0 ? "line-through" : ""} text-lg font-semibold text-primary`}
          >
            ${product?.price}
          </span>

          {product?.salePrice > 0 && (
            <span className="text-lg font-bold">
              ${product?.salePrice}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button className="w-full sm:w-auto" onClick={handleEdit}>
          Edit
        </Button>

        <Button className="w-full sm:w-auto" onClick={onDelete}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default memo(AdminProductTile);

