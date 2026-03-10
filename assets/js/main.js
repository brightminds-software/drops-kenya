// ===== DROPS-KENYA PROFESSIONAL JS =====
// All functionality consolidated, error colors fixed, smooth animations

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Drops-Kenya loaded successfully!");
  
  // Initialize all modules
  initNavbar();
  initShareButton();
  initAudioPlayers();
  initContactForm();
  initFooterYear();
});

// ===== NAVBAR MODULE =====
function initNavbar() {
  const toggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navbar = document.querySelector(".navbar");

  if (!toggle || !navLinks) return;

  // Toggle menu open/close
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    navLinks.classList.toggle("active");
    toggle.classList.toggle("active");
    
    // Icon swap
    const icon = toggle.querySelector("i");
    if (icon) {
      icon.classList.toggle("fa-bars");
      icon.classList.toggle("fa-times");
    }
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!navLinks.contains(e.target) && !toggle.contains(e.target)) {
      navLinks.classList.remove("active");
      toggle.classList.remove("active");
      
      const icon = toggle.querySelector("i");
      if (icon) {
        icon.classList.add("fa-bars");
        icon.classList.remove("fa-times");
      }
    }
  });

  // Close menu when clicking a link
  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      toggle.classList.remove("active");
      
      const icon = toggle.querySelector("i");
      if (icon) {
        icon.classList.add("fa-bars");
        icon.classList.remove("fa-times");
      }
    });
  });

  // Navbar scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar?.classList.add("scrolled");
    } else {
      navbar?.classList.remove("scrolled");
    }
  });
}

// ===== SHARE BUTTON MODULE =====
function initShareButton() {
  const popup = document.getElementById('copy-popup');
  const shareBtn = document.getElementById('share-btn');

  if (!shareBtn || !popup) return;

  shareBtn.addEventListener('click', async (event) => {
    event.preventDefault();

    const shareData = {
      title: 'Drops-Kenya',
      text: 'Check out Drops-Kenya for premium DJ drops!',
      url: 'https://drops-kenya.vercel.app'
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        popup.classList.add('show');
        
        setTimeout(() => {
          popup.classList.remove('show');
        }, 3000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  });
}

// ===== AUDIO PLAYERS MODULE =====
function initAudioPlayers() {
  const playButtons = document.querySelectorAll(".play-btn");

  playButtons.forEach(button => {
    button.addEventListener("click", () => {
      const audioId = button.getAttribute("data-audio");
      const audio = document.getElementById(audioId);

      if (!audio) return;

      // Pause all other audios
      document.querySelectorAll("audio").forEach(a => {
        if (a !== audio) {
          a.pause();
          a.currentTime = 0;
        }
      });

      // Reset all buttons
      playButtons.forEach(btn => {
        btn.innerHTML = `<i class="fas fa-play"></i> Play`;
      });

      // Toggle play/pause
      if (audio.paused) {
        audio.play();
        button.innerHTML = `<i class="fas fa-pause"></i> Pause`;
      } else {
        audio.pause();
        button.innerHTML = `<i class="fas fa-play"></i> Play`;
      }

      // Reset button when audio ends
      audio.addEventListener("ended", () => {
        button.innerHTML = `<i class="fas fa-play"></i> Play`;
      });
    });
  });
}

// ===== CONTACT FORM MODULE =====
function initContactForm() {
  const form = document.getElementById("contactForm");
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const message = document.getElementById("message");
  const charCount = document.getElementById("charCount");

  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const messageError = document.getElementById("messageError");

  if (!form) return;

  // Character countdown
  if (message && charCount) {
    message.addEventListener("input", () => {
      const remaining = 100 - message.value.length;
      charCount.textContent = `${remaining} characters remaining`;
      
      if (remaining < 0) {
        charCount.style.color = "#ff6b6b";
        charCount.style.fontWeight = "600";
      } else {
        charCount.style.color = "#a0a8b8";
        charCount.style.fontWeight = "400";
      }
    });
  }

  // Helper function to show error
  function showError(input, errorElement, message) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
    input?.classList.add("error-input");
    input?.classList.remove("success-input");
  }

  // Helper function to clear error
  function clearError(input, errorElement) {
    errorElement.textContent = "";
    errorElement.style.display = "none";
    input?.classList.remove("error-input");
  }

  // Real-time validation on input
  [name, email, message].forEach(input => {
    if (input) {
      input.addEventListener("blur", () => {
        if (input.value.trim() !== "") {
          input.classList.add("success-input");
        }
      });
      
      input.addEventListener("input", () => {
        input.classList.remove("error-input");
        const errorEl = input === name ? nameError : input === email ? emailError : messageError;
        if (errorEl) errorEl.textContent = "";
      });
    }
  });

  // Form validation and WhatsApp send
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let valid = true;

    // Reset errors
    [nameError, emailError, messageError].forEach(el => {
      if (el) el.textContent = "";
    });
    [name, email, message].forEach(input => {
      input?.classList.remove("error-input");
    });

    // Name validation
    if (!name || name.value.trim() === "") {
      showError(name, nameError, "⚠️ Name is required");
      valid = false;
    }

    // Email validation
    if (!email || email.value.trim() === "") {
      showError(email, emailError, "⚠️ Email is required");
      valid = false;
    } else {
      const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,}$/i;
      if (!email.value.match(emailPattern)) {
        showError(email, emailError, "⚠️ Please enter a valid email");
        valid = false;
      }
    }

    // Message validation
    if (!message || message.value.trim() === "") {
      showError(message, messageError, "⚠️ Message is required");
      valid = false;
    } else if (message.value.length > 100) {
      showError(message, messageError, "⚠️ Max 100 characters");
      valid = false;
    }

    if (valid) {
      // Build WhatsApp message
      const whatsappMessage = `📩 New Inquiry from Drops-Kenya Website%0A%0A👤 Name: ${encodeURIComponent(name.value)}%0A📧 Email: ${encodeURIComponent(email.value)}%0A💬 Message: ${encodeURIComponent(message.value)}`;
      const whatsappURL = `https://wa.me/254745736283?text=${whatsappMessage}`;

      // Open WhatsApp
      window.open(whatsappURL, "_blank");

      // Reset form
      form.reset();
      if (charCount) {
        charCount.textContent = "100 characters remaining";
        charCount.style.color = "#a0a8b8";
      }
      [name, email, message].forEach(input => {
        input?.classList.remove("success-input");
      });

      // Show success feedback
      const submitBtn = form.querySelector(".submit-btn");
      if (submitBtn) {
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "✓ Sent!";
        submitBtn.style.background = "#10b981";
        
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.background = "";
        }, 2000);
      }
    }
  });
}

// ===== FOOTER YEAR MODULE =====
function initFooterYear() {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}