
$(document).on("click", "#get-news", scrapeArticle);
function scrapeArticle() {



    $.get("/api/scrape", function (data) {

        if (data.length === 0) {
            $("#modal-text").text("No new articles");
            $("#alertScraped").modal("show");
        } else {
            $("#modal-text").text(data.length + " New Articles Scraped");
            $("#alertScraped").modal("show");
        }
        setTimeout(function () {
            location.reload();
        }, 2000);

    })
}

