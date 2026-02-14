import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"



const initialState = {
    isLoading: false,
    addressList: []
}
export const addNewAdress = createAsyncThunk('/adresses/addAdress', async (formData) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/adress/addAdress`, formData)
    return response.data
})
export const fetchAllAddresses = createAsyncThunk('/adresses/fetchAllAddresses', async (userId) => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/adress/getAdress/${userId}`, {})
    return response.data
})
export const editAdresses = createAsyncThunk('/adresses/editAdresses', async ({ userId, adressId, formData }) => {
    const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/shop/adress/editAdress/${userId}/${adressId}`, { formData })
    return response.data
})
export const deleteAdress = createAsyncThunk('/adresses/deleteAdress', async ({ userId, addressId }) => {
    const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/shop/adress/deleteAdress/${userId}/${addressId}`, {})
    return response.data
})

const adressSlice = createSlice({
    name: "adress",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addNewAdress.pending, (state) => {
            state.isLoading = true
        }).addCase(addNewAdress.fulfilled, (state, action) => {
            state.isLoading = false;
        }).addCase(addNewAdress.rejected, (state) => {
            state.isLoading = false

        }).addCase(fetchAllAddresses.pending, (state) => {
            state.isLoading = true
        }).addCase(fetchAllAddresses.fulfilled, (state, action) => {
            state.isLoading = false;
            state.addressList = action?.payload?.data
        }).addCase(fetchAllAddresses.rejected, (state) => {
            state.isLoading = false,
                state.addressList = []
        })
    }
})

export default adressSlice.reducer