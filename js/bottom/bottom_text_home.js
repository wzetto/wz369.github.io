$(window).scroll(function() {
    var top_of_element = $("#bottom_text").offset().top;
    var bottom_of_element = $("#bottom_text").offset().top + $("#bottom_text").outerHeight();
    var bottom_of_screen = $(window).scrollTop() + $(window).innerHeight();
    var top_of_screen = $(window).scrollTop();

    if ((bottom_of_screen < top_of_element) || (top_of_screen > bottom_of_element)) {
        if (document.getElementById("bottom_text").innerHTML == '取るに足りない、ちさな虫の一噛みで崩れる') {
                document.getElementById("bottom_text").innerHTML = '毒血に倒れ';
        //$("#bottom_text").text('abc');
    } else if (document.getElementById("bottom_text").innerHTML == '毒血に倒れ') {
        //document.getElementsByClassName("div.bottom_text")[0].innerHTML = '天国から地獄';
        document.getElementById("bottom_text").innerHTML = '希望を映すものは消え';
    } else if (document.getElementById("bottom_text").innerHTML == '希望を映すものは消え') {
        //document.getElementsByClassName("div.bottom_text")[0].innerHTML = '天国から地獄';
        document.getElementById("bottom_text").innerHTML = '異国には届かず';
    }　else if (document.getElementById("bottom_text").innerHTML == '異国には届かず') {
        //document.getElementsByClassName("div.bottom_text")[0].innerHTML = '天国から地獄';
        document.getElementById("bottom_text").innerHTML = '知恵者は手を誤り';
    }　else if (document.getElementById("bottom_text").innerHTML == '知恵者は手を誤り') {
        //document.getElementsByClassName("div.bottom_text")[0].innerHTML = '天国から地獄';
        document.getElementById("bottom_text").innerHTML = 'すべては、永遠に落ち続ける';
    }　else if (document.getElementById("bottom_text").innerHTML == 'すべては、永遠に落ち続ける') {
        //document.getElementsByClassName("div.bottom_text")[0].innerHTML = '天国から地獄';
        document.getElementById("bottom_text").innerHTML = '取るに足りない、ちさな虫の一噛みで崩れる';
    }}
});
