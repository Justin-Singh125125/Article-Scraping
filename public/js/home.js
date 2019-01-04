
$(document).on("click", "#get-news", scrapeArticle);
$(document).on("click", "#send-comment", sendComment);
var articleId = "";



function sendComment() {

    if ($("#user-comment").val() === "") {
        $("#modal-text").text("Please enter a comment");
        $(".modal-title").empty();

        $("#alertScraped").modal("show");
    } else {
        var newComment = {
            articleId: articleId,
            body: $("#user-comment").val().trim()
        };

        $.ajax("/api/create-comment", {
            type: "post",
            data: newComment
        }).then(function (data) {
            console.log(data);
            $("#modal-text").text("Comment Sent");
            $(".modal-title").empty();
            $("#alertScraped").modal("show");
            $("#wrapper").toggleClass("toggled");

        })
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

        if (data === false) {
            $("#modal-text").text("Please login to use this feature");
            $("#alertScraped").modal("show");
        } else {


            $("#modal-text").text("Article Saved!");
            $(".modal-title").empty();
            $("#alertScraped").modal("show");
        }
    })
})



//when the comment button is clicked
$(".menu-toggle").on("click", function (e) {
    articleId = $(this).attr("data-articleId");

    $.ajax("/api/comments/" + articleId, {
        type: "GET"
    }).then(function (data) {
        if (data === false) {
            $("#form-user").css("display", "none");
            $("#comment-section").empty();
            $("#comment-section").append("<p>You need to login to see and post comments</p>");
            $("#comment-section").append(`<a href="/auth/login"><button type="button" class="btn btn-info">Login</button></a>`);
            $("#wrapper").toggleClass("toggled");

        } else {
            renderComments(data);
            $("#wrapper").toggleClass("toggled");
        }

    })


});


function renderComments(data) {
    $("#comment-section").empty();
    for (var i = data.comments.length - 1; i >= 0; i--) {
        var comment = $("<p>").text(data.comments[i].body);
        $("#comment-section").append(comment);
    }

}


function scrapeArticle() {

    $.ajax("/api/scrape", {
        type: "get",
        beforeSend: function () {
            $("#page-content-wrapper").css("visibility", "hidden");
            $(".box").css("visibility", "visible")
        }

    }).then(function (data) {
        $("#page-content-wrapper").css("visibility", "visible");
        $(".box").css("visibility", "hidden")
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

