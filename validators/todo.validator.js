import Joi from "joi";
import mongoose from "mongoose";

// SubTodo Validation Schema
const subTodoJoiSchema = Joi.object({
  title: Joi.string().required(),
  isCompleted: Joi.boolean().default(false),
  status: Joi.string().valid("pending", "in-progress", "done"),
  dueDate: Joi.date(),
  notes: Joi.string().allow(""),
});

// Todo Validation Schema
const todoJoiSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(""),
  isCompleted: Joi.boolean().default(false),
  dueDate: Joi.date(),
  status: Joi.string().valid("pending", "in-progress", "done"),
  priority: Joi.string().valid("low", "medium", "high").default("medium"),
  subTodos: Joi.array().items(subTodoJoiSchema),
});

// Category Validation Schema
const categoryJoiSchema = Joi.object({
  name: Joi.string().required(),
  color: Joi.string()
    .pattern(/^#([0-9A-Fa-f]{3}){1,2}$/) // Hex color validation
    .default("#000000"),
  todos: Joi.array().items(todoJoiSchema),
});

// Main Todo List Validation Schema
export const todoMainJoiSchema = Joi.object({
  user: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .required(),
  categories: Joi.array().items(categoryJoiSchema),
});
