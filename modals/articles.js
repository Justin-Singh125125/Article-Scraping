var mongoose = require("mongoose");


var Schema = mongoose.Schema;


var ArticleSchema = new Schema({
    title: {
        type: String,
        unique: true

    },
    summary: {
        type: String,
        unique: true

    },
    link: {
        type: String,
        unique: true
    },
    Date: {
        type: Date,
        default: Date.now()
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

var Articles = mongoose.model("Articles", ArticleSchema);


module.exports = Articles;