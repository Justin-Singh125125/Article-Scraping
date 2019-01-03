
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

}

//when save article button is clicked
$(".save-article").on("click", function () {
    var saveArticle = {
        articleId: $(this).attr("data-articleId")
    };



    $.ajax("/api/save-article", {
        type: "put",
        data: saveArticle
    }).then(function (data) {
        console.log(data);
    })
})



//when the comment button is clicked
$(".menu-toggle").on("click", function (e) {
    articleId = $(this).attr("data-articleId");

    $.ajax("/api/comments/" + articleId, {
        type: "GET"
    }).then(function (data) {

        console.log(data);
        if (data === false) {
            $("#form-user").css("display", "none");
            $("#comment-section").empty();
            $("#comment-section").append("<p>You need to login to see and post comments</p>");
            $("#comment-section").append(`<a href="/auth/login"><button type="button" class="btn btn-info">Login</button></a>`);
            $("#wrapper").toggleClass("toggled");

        } else {

            $("#comment-section").empty();
            for (var i = 0; i < data.comments.length; i++) {
                var comment = $("<p>").text(data.comments[i].body);
                $("#comment-section").append(comment);
            }
            $("#wrapper").toggleClass("toggled");
        }

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

