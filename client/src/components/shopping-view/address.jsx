import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import CommonForm from "../common/form";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {toast} from "sonner"
import {
  addNewAdress,
  deleteAdress,
  editAdresses,
  fetchAllAddresses,
} from "@/store/shop/adress-slice";
import AddressCard from "./adress-card";

const initialAdressFormData = {
  address: "",
  city: "",
  pincode: "",
  phone: "",
  notes: "",
};

const Address = ({setCurrentSelectedAddress,selectedId}) => {
  const [formData, setFormData] = useState(initialAdressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const dispatch = useDispatch();
  function handleManageAddress(e) {
  e.preventDefault();

  if (currentEditedId !== null) {
    dispatch(
      editAdresses({
        userId: user?.id,
        adressId: currentEditedId,
        formData,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast.success("Address Edited Successfully");
        dispatch(fetchAllAddresses(user?.id));
        setCurrentEditedId(null);
        setFormData(initialAdressFormData);
      }
    });

  } else {
    
    if (addressList.length >= 3) {
      toast.error("You can add maximum of three addresses");
      return;
    }

    dispatch(
      addNewAdress({
        ...formData,
        userId: user?.id,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast.success("Address Added Successfully");
        dispatch(fetchAllAddresses(user?.id));
        setFormData(initialAdressFormData);
      }
    });
  }
}

  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key].trim() !== "")
      .every((item) => item);
  }
  function handleDeleteAddress(getCurrentAddress) {
    console.log(user.Id, getCurrentAddress);

    dispatch(
      deleteAdress({
        userId: getCurrentAddress.userId,
        addressId: getCurrentAddress._id,
      }),
    ).then((data) => {
      if (data?.payload?.success) {
        toast.success("Address deleted successfully")
        dispatch(fetchAllAddresses(getCurrentAddress?.userId));
      }
    });
  }

  function handleEditAddress(e,getCurrentAdress) {
    e.stopPagation()
    setCurrentEditedId(getCurrentAdress._id);
    setFormData({
      address: getCurrentAdress.address,
      city: getCurrentAdress.city,
      pincode: getCurrentAdress.pincode,
      phone: getCurrentAdress.phone,
      notes: getCurrentAdress.notes,
    });
  }
  useEffect(() => {
    dispatch(fetchAllAddresses(user?.id));
  }, [dispatch]);
  console.log(user);
  console.log(addressList);
  
  

  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2  gap-2 cursor-pointer">
        {addressList && addressList.length > 0
          ? addressList.map((singleAddressItem) => (
              <AddressCard
                key={singleAddressItem._id}
                selectedId={selectedId}
                addressInfo={singleAddressItem}
                handleDeleteAddress={handleDeleteAddress}
                handleEditAddress={handleEditAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            ))
          : null}
      </div>
      <CardHeader>{currentEditedId?"Edit Address":"Add New Adress"}</CardHeader>
      <CardContent className="space-y-3">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleManageAddress}
          buttonText={currentEditedId?"Edit":"Add"}
          isBtnDisabled={!isFormValid()}
        />
      </CardContent>
    </Card>
  );
};

export default Address;
