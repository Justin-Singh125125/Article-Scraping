const router = require("express").Router();
const passport = require("passport");


//auth login
router.get("/login", function (req, res) {
    res.render("login");
})

//logout
router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
    //handle with passport
})

//passport knows to use google strategy with the key word google
router.get("/google", passport.authenticate("google", {
    //asks for profile info from google 
    scope: ['profile']
}));

//callback route for google to redirect 
//the difference between the passport authentication is that here you have a code and you can exchange that code for profile info
//passport will know automatically
router.get("/google/redirect", passport.authenticate("google"), function (req, res) {
    //since we are signed in, we redirect the user to the profile page
    res.redirect("/");

})
module.exports = router;