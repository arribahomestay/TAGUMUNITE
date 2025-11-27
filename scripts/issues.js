// Issues page tab behavior: load center content without full page reload

async function loadIssuesView(view) {
  const main = document.getElementById("issues-main");
  if (!main) return;

  const viewMap = {
    assigned: "../ISSUES/assigned.html",
    recent: "../ISSUES/recent.html",
    resolved: "../ISSUES/resolved.html",
  };

  const url = viewMap[view];
  if (!url) return;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load view " + view);
    const html = await res.text();

    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    const innerMain = tmp.querySelector("main");

    if (innerMain) {
      main.innerHTML = innerMain.innerHTML;
    }
  } catch (err) {
    console.error(err);
    main.innerHTML = '<div class="h-full flex items-center justify-center text-sm text-red-400">Failed to load view.</div>';
  }
}

function initIssuesTabs() {
  const tabs = document.querySelectorAll(".issues-tab");
  if (!tabs.length) return;

  const setActive = (activeTab) => {
    tabs.forEach((tab) => {
      if (tab === activeTab) {
        tab.classList.add("bg-gray-800", "text-gray-100");
        tab.classList.remove("hover:bg-gray-800", "text-gray-300");
      } else {
        tab.classList.remove("bg-gray-800", "text-gray-100");
        tab.classList.add("hover:bg-gray-800", "text-gray-300");
      }
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const view = tab.getAttribute("data-view");
      setActive(tab);
      loadIssuesView(view);
    });
  });

  // Load default view (assigned)
  const firstTab = tabs[0];
  if (firstTab) {
    setActive(firstTab);
    const defaultView = firstTab.getAttribute("data-view");
    loadIssuesView(defaultView);
  }
}

window.addEventListener("DOMContentLoaded", initIssuesTabs);
