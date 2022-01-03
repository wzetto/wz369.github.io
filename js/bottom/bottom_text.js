$(window).scroll(function() {
    var top_of_element = $("#bottom_text").offset().top;
    var bottom_of_element = $("#bottom_text").offset().top + $("#bottom_text").outerHeight();
    var bottom_of_screen = $(window).scrollTop() + $(window).innerHeight();
    var top_of_screen = $(window).scrollTop();

    if (((bottom_of_screen < top_of_element) || (top_of_screen > bottom_of_element)) 
        && ($("#bottom_text").text().indexOf('天国から地獄') != -1)) {
        document.getElementById("bottom_text").innerHTML = '地獄から天国';
        //$("#bottom_text").text('abc');
    } else if (((bottom_of_screen < top_of_element) || (top_of_screen > bottom_of_element)) 
        && ($("#bottom_text").text().indexOf('地獄から天国') != -1)) {
        //document.getElementsByClassName("div.bottom_text")[0].innerHTML = '天国から地獄';
        $("#bottom_text").text('cba');
    } else {
        document.getElementById("bottom_text").innerHTML = 'I dont understand';
    }
});
