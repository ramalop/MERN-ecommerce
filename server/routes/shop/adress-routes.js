const express = require("express")
const { editAdress, addAdress, deleteAdress, fetchAllAdress } = require("../../controller/shop/adress-controller")

const router = express.Router()


router.post("/addAdress",addAdress)
router.get("/getAdress/:userId",fetchAllAdress)
router.put("/editAdress/:userId/:addressId",editAdress)
router.delete("/deleteAdress/:userId/:addressId",deleteAdress)

module.exports = router