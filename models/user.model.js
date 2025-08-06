const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    name: {
      type: String,
      required: [true, 'Please provide your name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide a valid email'],
      unique: true, // ✅ ensure no duplicate emails
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      select: false, // don't return password by default
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'author', 'contributor'], // ✅ fixed spelling of "contributor"
        message: 'Please select a valid role',
      },
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    _id: false, // disable ObjectId auto-generation, since you're using UUID
  }
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.jwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

const User = model('User', userSchema);

module.exports = User;
