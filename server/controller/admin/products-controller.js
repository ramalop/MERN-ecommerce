import { imageUploadUtil } from "../../helpers/cloudinary.js";
import Products from "../../models/Products.js";


//for uploading a product
export const handleImageUpload = async (req, res) => {
    try {
        const b64 = Buffer.from(req.file.buffer).toString("base64")
        const url = "data:" + req.file.mimetype + ";base64," + b64
        const result = await imageUploadUtil(url)
        res.json({
            success: true,
            result
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "error occured"
        })

    }
}

//add a new product
export const addProduct = async (req, res) => {
    try {
        const { image, title, description, category, brand, salePrice, price, totalStock } = req.body
        const newlyCreatedProduct = new Products({
            image, title, description, category, brand, salePrice, price, totalStock
        })
        await newlyCreatedProduct.save()
        res.status(201).json({
            success: true,
            data: newlyCreatedProduct
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error Occured"
        })
    }
}

//fetch all products
export const fetchAllProducts = async (req, res) => {
    try {
        const listOfProducts = await Products.find({})
        res.status(200).json({
            success: true,
            data: listOfProducts
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error Occured"
        })
    }
}

//edit a product
export const editProduct = async (req, res) => {
    try {
        const { id } = req.params
        const { image, title, description, category, brand, price, salePrice, totalStock } = req.body
        let findProduct = await Products.findById(id)
        if (!findProduct) return res.status(404).json({
            success: false,
            message: "product not found"
        })

        findProduct.title = title || findProduct.title
        findProduct.description = description || findProduct.description
        findProduct.category = category || findProduct.category
        findProduct.brand = brand || findProduct.brand
        findProduct.price = price == '' ? 0 : price || findProduct.price
        findProduct.salePrice = salePrice == '' ? 0 : salePrice || findProduct.salePrice
        findProduct.totalStock = totalStock || findProduct.totalStock
        findProduct.image = image || findProduct.image

        await findProduct.save()
        res.status(200).json({
            success: true,
            findProduct
        })



    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error Occured"
        })
    }
}


//delete a product
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params
        const findProduct = await Products.findByIdAndDelete(id)
        if (!findProduct) return res.status(404).json({
            success: false,
            message: "Product not found"
        })
        res.status(200).json({
            success: true,
            message: "Product Deleted Successfully"
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error Occured"
        })
    }
}