import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading:false,
    userList:[]
}
export const getAllUsers = createAsyncThunk("/admin/getAllUsers",async()=>{
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/dashboard/users`)
    return response.data
})

const adminUserSlice = createSlice({
    name:"adminUserSlice",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(getAllUsers.pending,(state)=>{
            state.isLoading=true
        }).addCase(getAllUsers.fulfilled,(state,action)=>{
            state.isLoading=false
            state.userList = action.payload.data
        }).addCase(getAllUsers.rejected,(state)=>{
            state.isLoading=false
        })
    }
})
export default adminUserSlice.reducer