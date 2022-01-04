var beforeScrollTop = $(window).scrollTop();
$(window).on("scroll", function (event) {
  var scrollTop = $(window).scrollTop();
  var delta = false;
  // after scrolling
  var afterScrollTop = $(window).scrollTop();
  var delta = afterScrollTop - beforeScrollTop;
  if (delta === 0) {
    return false;
  }
  if (delta > 5) {
    document.getElementsByClassName("inner_top background_img2")[0].style.height = "40px";
    document.getElementById("project_title").style.top = "-20%";
  } else if (delta < -50) {
    document.getElementsByClassName("inner_top background_img2")[0].style.height = "360px";
    document.getElementById("project_title").style.top = "5%";
  } else if (scrollTop === 0) {
    document.getElementsByClassName("inner_top background_img2")[0].style.height = "360px";
    document.getElementById("project_title").style.top = "5%";
  }
  beforeScrollTop = afterScrollTop;
});
