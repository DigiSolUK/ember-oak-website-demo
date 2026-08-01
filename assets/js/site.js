(() => {
  const introLoader = document.querySelector(".intro-loader");
  if (introLoader) {
    window.setTimeout(() => {
      introLoader.classList.add("is-complete");
    }, 2600);
  }

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
        if (window.innerWidth <= 980) {
          toggle.setAttribute("aria-expanded", "false");
          nav.classList.remove("open");
        }
      });
    });
  }

  const currentPath = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".site-nav a").forEach((a) => {
    if (a.getAttribute("href") === currentPath) {
      a.classList.add("active");
    }
  });

  const yearTarget = document.querySelector("[data-year]");
  if (yearTarget) {
    yearTarget.textContent = String(new Date().getFullYear());
  }

  const formatGBP = (value) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(Number.isFinite(value) ? value : 0);

  const invoiceTotal = document.querySelector("#invoice-total");
  const netPaid = document.querySelector("#net-paid");
  const commissionRate = document.querySelector("#commission-rate");
  const calcNet = document.querySelector("#calc-net");
  const calcCommission = document.querySelector("#calc-commission");
  const calcUnallocated = document.querySelector("#calc-unallocated");
  const calcSage = document.querySelector("#calc-sage");

  const updateCalculator = () => {
    if (!invoiceTotal || !netPaid || !commissionRate) {
      return;
    }

    const gross = Number(invoiceTotal.value) || 0;
    const paid = Number(netPaid.value) || 0;
    const rate = Number(commissionRate.value) || 0;
    const commission = gross * (rate / 100);
    const expectedNet = gross - commission;
    const difference = paid - expectedNet;

    calcNet.textContent = formatGBP(expectedNet);
    calcCommission.textContent = formatGBP(commission);
    calcUnallocated.textContent = formatGBP(difference);
    calcSage.textContent = Math.abs(difference) <= 1 ? "Invoice can be settled" : "Manual review needed";
  };

  [invoiceTotal, netPaid, commissionRate].forEach((input) => {
    if (input) {
      input.addEventListener("input", updateCalculator);
    }
  });
  updateCalculator();

  document.querySelectorAll("[data-demo-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const feedback = form.querySelector(".form-feedback");

      if (form.matches("[data-whatsapp-form]")) {
        const phone = form.dataset.whatsappPhone || "447766307028";
        const name = form.querySelector("#quote-name")?.value.trim() || "Not provided";
        const customerPhone = form.querySelector("#quote-phone")?.value.trim() || "Not provided";
        const email = form.querySelector("#quote-email")?.value.trim() || "Not provided";
        const service = form.querySelector("#quote-service")?.value || "Not selected";
        const details = form.querySelector("#quote-message")?.value.trim() || "Not provided";
        const message = [
          "New Indigo Electrical enquiry",
          "",
          `Name: ${name}`,
          `Phone: ${customerPhone}`,
          `Email: ${email}`,
          `Service: ${service}`,
          `Details: ${details}`,
        ].join("\n");

        if (feedback) {
          feedback.className = "form-feedback success";
          feedback.textContent = "Opening WhatsApp with your enquiry details.";
        }

        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
        return;
      }

      if (feedback) {
        feedback.className = "form-feedback success";
        feedback.textContent = "Saved in demo mode. Production would write this to the CRM and audit log.";
      }
    });
  });

  document.querySelectorAll("[data-demo-action]").forEach((button) => {
    button.addEventListener("click", () => {
      button.textContent = button.dataset.demoLabel || "Demo sync queued";
      button.classList.add("btn-success");
      button.setAttribute("aria-live", "polite");
    });
  });
})();
