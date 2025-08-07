const User = require('../models/user.model')
const jwt = require('jsonwebtoken');
const transporter = require('../config/email')

exports.verifyEmail = async(req,res) => {
    const {token} = req.query;
    if(!token) return res.status(400).json({message: "Token is required"})
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.id);
        if(!user) return res.status(404).json({message:"user not found"})
        
            user.isVerified = true;
            await user.save();

            res.status(200).json({message:"email verfied successfully. you can now login."})
    } catch (error) {
    console.error("JWT verification error:", error.message);
    return res.status(400).json({ message: "Invalid or expired token" });
}
}

exports.isVerified = async (req,res,next) => {
    if(!req.user.isVerified) {
        return res.status(403).json({message: "email verification is required"})
    }

    next()
}

exports.resendVerification = async (req,res) => {
    const {email} = req.body;

    try{
        const user = await User.findOne({email});
        if(!user) {
            return res.status(404).json({message : "user not found"})
        }

        if(user.isVerified){
            return res.status(400).json({message: "user is already verified"})
        }

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
            expiresIn: '1h'
        });

         const verificationLink = `http://localhost:${process.env.PORT}/api/v1/verify-email?token=${token}`
        
        //Sending In the verification link

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "verify your Email",
            html: `<p>Click <a href="${verificationLink}">here</a> to verify your email</p>`,
        });
        res.status(201).json({message: "Registration successful. check your email for verfication link"})
    }catch(error){
        res.status(500).json({message : error.message})
    }
}