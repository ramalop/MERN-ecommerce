import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/auth-slice"
import adminProductSlice from "./admin/product-slice"
import adminOrderSlice from "./admin/order-slice"
import adminUserSlice from "./admin/user-slice"
import adminDashboardSlice from "./admin/dashboard-slice"
import shopProductSlice from "./shop/product-slice"
import shopCartSlice from "./shop/cart-slice"
import shopAdressSlice from "./shop/adress-slice"
import shopOrderSlice from "./shop/order-slice"
import shopSearchSlice from "./shop/search-slice"
import shopReviewchSlice from "./shop/review-slice"


const store = configureStore({
    reducer: {
        auth: authReducer,
        adminProducts: adminProductSlice,
        adminUsers:adminUserSlice,
        adminRecentData:adminDashboardSlice,
        shopProducts: shopProductSlice,
        shopCart: shopCartSlice,
        shopAddress: shopAdressSlice,
        shopOrder:shopOrderSlice,
        adminOrder:adminOrderSlice,
        shopSearch:shopSearchSlice,
        shopReview:shopReviewchSlice
    }

})

export default store;