$(document).ready(function() {
    $("#who_all_expand").click(function() {
        $("#who_all_parent").slideToggle("slow");
        setTimeout(function() {
            if ($('#who_all_parent').is(':visible'))
                $("#who_all_expand #view_text").text($('#who_all_expand').attr('data-expandLabel'));
            else
                $("#who_all_expand #view_text").text($('#who_all_expand').attr('data-collapseLabel'));
        }, 750);
    });
});