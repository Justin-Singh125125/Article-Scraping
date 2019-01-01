var app = require("express").Router();
var db = require("../modals");

app.get("/", (req, res) => {

    db.Articles.find({}).sort({ Date: -1 }).then(function (data) {
        res.render("home", { articles: data });
    })

})

module.exports = app;
