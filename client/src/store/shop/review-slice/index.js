import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading:false,
    reviews:[]
}
export const getAllReviews = createAsyncThunk("/shop/review",async(productId)=>{
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/review/getReviews/${productId}`)
    return response.data
})
export const addReview = createAsyncThunk("/shop/addReview",async(data)=>{
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/review/addReview`,data)
    return response.data
})
const reviewProductSlice = createSlice({
    name:"reviewProductSlice",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(getAllReviews.pending,(state)=>{
            state.isLoading= true
        }).addCase(getAllReviews.fulfilled,(state,action)=>{
            state.isLoading= false,
            state.reviews = action.payload.data
        }).addCase(getAllReviews.rejected,(state,action)=>{
            state.isLoading= false,
            state.reviews = []
        })
    }

})
export default reviewProductSlice.reducer