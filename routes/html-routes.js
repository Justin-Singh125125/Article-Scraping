var app = require("express").Router();
var db = require("../modals");

app.get("/", (req, res) => {
    db.Articles.find({}).sort({ _id: -1 }).then(function (data) {
        var home = {
            data: data,
            user: req.user
        }

        res.render("home", { articles: home });
    })

})

app.get("/savedArticles", (req, res) => {
    db.User.findById({
        _id: req.user._id
    }).populate("savedArticles").then(function (data) {

        res.render("savedArticles", { data: data });
    })

})

app.get("auth/login", (req, res) => {
    res.render("login")
})

module.exports = app;
