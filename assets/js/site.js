(() => {
  const nav = document.querySelector(".site-nav");
  const toggle = document.querySelector(".menu-toggle");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("open", !expanded);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 1024) {
          toggle.setAttribute("aria-expanded", "false");
          nav.classList.remove("open");
        }
      });
    });
  }

  const currentPath = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".site-nav a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === currentPath || (currentPath === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });

  const yearTarget = document.querySelector("[data-year]");
  if (yearTarget) {
    yearTarget.textContent = String(new Date().getFullYear());
  }

  const bookingDate = document.querySelector("#booking-date");
  if (bookingDate) {
    const today = new Date();
    bookingDate.min = today.toISOString().split("T")[0];
  }

  document.querySelectorAll("[data-demo-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const feedback = form.querySelector(".form-feedback");
      if (!feedback) {
        return;
      }

      if (form.id === "booking-form") {
        const dateInput = form.querySelector("#booking-date");
        if (dateInput && dateInput.value) {
          const picked = new Date(`${dateInput.value}T00:00:00`);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (picked < today) {
            feedback.className = "form-feedback error";
            feedback.textContent = "Booking date cannot be in the past.";
            return;
          }
        }
      }

      feedback.className = "form-feedback success";
      feedback.textContent = "Thank you. This is a demo form; connect it to email or WhatsApp for production enquiries.";
      form.reset();

      if (form.id === "booking-form" && bookingDate) {
        const today = new Date();
        bookingDate.min = today.toISOString().split("T")[0];
      }
    });
  });

  const filterButtons = document.querySelectorAll("[data-filter]");
  const menuItems = document.querySelectorAll(".menu-item[data-category]");

  if (filterButtons.length && menuItems.length) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const category = button.dataset.filter;
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        menuItems.forEach((item) => {
          const matches = category === "all" || item.dataset.category === category;
          item.style.display = matches ? "flex" : "none";
        });
      });
    });
  }

  const revealTargets = document.querySelectorAll(
    ".panel-content, .card, .menu-item, .photo-card, .hero-card, .statement-card, .section-title, .section-lead"
  );

  revealTargets.forEach((node) => node.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -28px 0px",
      }
    );

    revealTargets.forEach((target) => observer.observe(target));
  } else {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
  }
})();
