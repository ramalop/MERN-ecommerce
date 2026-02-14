import React, { useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {  getOrderDetailsForAdmin, resetOrderDetails } from "@/store/admin/order-slice";
import { Badge } from '../ui/badge';
import { Dialog } from '../ui/dialog';
import AdminOrderDetailsView from './order-details';
import { Button } from '../ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { Separator } from '../ui/separator';

const RecentOrdersForAdmin = ({recentOrders}) => {
   const [openDetailsDialogue,setOpenDetailsDialogue] = useState(false) 
   const {orderDetails} = useSelector(state=>state.adminOrder)
   
   const dispatch = useDispatch()
    function handleFetchOrderDetails(getId){
        
       dispatch(getOrderDetailsForAdmin(getId)).then((data)=>{
        setOpenDetailsDialogue(true)
       })
       
     }
     
  return (
    <Card className="w-full p-4">
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <Table className="w-full min-w-[700px]">
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
            {recentOrders && recentOrders.length > 0
              ? recentOrders.map((singleOrder) => {
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

        </div>
        
      </CardContent>
      <div className="flex justify-center w-full">
        <Button >View All Orders</Button>
      </div>
      
      
    </Card>
  )
}

export default RecentOrdersForAdmin
