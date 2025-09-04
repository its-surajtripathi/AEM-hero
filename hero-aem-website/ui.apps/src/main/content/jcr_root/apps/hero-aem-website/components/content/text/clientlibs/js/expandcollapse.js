$(document).ready(function() {
    $(".read-more-mobile").click(function() {
        $(this).closest(".row").find('.hide-content-mobile').toggleClass('show');
        $(this).closest(".row").find('.read-less-mobile').toggleClass('d-none');
        $(this).toggleClass('d-none');
    });
    $(".read-less-mobile").click(function() {
        $(this).closest(".row").find('.hide-content-mobile').toggleClass('show');
        $(this).closest(".row").find('.read-more-mobile').toggleClass('d-none');
        $(this).toggleClass('d-none');
    });
});