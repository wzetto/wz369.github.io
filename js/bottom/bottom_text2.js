$(window).scroll(function() {
    var top_of_element = $("#bottom_text").offset().top;
    var bottom_of_element = $("#bottom_text").offset().top + $("#bottom_text").outerHeight();
    var bottom_of_screen = $(window).scrollTop() + $(window).innerHeight();
    var top_of_screen = $(window).scrollTop();

    if ((bottom_of_screen < top_of_element) || (top_of_screen > bottom_of_element)) {
        if (document.getElementById("bottom_text").innerHTML == '有り得ざる妖精の王よ') {
                document.getElementById("bottom_text").innerHTML = 'Life is shit but I\'m loving it.';
        //$("#bottom_text").text('abc');
    } else if (document.getElementById("bottom_text").innerHTML == 'Life is shit but I\'m loving it.') {
        //document.getElementsByClassName("div.bottom_text")[0].innerHTML = '天国から地獄';
        document.getElementById("bottom_text").innerHTML = '有り得ざる妖精の王よ';
    } else {
        document.getElementById("bottom_text").innerHTML = 'I dont understand';
    }}
});
