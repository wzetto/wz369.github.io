window.onscroll = function() {side_column()};

function side_column() {
    var osTop = document.documentElement.scrollTop || document.body.srcollTop;
    var dispW = document.querySelector('.inner_left').offsetWidth;
    var background = document.getElementById("background");
    var method = document.getElementById("methods");
    var saa = document.getElementById("saa");
    var gr = document.getElementById("gr");
    var algo = document.getElementById("algo");
    var nn = document.getElementById("nn");
    var result = document.getElementById("result");
    var discuz = document.getElementById("discuz");
    if (osTop < 240000/dispW) {
        background.style.color = "#000000";
        method.style.color = "#909090";
        saa.style.color = "#bdbbbb";
        gr.style.color = "#bdbbbb";
        algo.style.color = "#bdbbbb";
        nn.style.color = "#bdbbbb";
        result.style.color = "#bdbbbb";
        discuz.style.color = "#bdbbbb";
    } else if (240000/dispW <= osTop && osTop < 840000/dispW) {
        background.style.color = "#909090";
        method.style.color = "#000000";
        saa.style.color = "#000000";
        gr.style.color = "#909090";
        algo.style.color = "#bdbbbb";
        nn.style.color = "#bdbbbb";
        result.style.color = "#bdbbbb";
        discuz.style.color = "#bdbbbb";
    } else if (840000/dispW <= osTop && osTop < 1200000/dispW) {
        background.style.color = "#bdbbbb";
        method.style.color = "#000000";
        saa.style.color = "#909090";
        gr.style.color = "#000000";
        algo.style.color = "#909090";
        nn.style.color = "#bdbbbb";
        result.style.color = "#bdbbbb";
        discuz.style.color = "#bdbbbb";
    } else if (1200000/dispW <= osTop && osTop < 1400000/dispW) {
        background.style.color = "#bdbbbb";
        method.style.color = "#000000";
        saa.style.color = "#bdbbbb";
        gr.style.color = "#909090";
        algo.style.color = "#000000";
        nn.style.color = "#909090";
        result.style.color = "#bdbbbb";
        discuz.style.color = "#bdbbbb";
    } else if (1400000/dispW <= osTop && osTop < 1800000/dispW) {
        background.style.color = "#bdbbbb";
        method.style.color = "#000000";
        saa.style.color = "#bdbbbb";
        gr.style.color = "#bdbbbb";
        algo.style.color = "#909090";
        nn.style.color = "#000000";
        result.style.color = "#909090";
        discuz.style.color = "#bdbbbb";
    } else if (1800000/dispW <= osTop && osTop < 2800000/dispW) {
        background.style.color = "#bdbbbb";
        method.style.color = "#bdbbbb";
        saa.style.color = "#bdbbbb";
        gr.style.color = "#bdbbbb";
        algo.style.color = "#bdbbbb";
        nn.style.color = "#909090";
        result.style.color = "#000000";
        discuz.style.color = "#909090";
    } else if (2800000/dispW <= osTop) {
        background.style.color = "#bdbbbb";
        method.style.color = "#bdbbbb";
        saa.style.color = "#bdbbbb";
        gr.style.color = "#bdbbbb";
        algo.style.color = "#bdbbbb";
        nn.style.color = "#bdbbbb";
        result.style.color = "#909090";
        discuz.style.color = "#000000";
    };
}