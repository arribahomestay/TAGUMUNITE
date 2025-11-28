// Dashboard page specific JS
console.log("dashboard.js loaded");

window.addEventListener("DOMContentLoaded", () => {
  const showMoreBtn = document.getElementById("show-more-issues");
  const moreIssues = document.getElementById("more-issues");

  if (showMoreBtn && moreIssues) {
    let expanded = false;

    const updateLabel = () => {
      showMoreBtn.textContent = expanded ? "Show less" : "Show more";
    };

    updateLabel();

    showMoreBtn.addEventListener("click", () => {
      expanded = !expanded;
      if (expanded) {
        moreIssues.classList.remove("hidden");
      } else {
        moreIssues.classList.add("hidden");
      }
      updateLabel();
    });
  }

  // Simple infinite-style feed loading + view interactions
  const feedContainer = document.getElementById("dashboard-feed");
  const feedList = document.getElementById("feed-list");

  if (feedContainer && feedList) {
    const samples = [
      {
        title: "Overflowing garbage bins in Zone 3",
        reporter: "Carlo P.",
        time: "1 h ago",
        body:
          "Garbage bins along Purok 5 are overflowing and attracting stray animals. Requesting earlier pickup.",
        tags: ["Waste", "Medium priority"],
        color: "bg-red-500",
      },
      {
        title: "Broken pedestrian crossing signal",
        reporter: "Liza M.",
        time: "2 h ago",
        body:
          "The walk signal at the main boulevard crossing is stuck on red. People are crossing without guidance.",
        tags: ["Traffic", "High priority"],
        color: "bg-blue-500",
      },
      {
        title: "Flooded sidewalk after heavy rain",
        reporter: "Mark R.",
        time: "3 h ago",
        body:
          "Water accumulates in front of the public market entrance; drains might be clogged.",
        tags: ["Flooding", "Medium priority"],
        color: "bg-indigo-500",
      },
      {
        title: "Stray dogs near elementary school",
        reporter: "Ana K.",
        time: "4 h ago",
        body:
          "Several stray dogs are roaming near the school gate during dismissal time, worrying parents.",
        tags: ["Safety", "Low priority"],
        color: "bg-yellow-400",
      },
      {
        title: "Damaged playground slide",
        reporter: "Joey T.",
        time: "5 h ago",
        body:
          "The metal slide in Children\'s Park has a sharp edge; kids already got minor scratches.",
        tags: ["Parks", "High priority"],
        color: "bg-pink-500",
      },
      {
        title: "Noisy karaoke past midnight",
        reporter: "Rhea G.",
        time: "7 h ago",
        body:
          "A house in Purok 2 plays loud karaoke almost every night past midnight.",
        tags: ["Noise", "Low priority"],
        color: "bg-teal-500",
      },
      {
        title: "Leaning electric post",
        reporter: "Fernando V.",
        time: "9 h ago",
        body:
          "An electric post near the tricycle terminal is slightly leaning toward the road.",
        tags: ["Utilities", "High priority"],
        color: "bg-purple-500",
      },
      {
        title: "Clogged drainage in alley",
        reporter: "John C.",
        time: "11 h ago",
        body:
          "When it rains, water quickly builds up in the small alley beside the pharmacy.",
        tags: ["Drainage", "Medium priority"],
        color: "bg-green-500",
      },
    ];

    let index = 0;

    const makeCard = (item) => {
      const wrapper = document.createElement("div");
      wrapper.className = "border border-gray-700 rounded-md p-3 bg-gray-900";
      wrapper.innerHTML = `
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="h-6 w-6 rounded-full ${item.color}" aria-hidden="true"></span>
            <div>
              <p class="font-medium">${item.title}</p>
              <p class="text-xs text-gray-400">Reported by <span class="text-gray-200">${item.reporter}</span> • ${item.time}</p>
            </div>
          </div>
          <button class="dashboard-view-btn text-xs px-3 py-1 border border-gray-700 rounded-md hover:border-gray-500">View</button>
        </div>
        <p class="text-gray-300 mb-2">${item.body}</p>
        <div class="flex items-center gap-3 text-xs text-gray-400">
          ${item.tags
            .map(
              (t) => `<span class="px-1.5 py-0.5 rounded border border-gray-700">${t}</span>`
            )
            .join("")}
        </div>
      `;
      return wrapper;
    };

    const loadMore = () => {
      // Load up to 2 cards per batch
      let added = 0;
      while (index < samples.length && added < 2) {
        feedList.appendChild(makeCard(samples[index]));
        index += 1;
        added += 1;
      }
    };

    // Initial batch
    loadMore();

    feedContainer.addEventListener("scroll", () => {
      const { scrollTop, scrollHeight, clientHeight } = feedContainer;
      if (scrollTop + clientHeight >= scrollHeight - 80) {
        loadMore();
      }
    });

    // View button handling using event delegation
    const modal = document.getElementById("report-detail-modal");
    const titleEl = document.getElementById("report-detail-title");
    const metaEl = document.getElementById("report-detail-meta");
    const bodyEl = document.getElementById("report-detail-body");
    const tagsEl = document.getElementById("report-detail-tags");
    const commentsEl = document.getElementById("report-detail-comments");
    const commentForm = document.getElementById("report-detail-comment-form");
    const commentInput = document.getElementById("report-detail-comment-input");
    const closeBtn = document.getElementById("report-detail-close");
    const closeBtn2 = document.getElementById("report-detail-close-secondary");
    const scheduleBtn = document.getElementById("report-detail-schedule");

    const openModal = (card) => {
      if (!modal || !card) return;

      const title = card.querySelector("p.font-medium")?.textContent || "Report";
      const meta = card.querySelector("p.text-xs")?.textContent || "";
      const body = card.querySelector("p.text-gray-300")?.textContent || "";
      const tagSpans = card.querySelectorAll("div.flex.items-center.gap-3 span");

      titleEl.textContent = title;
      metaEl.textContent = meta;
      bodyEl.textContent = body;

      if (tagsEl) {
        tagsEl.innerHTML = "";
        tagSpans.forEach((t) => {
          const span = document.createElement("span");
          span.className = "px-1.5 py-0.5 rounded border border-gray-700";
          span.textContent = t.textContent || "";
          tagsEl.appendChild(span);
        });
      }

      if (commentsEl) {
        commentsEl.innerHTML = '<p class="text-[11px] text-gray-500">No comments yet. Be the first to reply to this report.</p>';
      }

      modal.classList.remove("hidden");
    };

    const closeModal = () => {
      modal?.classList.add("hidden");
    };

    feedList.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const btn = target.closest(".dashboard-view-btn");
      if (!btn) return;
      const card = btn.closest(".border.border-gray-700.rounded-md.p-3.bg-gray-900");
      if (card) {
        openModal(card);
      }
    });

    closeBtn?.addEventListener("click", closeModal);
    closeBtn2?.addEventListener("click", closeModal);

    modal?.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    scheduleBtn?.addEventListener("click", () => {
      // For now, just navigate to schedules page. Later this could prefill data.
      window.location.href = "../PAGES/schedules.html";
    });

    // Comment posting
    if (commentForm && commentInput && commentsEl) {
      commentForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = commentInput.value.trim();
        if (!text) return;

        // Clear "no comments" message if present
        if (commentsEl.firstElementChild && commentsEl.firstElementChild.tagName === "P" && commentsEl.firstElementChild.textContent?.includes("No comments")) {
          commentsEl.innerHTML = "";
        }

        const row = document.createElement("div");
        row.className = "flex items-start gap-2";
        row.innerHTML = `
          <div class="h-6 w-6 rounded-full bg-gray-400 flex items-center justify-center text-[10px] font-semibold">U</div>
          <div class="min-w-0">
            <p class="text-[11px] text-gray-200 mb-0.5"><span class="font-semibold">You</span>  b7 just now</p>
            <p class="text-xs text-gray-100"></p>
          </div>
        `;
        row.querySelector("p.text-xs").textContent = text;
        commentsEl.appendChild(row);

        commentInput.value = "";
        commentsEl.scrollTop = commentsEl.scrollHeight;
      });
    }
  }
});
