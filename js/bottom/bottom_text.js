$(window).scroll(function() {
    var top_of_element = $("#element").offset().top;
    var bottom_of_element = $("#element").offset().top + $("#element").outerHeight();
    var bottom_of_screen = $(window).scrollTop() + $(window).innerHeight();
    var top_of_screen = $(window).scrollTop();

    if ((bottom_of_screen < top_of_element) && (top_of_screen < bottom_of_element)){
        // the element is visible, do something
    } else {
        // the element is not visible, do something else
    }
});
