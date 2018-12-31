var app = require('express').Router();

var cheerio = require("cheerio");
var axios = require("axios");

app.get("/api/scrape", (req, res) => {
    scrapeArticle(req, res)
})
// var fullWordList = ['1','2','3','4','5'];
// var wordsToRemove = ['1','2','3'];

// var filteredKeywords = fullWordList.filter((word) => !wordsToRemove.includes(word));

//console.log(filteredKeywords);
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

        // After looping through each element found, log the results to the console
        res.json(results);
    });

}

module.exports = app;

