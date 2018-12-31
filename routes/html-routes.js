var app = require("express").Router();

app.get("/", (req, res) => {
    res.render("home");
})

module.exports = app;
