import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: false,
    },
    last_name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
      default: null,
    },
    googleId: {
      type: String,
      default: null,
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    avatar: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profilePicture: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    language: {
      type: String,
      default: "en",
    },
    timezone: {
      type: String,
      default: "utc",
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    themeMode: {
      type: String,
      default: "system",
    },
    primaryColor: {
      type: String,
      default: "blue",
    },
    fontSize: {
      type: String,
      default: "medium",
    },
    animations: {
      type: Boolean,
      default: true,
    },
    emailNewMovie: {
      type: Boolean,
      default: true,
    },
    emailNewReview: {
      type: Boolean,
      default: true,
    },
    emailNewUser: {
      type: Boolean,
      default: false,
    },
    pushEnabled: {
      type: Boolean,
      default: true,
    },
    pushNewMovie: {
      type: Boolean,
      default: true,
    },
    pushNewReview: {
      type: Boolean,
      default: false,
    },
    sessionTimeout: {
      type: Number,
      default: 30,
    },
    loginAttempts: {
      type: Number,
      default: 5,
    },
    twoFactor: {
      type: Boolean,
      default: true,
    },
    forcePasswordChange: {
      type: Boolean,
      default: false,
    },
    passwordUppercase: {
      type: Boolean,
      default: true,
    },
    passwordNumbers: {
      type: Boolean,
      default: true,
    },
    passwordSymbols: {
      type: Boolean,
      default: true,
    },
    passwordMinLength: {
      type: Boolean,
      default: true,
    },
    cacheDuration: {
      type: Number,
      default: 60,
    },
    paginationLimit: {
      type: String,
      default: "20",
    },
    debugMode: {
      type: Boolean,
      default: false,
    },
    apiAccess: {
      type: Boolean,
      default: true,
    },
    backupFrequency: {
      type: String,
      default: "daily",
    },
  },
  { timestamps: true },
);

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const users = mongoose.model("users", UserSchema);

export default users;
