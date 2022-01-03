$(window).scroll(function() {
    var top_of_element = $("div.bottom_text").offset().top;
    var bottom_of_element = $("div.bottom_text").offset().top + $("div.bottom_text").outerHeight();
    var bottom_of_screen = $(window).scrollTop() + $(window).innerHeight();
    var top_of_screen = $(window).scrollTop();

    if (((bottom_of_screen < top_of_element) || (top_of_screen > bottom_of_element)) 
        && $("div.bottom_text").text() == '天国から地獄') {
        //document.getElementsByClassName("div.bottom_text")[0].innerHTML = '地獄から天国';
        $("div.bottom_text").text('abc')
    } else if (((bottom_of_screen < top_of_element) || (top_of_screen > bottom_of_element)) 
        && $("div.bottom_text").text() == '地獄から天国') {
        //document.getElementsByClassName("div.bottom_text")[0].innerHTML = '天国から地獄';
        $("div.bottom_text").text('天国から地獄')
    }
});
