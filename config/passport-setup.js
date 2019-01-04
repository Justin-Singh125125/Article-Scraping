const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const User = require('../modals/user-model');
//creates the cookie, this code occurs after the callback function in the google strategy
passport.serializeUser((user, done) => {
    //done sends data to the browser side
    //we are sending the first argument which should be an error if one and the current user

    //everytime we are currently signed in and try and grab something from req.user,
    //this code occurs to decrypt the info so we can use it
    done(null, user);
})
//this portion of the code happens after we create the cookie with the code above,

//since the cookie is encrypted, this decryps it and looks for the current user signed in the database 
passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        //done sends data to the browser side
        //we are sending the first argument which should be an error if one and the current user

        //everytime we are currently signed in and try and grab something from req.user,
        //this code occurs to decrypt the info so we can use it
        done(null, user);
    })
})

//allows us to use the google strategy
passport.use(
    new GoogleStrategy({
        //YOU NEED TO CREATE A KEYS.JS FILE AND PUT YOUR SECRET CODES IN THERE FOR THE CODE
        //BELOW TO RUN
        //GRAB YOUR KEYS FROM GOOGLE DEV CONSOLE

        //google takes three variable to work
        //first is the clientID which you get from creating a project
        //with the google dev console
        clientID: keys.google.clientID || process.env.CLIENT_ID,
        //you get your client secret also
        clientSecret: keys.google.clientSecret || process.env.CLIENT_SECRET,
        //this callback url is where google will redirect the user once they are verified and signed in
        //we redirect the user in the auth-routes javascript file
        callbackURL: '/auth/google/redirect'
        //we didnt use accessToken or refreshToken in this project
        //profile holds the data returned from google about the user that signs in
        //done re
    }, (accessToken, refreshToken, profile, done) => {
        //check if the user that logs in exists in the database
        User.findOne({
            googleId: profile.id
        }).then((currentUser) => {
            //if the user exists
            if (currentUser) {



                //everytime we are currently signed in and try and grab something from req.user,
                //this code occurs to decrypt the info so we can use it
                done(null, currentUser);

            } else {
                new User({
                    googleId: profile.id,
                    username: profile.displayName
                }).save().then((newUser) => {


                    //everytime we are currently signed in and try and grab something from req.user,
                    //this code occurs to decrypt the info so we can use it
                    done(null, newUser);
                });
            }
        })


    })
);