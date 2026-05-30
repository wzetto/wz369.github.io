const START_DATE = { year: 2021, month: 12 };
const END_DATE = { year: 2027, month: 12 };
const EXTRA_IDS = ["litcontrib"]; 

function generateIds() {
    let ids = [];
    let currentYear = START_DATE.year;
    let currentMonth = START_DATE.month;

    while (
        currentYear < END_DATE.year || 
        (currentYear === END_DATE.year && currentMonth <= END_DATE.month)
    ) {
        let monthStr = currentMonth < 10 ? "0" + currentMonth : currentMonth;
        ids.push(`${currentYear}${monthStr}`);

        currentMonth++;
        if (currentMonth > 12) {
            currentMonth = 1;
            currentYear++;
        }
    }
    return ids.concat(EXTRA_IDS);
}

const allIds = generateIds();

window.onscroll = function() {
    side_column();
};

function side_column() {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const windowH = window.innerHeight;
    
    const firstRef = document.getElementById("o" + allIds[0] + "t");
    if (!firstRef) return; // Safety check
    
    const minH = firstRef.getBoundingClientRect().top; 

    const positions = {};
    
    allIds.forEach(id => {
        const el = document.getElementById("o" + id);
        if (el) {
            positions[id] = el.getBoundingClientRect().top;
        }
    });

    // 2. Second pass: Apply styles
    allIds.forEach((id, i) => {
        const navText = document.getElementById("o" + id + "t");
        const pos = positions[id];

        if (!navText || pos === undefined) return;

        // Check Previous and Next IDs for the "Gray" logic
        const prevId = i > 0 ? allIds[i - 1] : null;
        const nextId = i < allIds.length - 1 ? allIds[i + 1] : null;
        
        const prevPos = prevId ? positions[prevId] : null;
        const nextPos = nextId ? positions[nextId] : null;

        // Logic for Active (Black)
        if (pos >= minH && pos < windowH - 10) {
            navText.style.color = "#000000"; 
        } 
        // Logic for Neighbors (Dark Gray)
        else if (
            (prevPos !== null && prevPos >= minH && prevPos < windowH - 10) ||
            (nextPos !== null && nextPos >= minH && nextPos < windowH - 10)
        ) {
            navText.style.color = "#909090";
        } 
        // Logic for Inactive (Light Gray)
        else {
            navText.style.color = "#bdbbbb";
        }
    });
}

function navibar() {
    const headerHmax = 280;
    const headerEl = document.getElementById("header_pages");

    
    allIds.forEach((id) => {
        const navItem = document.getElementById("o" + id + "t"); // The clickable text
        const targetContent = document.getElementById("o" + id); // The content to scroll to

        if (navItem && targetContent) {
            navItem.addEventListener('click', () => {
                const headerH = headerEl ? headerEl.getBoundingClientRect().height : 0;
                
                const eleRect = targetContent.getBoundingClientRect();
                const eleTopViewport = eleRect.top;
                
                const absoluteElementTop = window.scrollY + eleTopViewport;

                let finalScrollPos;

                if (headerH > headerHmax && eleTopViewport > headerH * 2) {
                    finalScrollPos = absoluteElementTop - (headerH * 2);
                } else if (headerH < headerHmax && eleTopViewport < -headerH * 2) {
                    finalScrollPos = absoluteElementTop + (headerH * 2);
                } else {
                    finalScrollPos = absoluteElementTop;
                }

                window.scrollTo({
                    top: finalScrollPos,
                    behavior: 'smooth'
                });
            });
        }
    });
}

document.addEventListener("DOMContentLoaded", navibar);