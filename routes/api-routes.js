// allow routing on this page
var app = require('express').Router();

// allows me to use mongo database promises and easier syntax
var mongoose = require("mongoose");

//allows me to web scrape
var cheerio = require("cheerio");
var axios = require("axios");

//requires all the database models
var db = require("../modals");

app.get("/api/scrape", (req, res) => {
    scrapeArticle(req, res)
})
app.post("/api/create-comment", (req, res) => {

    // creates a note object
    var newNote = {
        body: req.body.body
    };

    //creates a comment in the database and the pushes the id of that comment into the articles collection
    db.Comments.create(newNote).then(function (dbNote) {
        return db.Articles.findOneAndUpdate({
            _id: req.body.articleId
        }, { $push: { comments: dbNote._id } }, { new: true });

    }).then(function (dbArticle) {
        res.json(dbArticle);
    })
})



app.get("/api/comments/:id", (req, res) => {

    // if user is not signed in
    if (!req.user) {
        res.json(false);
    } else {
        db.Articles.findById({
            _id: req.params.id

            //populate grabs all comments where id is found in articles
            // it is like a foreign key
        }).populate("comments").then(function (data) {
            res.json(data)
        })
    }
})

app.put("/api/save-article", (req, res) => {
    if (!req.user) {
        res.json(false);
    } else {

        // pushes id of the article clicked to save so we can associate that article for the one user
        db.User.findOneAndUpdate({
            _id: req.user._id
        }, { $push: { savedArticles: req.body.articleId } }).then(function (data) {
            res.json(data);
        })
    }


})

app.delete("/api/delete-article", (req, res) => {
    db.User.update({
        _id: req.user._id
    }, { $pull: { savedArticles: req.body.id } }).then(function (data) {
        res.json(data);
    })
})

//scrapes the article
function scrapeArticle(req, res) {
    // Making a request via axios for `nhl.com`'s homepage
    axios.get("https://techcrunch.com/").then(function (response) {

        // Load the body of the HTML into cheerio
        var $ = cheerio.load(response.data);

        // Empty array to save our scraped data
        var results = [];

        //react inside the first post-block
        $(".post-block").each(function (i, element) {

            //grab the title
            var title = $(element).find(".post-block__title").text().trim();

            //grab the summary 
            var summary = $(element).find(".post-block__content").text().trim();

            //grab the link
            var link = $(element).find("a").attr("href");

            // Make an object with data we scraped for this h4 and push it to the results array
            results.push({
                title: title,
                summary: summary,
                link: link
            });
        });

        //gets all from the database
        db.Articles.find({}).then(function (data) {

            //saves all data pulled from the database
            dbArticles = data;

            //now store all data from the scrapper
            scrapedArticles = results;

            var filteredArticles = [];

            //go through every article
            for (var i = 0; i < scrapedArticles.length; i++) {
                //assume match is not found in database
                var isFound = false;
                //go through every database article
                for (var j = 0; j < dbArticles.length; j++) {
                    //if one of the articles title matches and of the articles found in the database 
                    if (scrapedArticles[i].title === dbArticles[j].title) {
                        isFound = true;
                    }
                }
                //if no match was found, we can push that object into the filtered articles array
                if (!isFound) {
                    filteredArticles.push(scrapedArticles[i]);
                }
            }

            //if there are no new articles to add
            if (filteredArticles.length === 0) {
                res.json([]);
            } else {

                // if there are new articles, create them
                db.Articles.create(filteredArticles).then(function () {
                    res.json(filteredArticles);
                }).catch(function (err) {
                    res.json(err);
                })
            }
        })
    });
}

module.exports = app;

