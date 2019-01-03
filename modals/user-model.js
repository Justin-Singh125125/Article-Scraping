const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    googleId: String,
    savedArticles: [{
        type: Schema.Types.ObjectId,
        ref: "Articles"
    }]

});

//creates the user schema 
var User = mongoose.model("user", userSchema);

//export the user so we can use elsewhere
module.exports = User;