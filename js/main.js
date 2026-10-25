(function () {
  const config = window.SITE_CONFIG || {};
  const yearEl = document.getElementById("year");
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.getElementById("site-nav");
  const contactForm = document.getElementById("contact-form");
  const formSuccess = document.getElementById("form-success");

  const paymentIdle = document.getElementById("payment-idle");
  const paymentStepDetails = document.getElementById("payment-step-details");
  const paymentStepPay = document.getElementById("payment-step-pay");
  const paymentStepDone = document.getElementById("payment-step-done");
  const paymentDetailsForm = document.getElementById("payment-details-form");
  const paymentPlanChip = document.getElementById("payment-plan-chip");
  const paymentBackDetails = document.getElementById("payment-back-details");
  const paymentSentBtn = document.getElementById("payment-sent");
  const progressItems = document.querySelectorAll(".payment-progress-item");

  const checkout = {
    planId: "",
    planName: "",
    planAmount: "",
    payerName: "",
    payerEmail: "",
  };

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

  function setProgress(step) {
    progressItems.forEach(function (item) {
      const n = Number(item.getAttribute("data-progress"));
      item.classList.toggle("is-active", n === step);
      item.classList.toggle("is-done", n < step);
    });
  }

  function hideAllPaymentPanes() {
    [paymentIdle, paymentStepDetails, paymentStepPay, paymentStepDone].forEach(
      function (el) {
        if (el) el.hidden = true;
      }
    );
  }

  function showPaymentStep(step) {
    hideAllPaymentPanes();
    setProgress(step);

    if (step === 1 && paymentStepDetails) {
      paymentStepDetails.hidden = false;
    } else if (step === 2 && paymentStepPay) {
      paymentStepPay.hidden = false;
    } else if (step === 3 && paymentStepDone) {
      paymentStepDone.hidden = false;
      progressItems.forEach(function (item) {
        item.classList.add("is-done");
        item.classList.remove("is-active");
      });
    } else if (paymentIdle) {
      paymentIdle.hidden = false;
      setProgress(1);
      progressItems.forEach(function (item) {
        item.classList.remove("is-active", "is-done");
      });
    }
  }

  function formatAmount(amount) {
    const n = Number(amount);
    if (n >= 1000) {
      return "$" + n.toLocaleString("en-US") + " USD";
    }
    return "$" + amount + " USD";
  }

  function startCheckoutFromButton(btn) {
    checkout.planId = btn.getAttribute("data-plan-id") || "";
    checkout.planName = btn.getAttribute("data-plan-name") || "";
    checkout.planAmount = btn.getAttribute("data-plan-amount") || "";

    if (paymentPlanChip) {
      paymentPlanChip.textContent =
        checkout.planName + " — " + formatAmount(checkout.planAmount);
    }

    const nameInput = document.getElementById("payer-name");
    const emailInput = document.getElementById("payer-email");
    if (nameInput) nameInput.value = checkout.payerName;
    if (emailInput) emailInput.value = checkout.payerEmail;

    showPaymentStep(1);

    const section = document.getElementById("payment");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  document.querySelectorAll(".js-start-payment").forEach(function (btn) {
    btn.addEventListener("click", function () {
      startCheckoutFromButton(btn);
    });
  });

  if (paymentDetailsForm) {
    paymentDetailsForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const nameInput = document.getElementById("payer-name");
      const emailInput = document.getElementById("payer-email");
      checkout.payerName = nameInput ? nameInput.value.trim() : "";
      checkout.payerEmail = emailInput ? emailInput.value.trim() : "";

      const summaryName = document.getElementById("summary-name");
      const summaryEmail = document.getElementById("summary-email");
      const summaryPlan = document.getElementById("summary-plan");
      const summaryAmount = document.getElementById("summary-amount");

      if (summaryName) summaryName.textContent = checkout.payerName;
      if (summaryEmail) summaryEmail.textContent = checkout.payerEmail;
      if (summaryPlan) summaryPlan.textContent = checkout.planName;
      if (summaryAmount) {
        summaryAmount.textContent = formatAmount(checkout.planAmount);
      }

      showPaymentStep(2);
    });
  }

  if (paymentBackDetails) {
    paymentBackDetails.addEventListener("click", function () {
      showPaymentStep(1);
    });
  }

  if (paymentSentBtn) {
    paymentSentBtn.addEventListener("click", function () {
      showPaymentStep(3);
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
      contactForm.hidden = true;
      if (formSuccess) {
        formSuccess.hidden = false;
      }
    });
  }
})();
