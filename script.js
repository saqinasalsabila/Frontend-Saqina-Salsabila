
var lastScrollTop = 0;
navbar = document.getElementById("site-header");

window.addEventListener("scroll", function () {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop) {
        navbar.style.top = "-80px";
    } else {
        navbar.style.top = "0";
    }
    lastScrollTop = scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 100) {
        navbar.classList.add("scroll-up");
    } else {
        navbar.classList.remove("scroll-up");
    }
});

$(function () {
    
    var numberOfItems = $(".card-content .card").length;
    var limitPerPage = 10;
    var totalPages = Math.ceil(numberOfItems / limitPerPage);
    var paginationSize = 7;
    var currentPage;

    function getPageList(totalPages, page, maxLength) {
        function range(start, end) {
            return Array.from(Array(end - start + 1), (_, i) => i + start);
        }

        var sideWidth = maxLength < 9 ? 1 : 2;
        var leftWidth = (maxLength - sideWidth * 2 - 3) >> 1;
        var rightWidth = (maxLength - sideWidth * 2 - 3) >> 1;

        if (totalPages <= maxLength) {
            return range(1, totalPages);
        }

        if (page <= maxLength - sideWidth - 1 - rightWidth) {
            return range(1, maxLength - sideWidth - 1).concat(0, range(totalPages - sideWidth + 1, totalPages));
        }

        if (page >= maxLength - sideWidth - 1 - rightWidth) {
            return range(1, maxLength - sideWidth - 1).concat(0, range(totalPages - sideWidth - 1 - totalPages));
        }

        return range(1, sideWidth).concat(0, range(page - leftWidth, page + rightWidth), 0, range(totalPages - sideWidth + 1, totalPages));
    }

    function showPage(whichPage) {
        if (whichPage < 1 || whichPage > totalPages) return false;

        currentPage = whichPage;

        var startItemIndex = (currentPage - 1) * limitPerPage;
        var endItemIndex = startItemIndex + limitPerPage;

        $(".card-content .card").hide().slice(startItemIndex, endItemIndex).show();

        $(".pagination li").slice(1, -1).remove();

        getPageList(totalPages, currentPage, paginationSize).forEach((item) => {
            $("<li>")
                .addClass("page-item")
                .addClass(item ? "current-page" : "dots")
                .toggleClass("active", item === currentPage)
                .append($("<a>").addClass("page-link").attr({ href: "javascript:void(0)" }).text(item || "..."))
                .insertBefore(".next-page");
        });

        $(".previous-page").toggleClass("disabled", currentPage === 1);
        $(".next-page").toggleClass("disable", currentPage === totalPages);
        return true;
    }

    $("#sortAndShowBtn").on("click", function () {
        var sortBy = $("#sortSelect").val();
        var perPage = $("#perPageSelect").val();

        $(".card-content .card").sort(function (a, b) {
            var dateA = new Date($(a).find(".card-info p").text());
            var dateB = new Date($(b).find(".card-info p").text());
            return sortBy === "latest" ? dateB - dateA : dateA - dateB;
        }).appendTo(".card-content");

        limitPerPage = perPage;

        showPage(1);
    });

    $(".pagination").append(
        $("<li>").addClass("page-item").addClass("previous-page").append($("<a>").addClass("page-link").attr({ href: "javascript:void(0)" }).text("Prev")),
        $("<li>").addClass("page-item").addClass("next-page").append($("<a>").addClass("page-link").attr({ href: "javascript:void(0)" }).text("Next"))
    );

    $(".card-content").show();
    showPage(1);

    $(document).on("click", ".pagination li.current-page:not(.active)", function () {
        return showPage(+$(this).text());
    });

    $(".next-page").on("click", function () {
        return showPage(currentPage + 1);
    });

    $(".previous-page").on("click", function () {
        return showPage(currentPage - 1);
    });

});

