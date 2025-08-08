import mongoose from 'mongoose';


const subTodoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    dueDate: { type: Date },
    notes: { type: String },
}, { timestamps: true });

const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    isCompleted: { type: Boolean, default: false },
    dueDate: { type: Date },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    subTodos: [subTodoSchema]
}, { timestamps: true });

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    color: { type: String, default: "#000000" }, // For UI tags
    todos: [todoSchema]
}, { timestamps: true });

const todoMainSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    categories: [categorySchema]
}, { timestamps: true });

module.exports = mongoose.model("TodoList", todoMainSchema);