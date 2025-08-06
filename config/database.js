const mongoose = require('mongoose')

exports.connectDB = async ()=> {
    try{
        await mongoose.connect(process.env.DB_ONLINE_URI)
        console.log('connected to database')
    }
    catch (error) {
        console.log(error.message)
    }
}