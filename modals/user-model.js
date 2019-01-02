const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    googleId: String
});

//creates the user schema 
const User = mongoose.model("user", userSchema);

//export the user so we can use elsewhere
module.exports = User;