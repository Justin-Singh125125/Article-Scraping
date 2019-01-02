
$(document).on("click", "#get-news", scrapeArticle);
$(document).on("click", "#send-comment", sendComment);
var articleId = "";



function sendComment() {
    console.log("test" + articleId);
    var newComment = {
        articleId: articleId,
        body: $("#user-comment").val().trim()
    };

    $.post("/api/create-comment", newComment), function (data) {

    }

    console.log(newComment);
}

$(".menu-toggle").on("click", function (e) {
    articleId = $(this).attr("data-articleId");

    $.ajax("/api/comments/" + articleId, {
        type: "GET"
    }).then(function (data) {
        console.log(data);
        $("#comment-section").empty();
        for (var i = 0; i < data.comments.length; i++) {
            var comment = $("<p>").text(data.comments[i].body);
            $("#comment-section").append(comment);
            console.log(comment);
        }
        $("#wrapper").toggleClass("toggled");
    })


});


function scrapeArticle() {



    $.get("/api/scrape", function (data) {

        if (data.length === 0) {
            $("#modal-text").text("No new articles");
            $("#alertScraped").modal("show");
        } else {
            console.log(data);
            $("#modal-text").text(data.length + " New Articles Scraped");
            $("#alertScraped").modal("show");
        }
        setTimeout(function () {
            location.reload();
        }, 2000);

    })
}

