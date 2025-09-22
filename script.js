const toggle = document.getElementById("menuToggle");
const nav = document.getElementById("navLinks");

// 🟠 فتح / قفل القائمة للموبايل
toggle.addEventListener("click", () => {
  nav.classList.toggle("show");
});

// ================= تحميل الأوامر من JSON =================
fetch("commands.json")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("commands-list");
    const showMoreBtn = document.createElement("button");
    showMoreBtn.id = "showMoreBtn";
    showMoreBtn.textContent = "Show More";
    container.parentNode.insertBefore(showMoreBtn, container.nextSibling);
    let allCommands = [];
    let categoryMap = {};

    Object.entries(data).forEach(([category, commands]) => {
      categoryMap[category] = [];

      commands.forEach((cmd) => {
        const div = document.createElement("div");
        div.className = `card command ${category}`;
        div.innerHTML = `
          <h3>.${cmd.name}</h3>
          <p>${cmd.description || "No description provided."}</p>
        `;
        container.appendChild(div);
        allCommands.push(div);
        categoryMap[category].push(div);
      });
    });

    // 🟠 زر Show More / Less
    // 🟠 زر Show More / Less



    showMoreBtn.classList.add("show-more-card");


    let currentFilter = "all";
    let expanded = false;

    // 🟠 فلتر مبدئي عند فتح الصفحة
    applyFilter("all");

    // زر Show More / Less
    showMoreBtn.addEventListener("click", () => {
      expanded = !expanded;
      const cmds = currentFilter === "all" ? allCommands : categoryMap[currentFilter];

      if (expanded) {
        cmds.forEach(c => c.classList.remove("hidden"));
        showMoreBtn.textContent = "Show Less";
      } else {
        cmds.forEach((c, i) => {
          if (i >= 4) c.classList.add("hidden");
        });
        showMoreBtn.textContent = "Show More";
      }

      toggleShowMoreVisibility(cmds);
    });

    // ================= فلترة الأوامر =================
    const filterBtns = document.querySelectorAll(".filter button");

    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        currentFilter = btn.getAttribute("data-filter");
        expanded = false; 
        showMoreBtn.textContent = "Show More";

        applyFilter(currentFilter);
      });
    });

    // 🟠 دوال مساعدة
    function applyFilter(filter) {
      let visibleCount = 0;
      let cmds = filter === "all" ? allCommands : categoryMap[filter];

      allCommands.forEach(cmd => {
        if (filter === "all" || cmd.classList.contains(filter)) {
          if (visibleCount < 4) {
            cmd.classList.remove("hidden");
          } else {
            cmd.classList.add("hidden");
          }
          visibleCount++;
        } else {
          cmd.classList.add("hidden");
        }
      });

      toggleShowMoreVisibility(cmds);
    }

    function toggleShowMoreVisibility(cmds) {
      if (cmds.length <= 4) {
        showMoreBtn.style.display = "none";
      } else {
        showMoreBtn.style.display = "block";
      }
    }
  })
  .catch(err => console.error("Error loading commands:", err));




// ================= Smooth Scroll =================
function smoothScroll(target, duration = 800) {
  const start = window.pageYOffset;
  const end = document.querySelector(target).offsetTop - 60;
  const distance = end - start;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutQuad(timeElapsed, start, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}

document.querySelectorAll("nav a[href^='#'], .btn[href^='#']").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const target = link.getAttribute("href");
    if (target.startsWith("#")) {
      smoothScroll(target);
      nav.classList.remove("show");
    }
  });
});

// ================= Scroll Spy =================
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(sec => {
    const secTop = sec.offsetTop - 80;
    if (pageYOffset >= secTop) current = sec.getAttribute("id");
  });

  navLinks.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === "#" + current);
  });
});
