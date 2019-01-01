
$(document).on("click", "#get-news", scrapeArticle);
function scrapeArticle() {



    $.get("/api/scrape", function (data) {
        console.log(data);
        if (data.errmsg) {
            $("#modal-text").text(0 + " Articles Scraped");
            $("#alertScraped").modal("show");
        } else {
            console.log(data);
            $("#modal-text").text(data.length);
            $("#alertScraped").modal("show");

        }

        setTimeout(function () {
            location.reload();
        }, 2000);

    })
}

