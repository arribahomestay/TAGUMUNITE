// Simple helper to inject footer.html into the #footer-root container on each page

async function loadFooter() {
  const container = document.getElementById("footer-root");
  if (!container) return;

  try {
    const path = window.location.pathname || "";
    let footerPath = "./partials/footer.html";

    const lower = path.toLowerCase();
    if (lower.includes("/pages/") || lower.includes("/issues/")) {
      footerPath = "../partials/footer.html";
    }

    const res = await fetch(footerPath, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load footer.html");
    const html = await res.text();
    container.innerHTML = html;
  } catch (err) {
    console.error("Footer load error", err);
  }
}

window.addEventListener("DOMContentLoaded", loadFooter);
