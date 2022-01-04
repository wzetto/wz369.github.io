window.addEventListener("scroll",function() { 
   if(window.scrollY > 5) {
     document.getElementsByClassName("inner_top background_img2")[0].style.height = "40px";
     document.getElementById("project_title").style.top = "-20%";
   }
   else if (window.scrollY < -50) {
      document.getElementsByClassName("inner_top background_img2")[0].style.height = "360px";
      document.getElementById("project_title").style.top = "5%";
   }
}, false);
