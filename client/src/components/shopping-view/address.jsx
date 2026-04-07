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
import { Skeleton } from "../ui/skeleton";

const initialAdressFormData = {
  address: "",
  city: "",
  pincode: "",
  phone: "",
  notes: "",
};

const Address = ({setCurrentSelectedAddress,selectedId}) => {
  const [formData, setFormData] = useState(initialAdressFormData);
  const [loadingId, setLoadingId] = useState(null);
  const [loading , setLoading] = useState(false)
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const { addressList,isLoading } = useSelector((state) => state.shopAddress);
  const dispatch = useDispatch();
  function handleManageAddress(e) {
  e.preventDefault();

  if (currentEditedId !== null) {
    setLoading(true)
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
    }).finally(()=>{
      setLoading(false)
    });

  } else {
    
    if (addressList.length >= 3) {
      toast.error("You can add maximum of three addresses");
      return;
    }
    setLoading(true)
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
    }).finally(()=>{
      setLoading(false)
    });
  }
}

  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key].trim() !== "")
      .every((item) => item);
  }
  function handleDeleteAddress(getCurrentAddress) {

    setLoadingId(getCurrentAddress._id)
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
    }).finally(()=>{
      setLoadingId(null)
    });
    
  }

  function handleEditAddress(e,getCurrentAdress) {
    e.stopPropagation()
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
  
  

  return (
    <>
    {isLoading && <Skeleton/>}
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 min-h-[120px] gap-2 cursor-pointer">
        {addressList.length===0 && <p>No Address added , please fill the below form to add a new address</p>}
        {addressList && addressList.length > 0
          ? addressList.map((singleAddressItem) => (
              <AddressCard
                key={singleAddressItem._id}
                selectedId={selectedId}
                addressInfo={singleAddressItem}
                handleDeleteAddress={handleDeleteAddress}
                handleEditAddress={handleEditAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
                loading={loadingId === singleAddressItem._id}
              />
            ))
          : null}
      </div>
      <CardHeader>{currentEditedId?"Edit Address":"Add New Address"}</CardHeader>
      <CardContent className="space-y-3">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleManageAddress}
          buttonText={currentEditedId?"Edit":"Add"}
          isBtnDisabled={!isFormValid()}
          loading={loading} 
        />
      </CardContent>
    </Card>
    </>
  );
};

export default Address;
