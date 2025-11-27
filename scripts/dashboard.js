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

  // Simple infinite-style feed loading
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
          <button class="text-xs px-3 py-1 border border-gray-700 rounded-md hover:border-gray-500">View</button>
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
  }
});
