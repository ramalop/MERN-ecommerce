require("dotenv").config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require("cors")
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/auth/auth-routes")
const adminProductRouters = require("./routes/admin/products-routes")
const adminOrderRouter = require("./routes/admin/order-routes")
const adminDashboardRouter = require("./routes/admin/get-all-data")
const shopProductRouter = require ("./routes/shop/products-routes")
const shopCartRouter = require ("./routes/shop/cart-routes")
const shopAdressRouter = require("./routes/shop/adress-routes")
const shopOrderRouter = require("./routes/shop/order-routes")
const shopSearchRouter = require("./routes/shop/search-routes")
const shopReviewRouter = require("./routes/shop/review-routes")





//connect to database
mongoose.connect(process.env.MONGO_URL).then(() => console.log("mongodb connected successfully")).catch((error) => console.log(error))

const app = express()
const PORT = process.env.PORT || 5000;
//cors setup
app.use(cors({
    origin: process.env.CLIENT_BASE_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control", "Expires", "Pragma"],
    credentials: true
}))

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouter)
app.use("/api/admin/products",adminProductRouters)
app.use("/api/admin/products",adminProductRouters)
app.use("/api/admin/orders",adminOrderRouter)
app.use("/api/admin/dashboard",adminDashboardRouter)

app.use("/api/shop/products",shopProductRouter)
app.use("/api/shop/cart",shopCartRouter)
app.use("/api/shop/adress",shopAdressRouter)
app.use("/api/shop/order",shopOrderRouter)
app.use("/api/shop/search",shopSearchRouter)
app.use("/api/shop/review",shopReviewRouter)
//run the port
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))