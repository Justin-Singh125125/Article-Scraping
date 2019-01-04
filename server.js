var express = require("express");
var expressHandlebars = require("express-handlebars");
var htmlRoutes = require("./routes/html-routes");
var apiRoutes = require("./routes/api-routes");
var mongoose = require("mongoose");

const authRoutes = require("./routes/auth-routes");
const passportSetup = require("./config/passport-setup");
const cookieSession = require("cookie-session");
const passport = require("passport");
const keys = require("./config/keys");


var PORT = process.env.PORT || 8080;


var app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Handlebars
app.engine("handlebars", expressHandlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//for the cookie session 
app.use(cookieSession({
    //how long we want the cookie to last before they log out, equivelent to 1 day
    maxAge: 24 * 60 * 60 * 1000,
    //encrypts the cookie key with the hidden string that you made
    keys: [keys.session.cookieKey] || proccess.env.COOKIE_KEY
}))

//initialize passport, allows us to use our cookies
app.use(passport.initialize());
app.use(passport.session());

//writing code like this puts auth behind the forward slash
app.use("/auth", authRoutes);

//allows us to use our custom html routes
app.use(htmlRoutes);
app.use(apiRoutes);

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, () => {
    console.log("Connected to Mongodb");
})

app.listen(PORT, () => {
    console.log(
        "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
        PORT)
})