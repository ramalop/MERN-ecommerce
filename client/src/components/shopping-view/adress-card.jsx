import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

const AddressCard = ({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) => {
  console.log(selectedId, addressInfo._id);

  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`cursor-pointer [&_*]:cursor-pointer ${selectedId == addressInfo._id ? "border-red-500 border-[3px]" : "border-black"}`}
    >
      <CardContent className={`grid p-4 gap-4`}>
        <Label>Adress: {addressInfo?.address}</Label>
        <Label>city : {addressInfo?.city}</Label>
        <Label>pincode : {addressInfo?.pincode}</Label>
        <Label>Phone number : {addressInfo?.phone}</Label>
        <Label>Notes : {addressInfo?.notes}</Label>
      </CardContent>
      <CardFooter className="flex p-3 justify-between">
        <Button
          onClick={() => {
           
            handleEditAddress(addressInfo);
          }}
        >
          Edit
        </Button>
        <Button
          onClick={() => {
            
            handleDeleteAddress(addressInfo);
          }}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AddressCard;
