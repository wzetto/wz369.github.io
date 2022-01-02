window.onscroll = function() {
  scrollFunction()
};

function scrollFunction() {
  if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
    document.getElementsByClassName("inner_top background_img")[0].style.height = "40px";
    document.getElementById("project_title").style.position = "absolute";
    document.getElementById("project_title").style.top = "10px";
  } else {
    document.getElementsByClassName("inner_top background_img")[0].style.height = "300px";
    document.getElementById("project_title").style.position = "relative";
    document.getElementById("project_title").style.top = "5%";
  }
}
