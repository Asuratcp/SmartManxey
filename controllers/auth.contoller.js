const User = require('../models/user.model')

exports.verifyEmail = async(req,res) => {
    const {token} = req.query;
    if(!token) return res.status(400).json({message: "Token is required"})
    
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByID(decoded.id);
        if(!user) res.status(404).json({message:"user not found"})
        
            user.isVerfied = true;
            await user.save();

            res.status(200).json({message:"email verfied successfully. you can now login."})
    } catch (error) {
        res.status(400).json({message: "invalid or expored token"})
    }
}

exports.isVerfied = async (req,res,next) => {
    if(!req.user.isVerfied) {
        return res.status(403).json({message: "email verification is required"})
    }

    next()
}