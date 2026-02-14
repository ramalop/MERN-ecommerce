import React from "react";
import AdminProductTile from "./product-tile";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useNavigate } from "react-router-dom";

const LowStockProductsForAdmin = ({
  products,
  setCurrentEditedId,
  setOpenCreateProductsDialogue,
  setFormData,
  handleDelete,
}) => {
  if (!products.length) {
    return <p className="text-muted-foreground">No low stock products</p>;
  }
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Low Stock Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <AdminProductTile
            key={product._id}
            product={product}
            setCurrentEditedId={setCurrentEditedId}
            setOpenCreateProductsDialogue={setOpenCreateProductsDialogue}
            setFormData={setFormData}
            handleDelete={handleDelete}
          />
        ))}
      </div>
      <div className="flex justify-center">
        <Button onClick={() => navigate("/admin/products")}>
          View all Products
        </Button>
      </div>
    </div>
  );
};

export default LowStockProductsForAdmin;
