import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading: false,
    recentOrders: [],
    recentDeliveredOrders: [],
    recentUsers: [],
    recentProducts: [],
    lowStockProducts: []
}
export const getAllDashboardData = createAsyncThunk("/admin/getAllDashboardData",async()=>{
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/dashboard/recent`)
    return response.data
})


const adminDashboardSlice = createSlice({
    name: "adminDashboardSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllDashboardData.pending,(state)=>{
            state.isLoading=true
        }).addCase(getAllDashboardData.fulfilled,(state,action)=>{
            state.isLoading=false
            state.recentOrders = action.payload.data.recentOrders
            state.recentDeliveredOrders = action.payload.data.recentDeliveredOrders
            state.recentUsers = action.payload.data.recentUsers
            state.recentProducts = action.payload.data.recentProducts
            state.lowStockProducts = action.payload.data.lowStockProducts
        }).addCase(getAllDashboardData.rejected,(state)=>{
            state.isLoading=false
        })
    }
})
export default adminDashboardSlice.reducer