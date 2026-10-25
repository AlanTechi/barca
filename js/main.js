(function () {
  const config = window.SITE_CONFIG || {};
  const yearEl = document.getElementById("year");
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.getElementById("site-nav");
  const contactForm = document.getElementById("contact-form");
  const formSuccess = document.getElementById("form-success");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const ethEl = document.getElementById("wallet-eth");
  const usdtEl = document.getElementById("wallet-usdt");

  if (ethEl && config.walletEth) {
    ethEl.dataset.address = config.walletEth.trim();
  }
  if (usdtEl && config.walletUsdtEth) {
    usdtEl.dataset.address = config.walletUsdtEth.trim();
  }

  function bindCopy(buttonId, addressId, feedbackId) {
    const btn = document.getElementById(buttonId);
    const addressEl = document.getElementById(addressId);
    const feedback = document.getElementById(feedbackId);
    const address =
      addressEl && addressEl.dataset.address
        ? addressEl.dataset.address.trim()
        : "";

    if (!addressEl) return;

    addressEl.textContent = address || "Payment address unavailable";

    if (!btn || !address) return;

    btn.addEventListener("click", async function () {
      try {
        await navigator.clipboard.writeText(address);
        if (feedback) {
          feedback.hidden = false;
          window.setTimeout(function () {
            feedback.hidden = true;
          }, 2500);
        }
      } catch {
        window.prompt("Copy this address:", address);
      }
    });
  }

  bindCopy("copy-wallet-eth", "wallet-eth", "copy-feedback-eth");
  bindCopy("copy-wallet-usdt", "wallet-usdt", "copy-feedback-usdt");

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
      contactForm.hidden = true;
      if (formSuccess) {
        formSuccess.hidden = false;
      }
    });
  }
})();
