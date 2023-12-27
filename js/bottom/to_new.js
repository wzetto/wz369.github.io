document.addEventListener("DOMContentLoaded", function () {
    const toNew = document.getElementById("to_new");
    const innerLeft = document.getElementById("olitcontrib");
    const rect = innerLeft.getBoundingClientRect();
    const bottom = rect['top']-190;

    toNew.addEventListener("click", function () {
      window.scrollTo({
        top: bottom,
        behavior: "smooth",
      });
    });
  });
 
// async function bottomFunction() {
//     if (document.getElementById("to_new").style.display == "block") {
//         const innerLeft = document.querySelector('.inner_left');
//         const rect = innerLeft.getBoundingClientRect();
//         const bottom = rect.top + innerLeft.offsetHeight;

//         window.scrollTo({ top: bottom, behavior: 'smooth' });
//     }
// }
