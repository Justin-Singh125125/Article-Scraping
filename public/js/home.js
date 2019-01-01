
$(document).on("click", "#get-news", scrapeArticle);
function scrapeArticle() {



    $.get("/api/scrape", function (data) {
        console.log(data);
        $("#alertScraped").modal("show");
    })
}

