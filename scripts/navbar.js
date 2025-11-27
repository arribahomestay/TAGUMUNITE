// Simple helper to inject navbar.html into the #navbar-root container on each page

async function loadNavbar() {
  const container = document.getElementById("navbar-root");
  if (!container) return;

  try {
    const path = window.location.pathname || "";
    let navbarPath = "./partials/navbar.html";

    const lower = path.toLowerCase();
    if (lower.includes("/pages/") || lower.includes("/issues/")) {
      navbarPath = "../partials/navbar.html";
    }

    const res = await fetch(navbarPath, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load navbar.html");
    const html = await res.text();
    container.innerHTML = html;

    initNavbarInteractions();
    setActiveNavItem(path);
  } catch (err) {
    console.error("Navbar load error", err);
  }
}

function setActiveNavItem(pathname) {
  const sectionFromPath = () => {
    if (!pathname) return "dashboard";
    const lower = pathname.toLowerCase();
    if (lower.includes("issues")) return "issues";
    if (lower.includes("projects")) return "projects";
    if (lower.includes("discussions")) return "discussions";
    if (lower.includes("management")) return "management";
    return "dashboard";
  };

  const current = sectionFromPath();
  const links = document.querySelectorAll(".nav-menu-link");
  const titleEl = document.getElementById("navbar-title");

  links.forEach((link) => {
    const section = link.getAttribute("data-section");
    if (section === current) {
      link.classList.add("bg-gray-800", "text-gray-100");
      link.classList.remove("text-gray-300");
    } else {
      link.classList.remove("bg-gray-800", "text-gray-100");
      link.classList.add("text-gray-300");
    }
  });

  if (titleEl) {
    const map = {
      dashboard: "Dashboard",
      issues: "Issues",
      projects: "Projects",
      discussions: "Discussions",
      management: "Management",
    };
    titleEl.textContent = map[current] || "Dashboard";
  }
}

function initNavbarInteractions() {
  const burger = document.getElementById("navbar-burger");
  const overlay = document.getElementById("nav-overlay");
  const closeBtn = document.getElementById("nav-overlay-close");
  const panel = document.getElementById("nav-panel");
  const profileButton = document.getElementById("profile-button");
  const profileMenu = document.getElementById("profile-menu");

  if (!burger || !overlay || !panel) return;

  const open = () => {
    overlay.classList.remove("hidden");
    // Allow the browser to paint before starting the slide animation
    requestAnimationFrame(() => {
      panel.classList.remove("-translate-x-full");
    });
  };

  const close = () => {
    panel.classList.add("-translate-x-full");
    // Wait for the transition to finish before hiding the overlay
    setTimeout(() => {
      overlay.classList.add("hidden");
    }, 200);
  };

  burger.addEventListener("click", open);

  if (closeBtn) {
    closeBtn.addEventListener("click", close);
  }

  // Close when clicking outside the panel (on the dimmed background)
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      close();
    }
  });

  // Profile dropdown
  if (profileButton && profileMenu) {
    const toggleProfile = (show) => {
      const isHidden = profileMenu.classList.contains("hidden");
      const shouldShow = show ?? isHidden;

      if (shouldShow) {
        profileMenu.classList.remove("hidden");
        // Let it paint, then animate in
        requestAnimationFrame(() => {
          profileMenu.classList.remove("opacity-0", "scale-95");
          profileMenu.classList.add("opacity-100", "scale-100");
        });
        profileButton.setAttribute("aria-expanded", "true");
      } else {
        profileMenu.classList.remove("opacity-100", "scale-100");
        profileMenu.classList.add("opacity-0", "scale-95");
        profileButton.setAttribute("aria-expanded", "false");
        // Hide after animation
        setTimeout(() => {
          profileMenu.classList.add("hidden");
        }, 150);
      }
    };

    profileButton.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleProfile();
    });

    // Status submenu toggle
    const statusToggle = document.getElementById("status-toggle");
    const statusMenu = document.getElementById("status-menu");
    const statusIndicator = document.getElementById("status-indicator");
    const statusDot = statusIndicator?.querySelector(".status-dot");
    const statusLabel = statusIndicator?.querySelector(".status-label");

    if (statusToggle && statusMenu) {
      statusToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        statusMenu.classList.toggle("hidden");
      });

      const statusButtons = statusMenu.querySelectorAll("button[data-status]");
      const config = {
        online: { label: "Online", dotClass: "bg-green-400" },
        busy: { label: "Busy", dotClass: "bg-yellow-400" },
        away: { label: "Away", dotClass: "bg-gray-400" },
        sleep: { label: "Sleep", dotClass: "bg-purple-400" },
      };

      statusButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const key = btn.getAttribute("data-status");
          const cfg = key ? config[key] : null;
          if (cfg && statusDot && statusLabel) {
            statusLabel.textContent = cfg.label;
            statusDot.className = "status-dot h-2 w-2 rounded-full " + cfg.dotClass;
          }
          statusMenu.classList.add("hidden");
        });
      });
    }

    // Close when clicking anywhere else on the document
    document.addEventListener("click", (e) => {
      if (!profileMenu.classList.contains("hidden")) {
        const target = e.target;
        if (!profileMenu.contains(target) && target !== profileButton) {
          toggleProfile(false);
        }
      }
    });
  }
}

window.addEventListener("DOMContentLoaded", loadNavbar);
