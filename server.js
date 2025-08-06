const express = require('express')
const {connectDB} = require('./config/database')
const dotenv = require('dotenv').config()
const cookieParser = require('cookie-parser')
const PORT = process.env.PORT

//Instantiating the mongodb database 
connectDB()

// Instantitingh the express application 

const server = express()

server.get('/',(req,res)=>{
    return res.json({
        message:'this is the Home page'
    })
})

const user= require('./routes/user.route')
// Express middleare 

server.use(express.json()) //used in passing application/json data
server.use(express.urlencoded({extended: true})) //Useed in passing form
server.use(cookieParser()) //Used in setting the cookie parser 

//routes for API

server.use('/api/v1', user)
// Creating the server 
server.listen(PORT, ()=> console.log('server is running on port' + PORT))