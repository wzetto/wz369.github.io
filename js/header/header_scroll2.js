window.onscroll = function() {
  scrollFunction()
};

function scrollFunction() {
  if (document.body.scrollTop > 5 || document.documentElement.scrollTop > 5) {
    document.getElementsByClassName("inner_top background_img2")[0].style.height = "40px";
    document.getElementById("project_title").style.top = "-20%";
  } else {
    document.getElementsByClassName("inner_top background_img2")[0].style.height = "360px";
    document.getElementById("project_title").style.top = "5%";
  }
}

function scrollFunctionDown() {
  if (document.body.scrollTop < -50 || document.documentElement.scrollTop < -50) {
    document.getElementsByClassName("inner_top background_img2")[0].style.height = "360px";
    document.getElementById("project_title").style.top = "5%";
  } else {
    document.getElementsByClassName("inner_top background_img2")[0].style.height = "40px";
    document.getElementById("project_title").style.top = "-20%";
  }
}
