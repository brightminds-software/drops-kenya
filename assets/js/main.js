/* ==========================================================================
   DROPS-KENYA — ADVANCED WEB-APP JS
   Scroll animations, audio equalizer, toast system, scroll progress
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Drops-Kenya Web App loaded!");

  initScrollProgress();
  initScrollAnimations();
  initNavbar();
  initShareButton();
  initAudioPlayers();
  initContactForm();
  initFooterYear();
});

/* ===== TOAST NOTIFICATION SYSTEM ===== */
function showToast(message, type = "info", duration = 3500) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const icons = {
    success: "fa-circle-check",
    error: "fa-circle-xmark",
    info: "fa-circle-info",
  };

  toast.innerHTML = `
    <i class="fas ${icons[type] || icons.info}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Auto-remove
  setTimeout(() => {
    toast.classList.add("hide");
    toast.addEventListener("animationend", () => toast.remove());
  }, duration);
}

/* ===== SCROLL PROGRESS BAR ===== */
function initScrollProgress() {
  const bar = document.getElementById("scrollProgress");
  if (!bar) return;

  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = `${progress}%`;
        ticking = false;
      });
      ticking = true;
    }
  });
}

/* ===== SCROLL ANIMATIONS (Intersection Observer) ===== */
function initScrollAnimations() {
  const elements = document.querySelectorAll(".animate-on-scroll");
  if (!elements.length) return;

  // Check for reduced motion preference
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger the animation slightly for sibling elements
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add("is-visible");
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -60px 0px",
    }
  );

  // Add stagger delays to grouped elements
  const dropsList = document.querySelectorAll(".drops-list .animate-on-scroll");
  dropsList.forEach((el, i) => {
    el.dataset.delay = i * 80;
  });

  const blogCards = document.querySelectorAll(".blog-grid .animate-on-scroll");
  blogCards.forEach((el, i) => {
    el.dataset.delay = i * 100;
  });

  const testimonialCards = document.querySelectorAll(".testimonials-grid .animate-on-scroll");
  testimonialCards.forEach((el, i) => {
    el.dataset.delay = i * 100;
  });

  elements.forEach((el) => observer.observe(el));
}

/* ===== NAVBAR ===== */
function initNavbar() {
  const toggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navbar = document.querySelector(".navbar");

  if (!toggle || !navLinks) return;

  // Toggle menu
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const isActive = navLinks.classList.toggle("active");
    toggle.classList.toggle("active");
    toggle.setAttribute("aria-expanded", isActive);

    const icon = toggle.querySelector("i");
    if (icon) {
      icon.classList.toggle("fa-bars", !isActive);
      icon.classList.toggle("fa-times", isActive);
    }
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!navLinks.contains(e.target) && !toggle.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on link click
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  function closeMenu() {
    navLinks.classList.remove("active");
    toggle.classList.remove("active");
    toggle.setAttribute("aria-expanded", "false");
    const icon = toggle.querySelector("i");
    if (icon) {
      icon.classList.add("fa-bars");
      icon.classList.remove("fa-times");
    }
  }

  // Navbar scroll shadow
  let scrollTicking = false;
  window.addEventListener("scroll", () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        if (navbar) {
          navbar.classList.toggle("scrolled", window.scrollY > 30);
        }
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  });
}

/* ===== SHARE BUTTON ===== */
function initShareButton() {
  const shareBtn = document.getElementById("share-btn");
  const popup = document.getElementById("copy-popup");

  if (!shareBtn) return;

  shareBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const shareData = {
      title: "Drops-Kenya",
      text: "Check out Drops-Kenya for premium DJ drops! 🎧🇰🇪",
      url: "https://drops-kenya.vercel.app",
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        showToast("Shared successfully!", "success");
      } else {
        await navigator.clipboard.writeText(shareData.url);

        // Show legacy popup
        if (popup) {
          popup.classList.add("show");
          setTimeout(() => popup.classList.remove("show"), 2500);
        }

        showToast("Link copied to clipboard!", "success");
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        showToast("Could not share. Try copying the URL.", "error");
      }
    }
  });
}

/* ===== AUDIO PLAYERS WITH EQUALIZER ===== */
function initAudioPlayers() {
  const playButtons = document.querySelectorAll(".play-btn[data-audio]");
  if (!playButtons.length) return;

  let currentlyPlaying = null;

  playButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const audioId = button.getAttribute("data-audio");
      const audio = document.getElementById(audioId);
      if (!audio) return;

      const isCurrentlyPlaying = button.classList.contains("playing");

      // Stop everything first
      stopAll();

      if (!isCurrentlyPlaying) {
        // Play this track
        audio.play().then(() => {
          button.classList.add("playing");
          currentlyPlaying = { button, audio };
        }).catch((err) => {
          console.warn("Audio play failed:", err);
          showToast("Could not play audio. Try again.", "error");
        });
      }
    });

    // When audio ends naturally
    const audioId = button.getAttribute("data-audio");
    const audio = document.getElementById(audioId);
    if (audio) {
      audio.addEventListener("ended", () => {
        button.classList.remove("playing");
        if (currentlyPlaying?.button === button) {
          currentlyPlaying = null;
        }
      });

      // Handle audio errors
      audio.addEventListener("error", () => {
        button.classList.remove("playing");
        showToast("Audio file could not be loaded.", "error");
      });
    }
  });

  function stopAll() {
    playButtons.forEach((btn) => {
      btn.classList.remove("playing");
      const aId = btn.getAttribute("data-audio");
      const a = document.getElementById(aId);
      if (a && !a.paused) {
        a.pause();
        a.currentTime = 0;
      }
    });
    currentlyPlaying = null;
  }

  // Stop audio when page visibility changes (tab switch)
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && currentlyPlaying) {
      stopAll();
    }
  });
}

/* ===== CONTACT FORM ===== */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const message = document.getElementById("message");
  const charCount = document.getElementById("charCount");
  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const messageError = document.getElementById("messageError");

  const maxChars = 100;

  // Character countdown
  if (message && charCount) {
    message.addEventListener("input", () => {
      const remaining = maxChars - message.value.length;
      charCount.textContent = `${remaining} characters remaining`;

      if (remaining <= 0) {
        charCount.style.color = "#ef4444";
        charCount.style.fontWeight = "600";
      } else if (remaining <= 20) {
        charCount.style.color = "#f59e0b";
        charCount.style.fontWeight = "500";
      } else {
        charCount.style.color = "";
        charCount.style.fontWeight = "";
      }

      // Clear error on typing
      clearFieldError(message, messageError);
    });
  }

  // Real-time validation on blur
  if (name) {
    name.addEventListener("blur", () => {
      if (name.value.trim()) {
        name.classList.add("success-input");
      }
    });
    name.addEventListener("input", () => clearFieldError(name, nameError));
  }

  if (email) {
    email.addEventListener("blur", () => {
      if (email.value.trim() && isValidEmail(email.value)) {
        email.classList.add("success-input");
      }
    });
    email.addEventListener("input", () => clearFieldError(email, emailError));
  }

  // Form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    // Reset
    [nameError, emailError, messageError].forEach((el) => {
      if (el) el.textContent = "";
    });
    [name, email, message].forEach((input) => {
      input?.classList.remove("error-input");
    });

    // Validate name
    if (!name?.value.trim()) {
      showFieldError(name, nameError, "Name is required");
      valid = false;
    }

    // Validate email
    if (!email?.value.trim()) {
      showFieldError(email, emailError, "Email is required");
      valid = false;
    } else if (!isValidEmail(email.value)) {
      showFieldError(email, emailError, "Please enter a valid email");
      valid = false;
    }

    // Validate message
    if (!message?.value.trim()) {
      showFieldError(message, messageError, "Message is required");
      valid = false;
    } else if (message.value.length > maxChars) {
      showFieldError(message, messageError, `Max ${maxChars} characters`);
      valid = false;
    }

    if (!valid) {
      showToast("Please fix the errors above.", "error");
      return;
    }

    // Build WhatsApp message
    const whatsappMsg = [
      "📩 *New Inquiry from Drops-Kenya*",
      "",
      `👤 *Name:* ${name.value.trim()}`,
      `📧 *Email:* ${email.value.trim()}`,
      `💬 *Message:* ${message.value.trim()}`,
    ].join("%0A");

    const whatsappURL = `https://wa.me/254745736283?text=${whatsappMsg}`;
    window.open(whatsappURL, "_blank");

    // Success feedback
    showToast("Message sent! Opening WhatsApp...", "success");

    // Animate submit button
    const submitBtn = form.querySelector(".submit-btn");
    if (submitBtn) {
      const originalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
      submitBtn.style.background = "linear-gradient(135deg, #10b981, #059669)";
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = originalHTML;
        submitBtn.style.background = "";
        submitBtn.disabled = false;
      }, 2500);
    }

    // Reset form
    form.reset();
    if (charCount) {
      charCount.textContent = `${maxChars} characters remaining`;
      charCount.style.color = "";
      charCount.style.fontWeight = "";
    }
    [name, email, message].forEach((input) => {
      input?.classList.remove("success-input", "error-input");
    });
  });

  // Helpers
  function showFieldError(input, errorEl, msg) {
    if (errorEl) errorEl.textContent = `⚠️ ${msg}`;
    input?.classList.add("error-input");
    input?.classList.remove("success-input");
  }

  function clearFieldError(input, errorEl) {
    if (errorEl) errorEl.textContent = "";
    input?.classList.remove("error-input");
  }

  function isValidEmail(emailStr) {
    return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(emailStr);
  }
}

/* ===== FOOTER YEAR ===== */
function initFooterYear() {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}