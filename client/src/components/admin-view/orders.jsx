import React, { useEffect, useState, useCallback } from "react";
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
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";

const AdminOrdersView = () => {
  const [openDetailsDialogue, setOpenDetailsDialogue] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const { orderList, orderDetails, isLoading } = useSelector(
    (state) => state.adminOrder
  );

  const dispatch = useDispatch();

  const handleFetchOrderDetails = useCallback(
    (id) => {
      setSelectedOrderId(id);
      dispatch(getOrderDetailsForAdmin(id));
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  // Open dialog when data arrives
  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialogue(true);
  }, [orderDetails]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4, 5,6,7,8,9,10,11].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-10 w-[200px]" />
                <Skeleton className="h-10 w-[150px]" />
                <Skeleton className="h-10 w-[120px]" />
                <Skeleton className="h-10 w-[100px]" />
                <Skeleton className="h-10 w-[80px]" />
              </div>
            ))}
          </div>
        ) : (
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
              {orderList?.length > 0 ? (
                orderList.map((singleOrder) => (
                  <TableRow key={singleOrder?._id}>
                    <TableCell>{singleOrder?._id}</TableCell>

                    <TableCell>
                      {singleOrder?.orderDate.split("T")[0]}
                    </TableCell>

                    <TableCell>
                      <Badge
                        className={
                          singleOrder?.orderStatus === "confirmed"
                            ? "bg-green-700"
                            : "bg-black"
                        }
                      >
                        {singleOrder?.orderStatus}
                      </Badge>
                    </TableCell>

                    <TableCell>{singleOrder?.totalAmount}</TableCell>

                    <TableCell>
                      <Button
                        onClick={() =>
                          handleFetchOrderDetails(singleOrder?._id)
                        }
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}

        
        <Dialog
          open={openDetailsDialogue}
          onOpenChange={() => {
            setOpenDetailsDialogue(false);
            setSelectedOrderId(null);
            dispatch(resetOrderDetails());
          }}
        >
          <AdminOrderDetailsView orderDetails={orderDetails} />
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AdminOrdersView;