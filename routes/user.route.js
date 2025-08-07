const express = require('express')
const {
    registerUser,
    loginUser,
    userProfile,
    logOut,
}= require('../controllers/user.controller')
const { isAuthenticated } = require('../middleware/auth')
const {isVerified,verifyEmail,resendVerification} = require('../controllers/auth.contoller')

const router = express.Router()

router.post('/register', registerUser)
router.post('/login',loginUser)
router.get('/me',isAuthenticated,isVerified,userProfile)
router.post('/logout', isAuthenticated, logOut)
router.get('/verify-email',verifyEmail)
router.get('/resend-verification',resendVerification)

module.exports = router

