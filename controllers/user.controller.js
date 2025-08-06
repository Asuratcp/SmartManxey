const User = require('../models/user.model')
const {
    validateUserSignup,
    validateUserLogin,
} = require('../validators/user.validator')

// exports.createUser = async (req, res) => {
//     try {
//         const { err } = await validateUserSignup(req.body)
//         if (err) return res.status(400).json({ message: err.message })
//         const userExist = await User.findOne({ email: req.body.email })
//         if (userExist) return res.status(400).json({ message: 'user exist' })
//         const { name, email, password, role } = req.body
//         const user = await User.create({ name, email, password, role })
//         if (!user) return res.status(400).json({ message: 'cannot create user' })


//         const token = await user.jwtToken()

//         const options = {
//             expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
//             httpOnly: true,
//         }
        
//         return res.status(200).cookie('token', token, options).json({
//             message: 'signup successfull',
//             token,
//         });
//     } catch (error) {
//         console.log('unable to create a user', error.message)
//         return res.status(500).json({ message: error.message })

//     }
// }

exports.registerUser = async (req,res) => {
    try {
        const {err} = await validateUserSignup(req.body)
        if(err) return res.status(400).json({message: err.message})
        const userExist = await User.findOne({email:req.body.email})
        if (userExist) return res.status(400).json({message:'user exist'})
        const{name, email, password,role,isVerified} = req.body
        const user = User.create({name, email, password,role,isVerified})
        if(!user) return res.status(400).json({message:'cannot create user'})
        
        const token = await user.jwtToken()

        const options = {
            expires : new Date(Date.now()+3*24*60*60*1000),
            httpOnly : true,
        }

        const verificationLink = `http://localhost:${process.env.PORT}/verify-email?token=${token}`
        
        //Sending In the verification link

        await transporter.sendMail({
            form: process.env.EMAIL_USER,
            to: user.email,
            subject: "verify your Email",
            html: `<p>Click <a href="${verificationLink}">here</a> to verify your email</p>`
        })
        res.status(201).json({message: "Registration successful. check your email for verfication link"})
    }catch(error){
        res.status(500).json({message : error.message})
    }
}


exports.loginUser = async (req, res) => {
    try {
        const { err } = await validateUserLogin(req.body)
        if (err) return res.status(400).json({ message: err.message })

        const user = await User.findOne({ email: req.body.email }).select(
            '+password'
        )

        const isMatched = await user.comparePassword(req.body.password)
        if (!isMatched)
            return res.status(400).json({ message: 'incorrect password or email' })

        
        if (!user.isVerified) {
  return res.status(403).json({ message: "Please verify your email first" });
}
        const token = await user.jwtToken()

        const options = {
            httpOnly: true,
        }
        return res.status(200).cookie('token', token, options).json({
            message: 'Login Successful',
            token,
        })
    } catch (error) {
        console.log(error.message)
    }
}

exports.userProfile = async (req, res, next) => {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(200).json({ message: 'User not found' })
    return res.status(200).json({ message: 'successfully', data: user })
}

exports.logOut = async (req, res) => {
    try {
        res.cookie('token', 'none', {
            expires: new Date(Date.now() + 1 * 1000),
        })
        return res
            .status(200)
            .json({ success: true, message: 'user is logout successfully' })
    } catch (error) {
        console.log(error.message)
    }
}