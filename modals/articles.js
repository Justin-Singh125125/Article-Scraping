var mongoose = require("mongoose");


var Schema = mongoose.Schema;


var ArticleSchema = new Schema({
    title: {
        type: String


    },
    summary: {
        type: String


    },
    link: {
        type: String

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