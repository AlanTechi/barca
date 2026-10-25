(function () {
  const config = window.SITE_CONFIG || {};
  const walletEl = document.getElementById("wallet-display");
  const copyBtn = document.getElementById("copy-wallet");
  const copyFeedback = document.getElementById("copy-feedback");
  const yearEl = document.getElementById("year");
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.getElementById("site-nav");
  const contactForm = document.getElementById("contact-form");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const address =
    typeof config.walletAddress === "string" && config.walletAddress.trim()
      ? config.walletAddress.trim()
      : null;

  if (walletEl) {
    walletEl.textContent = address || "Set WALLET_ADDRESS in .env and run npm run config";
  }

  if (copyBtn && address) {
    copyBtn.addEventListener("click", async function () {
      try {
        await navigator.clipboard.writeText(address);
        if (copyFeedback) {
          copyFeedback.hidden = false;
          window.setTimeout(function () {
            copyFeedback.hidden = true;
          }, 2500);
        }
      } catch {
        window.prompt("Copy this address:", address);
      }
    });
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      const open = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    siteNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      alert(
        "Demo only — connect this form to your backend or a service like Formspree."
      );
    });
  }
})();
