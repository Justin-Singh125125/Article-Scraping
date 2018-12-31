var express = require("express");
var expressHandlebars = require("express-handlebars");
var htmlRoutes = require("./routes/html-routes");
var apiRoutes = require("./routes/api-routes");
var mongoose = require("mongoose");


var PORT = process.env.PORT || 8080;


var app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Handlebars
app.engine("handlebars", expressHandlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//allows us to use our custom html routes
app.use(htmlRoutes);
app.use(apiRoutes);

mongoose.connect("ds149144.mlab.com:49144/article-scrape", () => {
    console.log("Connected to Mongodb");
})

app.listen(PORT, () => {
    console.log(
        "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
        PORT)
})