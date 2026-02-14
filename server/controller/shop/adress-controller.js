const Adress = require("../../models/Adress")

const addAdress = async(req,res)=>{
    try {
        const {userId,address,city,pincode,phone,notes} = req.body
        if(!userId || !address || !city || !pincode || !phone || !notes){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        const newAdress = new Adress({userId,address,city,pincode,phone,notes})
        await newAdress.save()
        return res.status(201).json({
            success:true,
            data:newAdress
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Some error occurred"
        })
        
    }
}
const fetchAllAdress = async(req,res)=>{
    try {
        const{userId} = req.params
        if(!userId){
           return res.status(400).json({
                success:false,
                message:"User Id is required"
            }) 
        }
        const addressList = await Adress.find({userId})
        return res.status(200).json({
            success:true,
            data:addressList
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Some error occurred"
        })
        
    }
}
const editAdress = async(req,res)=>{
    try {
        const {userId,addressId} = req.params
        const {formData} = req.body
        if(!userId || !addressId){
            return res.status(400).json({
                success:false,
                message:"userId and adressId is required"
            })
        }
        const adressToBeEdited = await Adress.findOneAndUpdate({_id:addressId,userId},formData,{new:true})
        if(!adressToBeEdited){
            return res.status(404).json({
                success:false,
                message:"Adress not found"
            })
        }
        res.status(200).json({
            success:true,
            data:adressToBeEdited,
            message:"Adress edited successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Some error occurred"
        })
        
    }
}
const deleteAdress = async(req,res)=>{
    try {
        const {userId,addressId} = req.params
        if(!userId || !addressId){
            return res.status(400).json({
                success:false,
                message:"userId and addressId is required"
            })
        }
        const adressToBeDeleted = await Adress.findOneAndDelete({_id:addressId,userId})
        if(!adressToBeDeleted){
             return res.status(404).json({
                success:false,
                message:"Adress not found"
            })
        }
        res.status(200).json({
            success:true,
            message:"Adress deleted successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Some error occurred"
        })
        
    }
}
module.exports = {addAdress,editAdress,fetchAllAdress,deleteAdress}