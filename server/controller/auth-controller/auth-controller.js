const bcrypt = require('bcryptjs')
const User = require('../../models/User')
const jwt = require("jsonwebtoken");



//Register
const registerUser = async (req, res) => {
    const { userName, email, password } = req.body
    try {
        const checkUser = await User.findOne({ email })
        if (checkUser) return res.json({
            success: false,
            message: "User already exist with this email"
        })
        const hashPassword = await bcrypt.hash(password, 12)
        const newUser = new User({
            userName,
            email,
            password: hashPassword
        })
        await newUser.save()
        res.status(200).json({
            success: true,
            message: "registration successfull"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "some error occured"
        })
    }
}





//Login  

const loginUser = async (req, res) => {
    const { email, password } = req.body
    try {
        const checkUser = await User.findOne({ email })
        if (!checkUser) return res.json({
            success: false,
            message: "No user found with this Email. Please Sign Up"
        })
        const checkPasswordMatch = await bcrypt.compare(password, checkUser.password)
        if (!checkPasswordMatch) {
            return res.json({
                success: false,
                message: "Incorrect Password ! Please Try Again"
            })
        }
        const token = jwt.sign(
            { id: checkUser._id, role: checkUser.role, email: checkUser.email, userName: checkUser.userName }, "CLIENT_SECRET_KEY", { expiresIn: "60m" })
        res.cookie("token", token, { httpOnly: true, secure: true }).json({
            success: true,
            message: "Logged in successfully",
            user: {
                email: checkUser.email,
                role: checkUser.role,
                id: checkUser._id,
                userName: checkUser.userName
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "some error occured"
        })

    }

}






//Logout
const logoutUser = async (req, res) => {
    res.clearCookie("token").json({
        success: true,
        message: "Logged out successfully"
    })
}





//Auth middleware

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({
        success: false,
        message: "User unauthorised"
    })
    try {
        const decoded = jwt.verify(token, "CLIENT_SECRET_KEY")
        req.user = decoded
        next()
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "User unauthorised"
        })
    }
}

module.exports = { registerUser, loginUser, logoutUser, authMiddleware }