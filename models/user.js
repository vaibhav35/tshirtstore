const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    maxlength: [30, "Name should be less than 30 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide a email id"],
    validate: [validator.isEmail, "Email entered in wrong format"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "password should be a minimum of 6 characters"],
    select: false,
  },
  role: {
    type: String,
    default: "user",
  },
  photo: {
    id: {
      type: String,
      required: true,
    },
    secure_url: {
      type: String,
      required: true,
    },
  },
  forgotPasswordToken: {
    type: String,
    select: false,
  },
  forgotPasswordExpiry: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// password encryption before saving

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
});

// validate the password with password passed by user
userSchema.methods.isValidPassword = async function (usersendPassword) {
  return await bcrypt.compare(usersendPassword, this.password);
};

// create and return jwt token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

// generate forgot password token
userSchema.methods.getForgotPasswordToken = function () {
  // generate a long and random string
  const forgotToken = crypto.randomBytes(20).toString("hex");
  console.log(`forgotToken is ${forgotToken}`);

  // getting a hash - make sure to get a hash on backend
  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex");

  console.log(
    `forgotPasswordToken hashed saved in db is ${this.forgotPasswordToken}`
  );
  // time of token

  this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;
  console.log(`expiry is ${this.forgotPasswordExpiry}`);

  return forgotToken;
};

module.exports = mongoose.model("User", userSchema);
