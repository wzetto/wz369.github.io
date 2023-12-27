window.onscroll = function() {side_column()};

function side_column() {
    var osTop = document.documentElement.scrollTop || document.body.srcollTop;
    
    var minH = document.getElementById("o202112t").getBoundingClientRect().top;
    var windowH = window.innerHeight;
    
//     Defined the variables
    var ids = ["202112", "202201", "202202", "202203", "202204", "202205", "202206", "202207",
              "202208", "202209", "202210", "202211", "202212", "202301", 
              "litcontrib"];
    var eleHeight = [];
    
    for (var i = 0; i < ids.length; i++) {
      var id = ids[i];
      var o = document.getElementById("o" + id);
      var ot = document.getElementById("o" + id + "t");
      var oh = o.getBoundingClientRect().top; // This variable was named by chatGPT, ask him.
      window["o" + id] = o; // True names.
      window["o" + id + "h"] = oh; // With their height.
      eleHeight.push(oh); 
        
      if (oh >= minH && oh < windowH-10) {
          ot.style.color = "#000000"; // The navigation bar.
      } else if ((i >= 1 && window["o" + ids[i-1] + "h"] >= minH && window["o" + ids[i-1] + "h"] < windowH-10)
      ||(i < ids.length-1 && window["o" + ids[i+1] + "h"] >= minH && window["o" + ids[i+1] + "h"] < windowH-10)) {
          ot.style.color = "#909090";
      } else {
        ot.style.color = "#bdbbbb"
      }
    }
}

// Click events
function navibar() {
    // Define the upper limit for header image.
    const headerHmax = 280;
    // Get all elements with an ID that starts with "o"
    const elementsRaw = document.querySelectorAll('[id^="o"]');
    var elements = Array.from(elementsRaw);
    // Get the length of the elements
    const elementLength = elements.length;

    // Seperate the Bar and Content elements.
    // Use Math.ceil() to round up the length of the elements
    // so that we include all elements in the "bar" and "content" arrays.
    const elementsContent = elements.slice(0, Math.ceil(elementLength / 2));
    const elementsBar = elements.slice(Math.ceil(elementLength / 2), elementLength);

    // Use the forEach() method to iterate over the combined elements
    // and add the click event listeners.
    elementsBar.forEach((eleBar, i) => {
        eleBar.addEventListener('click', () => {
            // Get the height of header image.
            const headerH = document.getElementById("header_img").getBoundingClientRect().height;
            // Handle the click event
            const eleContent = elementsContent[i];
            const eleTop = eleContent.getBoundingClientRect().top;
            let absoluteTop; // declare absoluteTop outside of the if statements
            if (headerH > headerHmax && eleTop > headerH*2) {
              absoluteTop = eleTop - headerH*2; // reassign the value of absoluteTop inside the if statement
            } else if (headerH < headerHmax && eleTop < -headerH*2) {
              absoluteTop = eleTop + headerH*2; // reassign the value of absoluteTop inside the else if statement
            } else {
              absoluteTop = eleTop; // reassign the value of absoluteTop inside the else statement
            };
            window.scrollTo({ top: absoluteTop, behavior: 'smooth' });
            // console.log(eleContent);
        });
    });
}
