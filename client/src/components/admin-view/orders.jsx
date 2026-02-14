import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersForAdmin, getOrderDetailsForAdmin, resetOrderDetails } from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";

const AdminOrdersView = () => {
  const [openDetailsDialogue,setOpenDetailsDialogue] = useState(false)
  const {orderList,orderDetails} = useSelector(state=>state.adminOrder)
  const dispatch = useDispatch()

  function handleFetchOrderDetails(getId){
    dispatch(getOrderDetailsForAdmin(getId))
  }
  

  useEffect(()=>{
    dispatch(getAllOrdersForAdmin())
  },[dispatch])

  //to open the dialogue of view order details
  useEffect(()=>{
    if(orderDetails !==null) setOpenDetailsDialogue(true)
  },[orderDetails])
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Id</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only"></span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0
              ? orderList.map((singleOrder) => {
                  return (
                    <TableRow key={singleOrder?._id}>
                      <TableCell>{singleOrder?._id}</TableCell>
                      <TableCell>
                        {singleOrder?.orderDate.split("T")[0]}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${singleOrder?.orderStatus === "confirmed" ? "bg-green-700" : "bg-black"}`}
                        >
                          {singleOrder?.orderStatus}
                        </Badge>
                      </TableCell>

                      <TableCell>{singleOrder?.totalAmount}</TableCell>
                      <TableCell>
                        <Dialog
                          open={openDetailsDialogue}
                          onOpenChange={() => {
                            setOpenDetailsDialogue(false);
                            dispatch(resetOrderDetails());
                          }}
                        >
                          <Button
                            onClick={() =>
                              handleFetchOrderDetails(singleOrder?._id)
                            }
                          >
                            View Details
                          </Button>
                          <AdminOrderDetailsView
                            orderDetails={orderDetails}
                          />
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })
              : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AdminOrdersView;
