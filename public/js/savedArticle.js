

$(".delete-article").on("click", function () {
    var deleteArticle = {
        id: $(this).attr("data-articleId")
    };

    $.ajax("/api/delete-article", {
        type: "delete",
        data: deleteArticle
    }).then(function (data) {
        location.reload();
    })


})