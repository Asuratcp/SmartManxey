import mongoose from 'mongoose';

const {model,Schema} = mongoose; 


const subTodoSchema = new Schema({
    title: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
     status:{type:String,enum:['pending','in-progress','done']},
    dueDate: { type: Date },
    notes: { type: String },
}, { timestamps: true });

const todoSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    isCompleted: { type: Boolean, default: false },
    dueDate: { type: Date },
    status:{type:String,enum:['pending','in-progress','done']},
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    subTodos: [subTodoSchema]
}, { timestamps: true });

const categorySchema = new Schema({
    name: { type: String, required: true },
    color: { type: String, default: "#000000" }, // For UI tags
    todos: [todoSchema]
}, { timestamps: true });

const todoMainSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    categories: [categorySchema]
}, { timestamps: true });

const TodoList = model("TodoList", todoMainSchema);

module.exports = TodoList;