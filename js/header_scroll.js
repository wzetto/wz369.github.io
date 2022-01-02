window.onscroll = function() {
  scrollFunction()
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementsByClassName("inner_top background_img")[0].style.height = "40px";
    document.getElementById("project_title").style.top = "0%";
  } else {
    document.getElementsByClassName("inner_top background_img")[0].style.height = "300px";
    document.getElementById("project_title").style.top = "5%";
  }
}
