const express = require("express")
const { getAllUsers, getRecentData } = require("../../controller/admin/get-all-data")

const router = express.Router()

router.get("/users",getAllUsers)

router.get("/recent",getRecentData)






module.exports = router