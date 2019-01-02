var app = require('express').Router();
var mongoose = require("mongoose");

var cheerio = require("cheerio");
var axios = require("axios");

var db = require("../modals");

app.get("/api/scrape", (req, res) => {
    var scrapedArticles = [];
    var dbArticles = [];
    scrapeArticle(req, res)

})
app.post("/api/create-comment", (req, res) => {
    console.log(req.body.articleId);
    var newNote = {
        body: req.body.body
    }

    db.Comments.create(newNote).then(function (dbNote) {

        return db.Articles.findOneAndUpdate({
            _id: req.body.articleId
        }, { $push: { comments: dbNote._id } }, { new: true });

    }).then(function (dbArticle) {
        res.json(dbArticle);
    })
})



app.get("/api/comments/:id", (req, res) => {
    if (!req.user) {
        res.json(false);
    } else {
        db.Articles.findById({
            _id: req.params.id
            // i assume making the word plural grabs all of them
        }).populate("comments").then(function (data) {
            res.json(data)
        })
    }

})

app.get("/test", (req, res) => {
    console.log(req.user);
})






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

            //now we are going to filter the variables to only
            //contain the title, summary and link
            //so we can use the filter function
            var rearangedArticles = [];
            for (var i = 0; i < dbArticles.length; i++) {
                //create an object
                var articles = {
                    title: dbArticles[i].title,
                    summary: dbArticles[i].summary,
                    link: dbArticles[i].link
                }
                //push object to array
                rearangedArticles.push(articles);
            }


            //store filtered components from each object
            var onlyInA = rearangedArticles.filter(comparer(scrapedArticles));
            var onlyInB = scrapedArticles.filter(comparer(rearangedArticles));

            //once we have both components filtered, we smash them together to make data work
            var filteredArticles = onlyInA.concat(onlyInB);
            console.log(filteredArticles);
            if (filteredArticles.length === 0) {
                res.json([]);
            } else {
                db.Articles.create(filteredArticles).then(function () {
                    res.json(filteredArticles);
                }).catch(function (err) {
                    res.json(err);
                })
            }

        })




    });

    function comparer(otherArray) {
        return function (current) {
            return otherArray.filter(function (other) {
                return other.title == current.title && other.summary == current.summary && other.link == current.link;
            }).length == 0;
        }
    }
}

module.exports = app;

