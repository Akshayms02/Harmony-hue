const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  address: [
    {
      name: String,
      house: String,
      state: String,
      country: String,
      city: String,
      pincode:Number,
      addressType:Number,
      
   }
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
