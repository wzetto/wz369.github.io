window.onscroll = function() {
  scrollFunction()
};

function scrollFunction() {
  if (document.body.scrollTop > 60 || document.documentElement.scrollTop > 60) {
    document.getElementsByClassName("inner_top background_img")[0].style.height = "40px";
  } else {
    document.getElementsByClassName("inner_top background_img")[0].style.height = "300px";
  }
}
