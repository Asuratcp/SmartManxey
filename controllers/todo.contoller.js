const TodoList = require('../models/todo.model')
const validations = require('../validators/todo.validator')

exports.addCategory = async (req,res) =>{
    try {
        const {err} = await validations.todoMainJoiSchema(req.body)
        if(err) return res.status(400).json({message: err.message})
        const categoryExist = await TodoList.findOne({category:req.title})
        if(categoryExist) return res.status(400).json({message:err.message})
        const {title,}
    }
}