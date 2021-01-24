const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  email: {
    type: String,
    unique: true,
    minlength: 3,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
    trim: true,
  },
  created: {
    type: mongoose.Schema({
      by: {
        type: String,
      },
      at: {
        type: Date,
      },
      userId: {
        type: String,
      },
    }, { _id: false }),
    default: null,
  },
  updated: {
    type: mongoose.Schema({
      by: {
        type: String,
      },
      at: {
        type: Date,
      },
      userId: {
        type: String,
      },
    }, { _id: false }),
    default: null,
  },
  meta: mongoose.Schema.Types.Mixed,
}, { timestamps: false });

userSchema.plugin(uniqueValidator, { message: '{PATH} is already exists.' });

// Global Static function
Object.assign(userSchema.statics, require('../../libraries/mongoose/statics'));

// Custom Static function
Object.assign(userSchema.statics, require('./mongoose/customStatics'));

const User = mongoose.model('User', userSchema);
module.exports = User;
