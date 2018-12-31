$(document).ready(() => {

    $(document).on("click", "#get-news", scrapeArticle);
    function scrapeArticle() {

        //make an ajax call
        $.ajax("/api/scrape", {
            type: "GET",
        }).then((data) => {
            console.log(data);
        })
    }
})