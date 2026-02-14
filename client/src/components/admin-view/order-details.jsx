import React, { useState } from "react";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import CommonForm from "../common/form";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { getAllOrdersForAdmin, getOrderDetailsForAdmin, updateOrderStatus } from "@/store/admin/order-slice";
import {toast} from "sonner"
import { getAllDashboardData } from "@/store/admin/dashboard-slice";

const initialFormData = {
  status: "",
};

const AdminOrderDetailsView = ({ orderDetails }) => {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch()

  function handleUpdateStatus(e) {
    e.preventDefault();
    const {status} = formData
    dispatch(updateOrderStatus({id:orderDetails._id,orderStatus:status})).then((data)=>{
      if(data?.payload?.success){
        toast.success("Status Updated Successfully")
        dispatch(getOrderDetailsForAdmin(orderDetails?._id))
        dispatch(getAllOrdersForAdmin())
        dispatch(getAllDashboardData())
        setFormData(initialFormData)
      }
    })
    
  }
  
  return (
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex mt-8 items-center justify-between mt">
            <p className="font-medium">ID</p>
            <Label>{orderDetails?._id}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Date</p>
            <Label>{orderDetails?.orderDate?.split("T")[0]}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Price</p>
            <Label>${orderDetails?.totalAmount}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <Label>{orderDetails?.paymentId}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payer Id</p>
            <Label>{orderDetails?.payerId}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Status</p>
            <Label><Badge className={`${orderDetails?.orderStatus==="confirmed"?"bg-green-700":"bg-black"}`}>{orderDetails?.orderStatus}</Badge></Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              {orderDetails && orderDetails.cartItems?.length > 0
                ? orderDetails.cartItems.map((item) => {
                    return (
                      <li className="flex items-center justify-between">
                        <span>{item.title}</span>
                        <span>${item.price}</span>
                      </li>
                    );
                  })
                : null}
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">shipping info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>Name:{user?.userName}</span>
              <span>Address: {orderDetails?.addressInfo?.address}</span>
              <span>city: {orderDetails?.addressInfo?.city}</span>
              <span>pincode: {orderDetails?.addressInfo?.pincode}</span>
              <span>phone: {orderDetails?.addressInfo?.phone}</span>
              <span>Notes: {orderDetails?.addressInfo?.notes}</span>
            </div>
          </div>
        </div>
        <div>
          <CommonForm
            formControls={[
              {
                label: "Order Status",
                name: "status",
                componentType: "select",
                options: [
                  { id: "pending", label: "Pending" },
                  { id: "inProcess", label: "In Process" },
                  { id: "inShipping", label: "In Shipping" },
                  { id: "delivered", label: "Delivered" },
                  { id: "rejected", label: "Rejected" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText={"Update Order Status"}
            onSubmit={handleUpdateStatus}
          />
        </div>
      </div>
    </DialogContent>
  );
};

export default AdminOrderDetailsView;
