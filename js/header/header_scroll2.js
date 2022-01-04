var beforeScrollTop = $(window).scrollTop();
$(window).on("scroll", function (event) {
  var scrollTop = $(window).scrollTop();
  var delta = false;
  // after scrolling
  var afterScrollTop = $(window).scrollTop();
  var delta = afterScrollTop - beforeScrollTop;
  
  if (delta > 5) {
    document.getElementsByClassName("inner_top background_img2")[0].style.height = "40px";
    document.getElementById("project_title").style.top = "-20%";
    document.getElementsByClassName("home_bar")[0].style.display = "none";
  } else if (delta < -30) {
    document.getElementsByClassName("inner_top background_img2")[0].style.height = "360px";
    document.getElementById("project_title").style.top = "5%";
    document.getElementsByClassName("home_bar")[0].style.display = "block";
  } else if (scrollTop <= 1) {
    document.getElementsByClassName("inner_top background_img2")[0].style.height = "360px";
    document.getElementById("project_title").style.top = "5%";
    document.getElementsByClassName("home_bar")[0].style.display = "block";
  }
  beforeScrollTop = afterScrollTop;
});
