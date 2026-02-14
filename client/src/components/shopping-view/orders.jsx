import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import ShopingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrders,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";

const ShopOrders = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);
  const [openDetailsDialogue, setOpenDetailsDialogue] = useState(false);

  function handleFetchOrderDetails(orderId) {
    dispatch(getOrderDetails(orderId));
  }
  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialogue(true);
  }, [orderDetails]);
  console.log(orderDetails, "OrderDetails");

  useEffect(() => {
    dispatch(getAllOrders(user?.id));
  }, [dispatch]);
  console.log(orderList);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
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
                          <ShopingOrderDetailsView
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

export default ShopOrders;
