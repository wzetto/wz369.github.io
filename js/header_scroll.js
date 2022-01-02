window.inscroll = function()
{scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    document.getElementsByClassName("inner_top background_img")[0].style.height = "100px";
    document.getElementsByClassName("inner_top background_img")[0].style.backgroundSize = "cover";
    document.getElementById("project_title").style.fontSize = "26px";
  } else {/*may stay the origin*/
  }
}
