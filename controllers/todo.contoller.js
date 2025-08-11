const TodoList = require('../models/todo.model')

const {} = require("../validators/todo.validator")

exports.addCategory = async(req,res) => {
    try{
        const{err} = await categoryJoiSchema(req.body)
        if(err) res.status(400).json({message: err.message})
        const categoryExist = await TodoList.find({category:req.body.title})
    }
}