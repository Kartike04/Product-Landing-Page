/* =========================================================
   AeroFlask landing page - JavaScript
   Sections:
   1. Data (variants)
   2. State
   3. DOM references
   4. Helpers
   5. Variants + price + quantity logic
   6. Mobile navigation
   7. Form validation + success message
   8. Init
   ========================================================= */

(function () {
  "use strict";

  /* ---------- 1. Data ---------- */
  var VARIANTS = [
    { id: "500", label: "500 ml", price: 799, scale: 0.85 },
    { id: "750", label: "750 ml", price: 999, scale: 0.95 },
    { id: "1000", label: "1 L", price: 1299, scale: 1.05 }
  ];

  var MIN_QTY = 1;
  var MAX_QTY = 10;

  /* ---------- 2. State ---------- */
  var state = {
    variantId: VARIANTS[0].id,
    quantity: 1
  };

  /* ---------- 3. DOM references ---------- */
  var variantList = document.getElementById("variantList");
  var unitPriceEl = document.getElementById("unitPrice");
  var totalPriceEl = document.getElementById("totalPrice");
  var qtyInput = document.getElementById("qtyInput");
  var qtyMinus = document.getElementById("qtyMinus");
  var qtyPlus = document.getElementById("qtyPlus");
  var bottleGroup = document.getElementById("bottleGroup");
  var summaryEl = document.getElementById("selectionSummary");

  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");

  var form = document.getElementById("enquiryForm");
  var successBox = document.getElementById("successMessage");
  var successText = document.getElementById("successText");

  /* ---------- 4. Helpers ---------- */
  function formatINR(amount) {
    return "\u20B9" + amount.toLocaleString("en-IN");
  }

  function getSelectedVariant() {
    for (var i = 0; i < VARIANTS.length; i++) {
      if (VARIANTS[i].id === state.variantId) return VARIANTS[i];
    }
    return VARIANTS[0];
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  /* ---------- 5. Variants + price + quantity ---------- */
  function renderVariants() {
    variantList.innerHTML = "";
    VARIANTS.forEach(function (v, index) {
      var label = document.createElement("label");
      label.className = "variant";

      var input = document.createElement("input");
      input.type = "radio";
      input.name = "variant";
      input.value = v.id;
      input.checked = index === 0;

      var text = document.createElement("span");
      text.textContent = v.label;

      label.appendChild(input);
      label.appendChild(text);
      variantList.appendChild(label);
    });
  }

  function updateUI() {
    var variant = getSelectedVariant();
    var total = variant.price * state.quantity;

    unitPriceEl.textContent = formatINR(variant.price);
    totalPriceEl.textContent = formatINR(total);
    qtyInput.value = state.quantity;

    qtyMinus.disabled = state.quantity <= MIN_QTY;
    qtyPlus.disabled = state.quantity >= MAX_QTY;

    bottleGroup.style.transform = "scale(" + variant.scale + ")";

    summaryEl.textContent =
      "Selected: " + variant.label + " \u00D7 " + state.quantity + " = " + formatINR(total);
  }

  function setQuantity(value) {
    var n = parseInt(value, 10);
    if (isNaN(n)) n = MIN_QTY;
    state.quantity = clamp(n, MIN_QTY, MAX_QTY);
    updateUI();
  }

  function bindProductEvents() {
    variantList.addEventListener("change", function (e) {
      if (e.target && e.target.name === "variant") {
        state.variantId = e.target.value;
        updateUI();
      }
    });

    qtyMinus.addEventListener("click", function () {
      setQuantity(state.quantity - 1);
    });

    qtyPlus.addEventListener("click", function () {
      setQuantity(state.quantity + 1);
    });

    qtyInput.addEventListener("change", function () {
      setQuantity(qtyInput.value);
    });
  }

  /* ---------- 6. Mobile navigation ---------- */
  function closeNav() {
    mainNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  function bindNavEvents() {
    navToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close menu after clicking a link
    mainNav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });

    // Reset when resizing up to desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 820) closeNav();
    });
  }

  /* ---------- 7. Form validation ---------- */
  var validators = {
    name: function (v) {
      v = v.trim();
      if (!v) return "Please enter your name.";
      if (v.length < 2) return "Name must be at least 2 characters.";
      if (!/^[A-Za-z][A-Za-z .'-]*$/.test(v)) return "Name can only contain letters and spaces.";
      return "";
    },
    email: function (v) {
      v = v.trim();
      if (!v) return "Please enter your email.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Please enter a valid email address.";
      return "";
    },
    phone: function (v) {
      v = v.trim();
      if (!v) return "Please enter your phone number.";
      if (!/^[6-9]\d{9}$/.test(v)) return "Enter a valid 10-digit mobile number.";
      return "";
    },
    message: function (v) {
      v = v.trim();
      if (!v) return "Please write a short message.";
      if (v.length < 10) return "Message must be at least 10 characters.";
      return "";
    }
  };

  function validateField(name) {
    var input = form.elements[name];
    var errorEl = document.getElementById(name + "Error");
    var message = validators[name](input.value);

    errorEl.textContent = message;
    input.parentElement.classList.toggle("invalid", Boolean(message));
    input.setAttribute("aria-invalid", message ? "true" : "false");

    return !message;
  }

  function validateForm() {
    var firstInvalid = null;
    var valid = true;

    Object.keys(validators).forEach(function (name) {
      if (!validateField(name)) {
        valid = false;
        if (!firstInvalid) firstInvalid = form.elements[name];
      }
    });

    if (firstInvalid) firstInvalid.focus();
    return valid;
  }

  function bindFormEvents() {
    // Live validation once the user leaves a field / types in an invalid one
    Object.keys(validators).forEach(function (name) {
      var input = form.elements[name];

      input.addEventListener("blur", function () {
        validateField(name);
      });

      input.addEventListener("input", function () {
        if (input.parentElement.classList.contains("invalid")) validateField(name);
        successBox.hidden = true;
      });
    });

    // Only digits in phone
    form.elements.phone.addEventListener("input", function (e) {
      e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      successBox.hidden = true;

      if (!validateForm()) return;

      var variant = getSelectedVariant();
      var total = variant.price * state.quantity;
      var firstName = form.elements.name.value.trim().split(" ")[0];

      successText.textContent =
        "Thanks " + firstName + "! Your enquiry for " + state.quantity + " \u00D7 " +
        variant.label + " (" + formatINR(total) + ") has been submitted. We will contact you soon.";
      successBox.hidden = false;

      form.reset();
      Object.keys(validators).forEach(function (name) {
        form.elements[name].removeAttribute("aria-invalid");
        form.elements[name].parentElement.classList.remove("invalid");
      });

      successBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  /* ---------- 8. Init ---------- */
  function init() {
    renderVariants();
    bindProductEvents();
    bindNavEvents();
    bindFormEvents();
    updateUI();
    document.getElementById("year").textContent = new Date().getFullYear();
  }

  init();
})();
