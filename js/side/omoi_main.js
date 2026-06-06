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

let lastActiveId = null;
let scrollTicking = false;

function requestSideColumnUpdate() {
    if (scrollTicking) return;

    scrollTicking = true;
    window.requestAnimationFrame(() => {
        side_column();
        scrollTicking = false;
    });
}

window.addEventListener("scroll", requestSideColumnUpdate, { passive: true });
window.addEventListener("resize", requestSideColumnUpdate);

function getActiveId(positions) {
    const activeLine = Math.min(window.innerHeight * 0.45, 420);
    let activeId = null;
    let firstBelowId = null;

    allIds.forEach(id => {
        const pos = positions[id];
        if (pos === undefined) return;

        if (pos <= activeLine) {
            activeId = id;
        } else if (!firstBelowId) {
            firstBelowId = id;
        }
    });

    return activeId || firstBelowId;
}

function getVisibleIds(rects) {
    return allIds.filter(id => {
        const rect = rects[id];
        if (!rect) return false;

        return rect.bottom >= 0 && rect.top <= window.innerHeight;
    });
}

function centerSidebarOn(activeId) {
    const sidebarEl = document.getElementById("o" + activeId + "t");
    const sidebarContainer = document.querySelector(".inner_right");
    if (!sidebarEl || !sidebarContainer) return;

    if (typeof sidebarEl.scrollIntoView === "function") {
        sidebarEl.scrollIntoView({ block: "center", inline: "nearest" });
    }

    const containerRect = sidebarContainer.getBoundingClientRect();
    const elRect = sidebarEl.getBoundingClientRect();
    const relativeTop = elRect.top - containerRect.top + sidebarContainer.scrollTop;
    const targetTop = relativeTop - containerRect.height / 2 + elRect.height / 2;
    const maxTop = sidebarContainer.scrollHeight - sidebarContainer.clientHeight;
    const boundedTop = Math.max(0, Math.min(targetTop, maxTop));

    if (Math.abs(sidebarContainer.scrollTop - boundedTop) > 1) {
        sidebarContainer.scrollTop = boundedTop;
    }
}

function side_column() {
    const positions = {};
    const rects = {};
    
    allIds.forEach(id => {
        const el = document.getElementById("o" + id);
        if (el) {
            const rect = el.getBoundingClientRect();
            positions[id] = rect.top;
            rects[id] = rect;
        }
    });

    const currentActiveId = getActiveId(positions);
    const activeIndex = allIds.indexOf(currentActiveId);
    const visibleIds = new Set(getVisibleIds(rects));

    allIds.forEach((id, i) => {
        const navText = document.getElementById("o" + id + "t");
        if (!navText) return;

        if (visibleIds.has(id) || id === currentActiveId) {
            navText.style.color = "#000000";
        } else if (activeIndex !== -1 && Math.abs(i - activeIndex) === 1) {
            navText.style.color = "#909090";
        } else {
            navText.style.color = "#bdbbbb";
        }
    });

    if (currentActiveId && currentActiveId !== lastActiveId) {
        lastActiveId = currentActiveId;
        centerSidebarOn(currentActiveId);
    }
}

function navibar() {
    const headerHmax = 280;
    const headerEl = document.getElementById("header_pages");

    
    allIds.forEach((id) => {
        const navItem = document.getElementById("o" + id + "t"); // The clickable text
        const targetContent = document.getElementById("o" + id); // The content to scroll to

        if (navItem && targetContent) {
            if (navItem.dataset.omoiBound === "true") return;
            navItem.dataset.omoiBound = "true";

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

document.addEventListener("DOMContentLoaded", () => {
    navibar();
    side_column();
});
window.addEventListener("load", side_column);
