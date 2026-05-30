$(window).scroll(function() {
    var top_of_element = $("#bottom_text").offset().top;
    var bottom_of_element = $("#bottom_text").offset().top + $("#bottom_text").outerHeight();
    var bottom_of_screen = $(window).scrollTop() + $(window).innerHeight();
    var top_of_screen = $(window).scrollTop();

    if ((bottom_of_screen < top_of_element) || (top_of_screen > bottom_of_element)) {
        if (document.getElementById("bottom_text").innerHTML == '') {
                document.getElementById("bottom_text").innerHTML = '';
        //$("#bottom_text").text('abc');
    } else if (document.getElementById("bottom_text").innerHTML == '') {
        document.getElementById("bottom_text").innerHTML = '';
    } }
});
