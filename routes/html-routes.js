var app = require("express").Router();
var db = require("../modals");

app.get("/", (req, res) => {
    db.Articles.find({}).sort({ _id: -1 }).then(function (data) {
        res.render("home", { articles: data });
    })

})

app.get("/savedArticles", (req, res) => {
    db.User.findById({
        _id: req.user._id
    }).populate("savedArticles").then(function (data) {

        res.render("savedArticles", { savedArticles: data.savedArticles });
    })

})

app.get("auth/login", (req, res) => {
    res.render("login")
})

module.exports = app;
