window.onscroll = function() {scrollFunction()};
// window.addEventListener('load', function() {
//   setInterval(backTotop, 1000);
// });

function scrollFunction() {
    if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
        document.getElementById("back_top").style.display = "block";
    } else {
        document.getElementById("back_top").style.display = "none";
    }
}
 
async function topFunction() {
    if (document.getElementById("back_top").innerHTML == 'TOP') {
        var osTop = document.documentElement.scrollTop || document.body.srcollTop;
        window.osToploc = osTop;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.getElementById("back_top").innerHTML = 'BACK';
//         Back to TOP button after 10s.
        await new Promise(resolve => setTimeout(resolve, 10000));
        document.getElementById("back_top").innerHTML = 'TOP';
//         console.log(window.osToploc)
    } else if (document.getElementById("back_top").innerHTML == 'BACK') {
//         console.log(window.osToploc)
        window.scrollTo({ top: window.osToploc, behavior: 'smooth' });
        document.getElementById("back_top").innerHTML = 'TOP';
    }
}

// async function backTotop() {
//   let startTime = performance.now();
//   while (true) {
//     if (document.getElementById("back_top").innerHTML == 'BACK') {
//       let endTime = performance.now();
//       let elaspedTime = (endTime - startTime) / 1000;
//       if (elaspedTime >= 10) {
//         document.getElementById("back_top").innerHTML = 'TOP';
//         break;
//       }
//     await new Promise(resolve => setTimeout(resolve, 2000));
//     }
//   }
// }
