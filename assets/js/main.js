// ===== HEAD SECTION START =====

// Global JS setup
document.addEventListener("DOMContentLoaded", () => {
  console.log("Drops-Kenya site loaded successfully with Inter font and Font Awesome!");
});

// ===== HEAD SECTION END =====




// ===== NAVBAR SECTION START =====

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  // Toggle menu open/close
  toggle.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent immediate close
    navLinks.classList.toggle("active");
    toggle.querySelector("i").classList.toggle("fa-bars");
    toggle.querySelector("i").classList.toggle("fa-times");
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!navLinks.contains(e.target) && !toggle.contains(e.target)) {
      navLinks.classList.remove("active");
      toggle.querySelector("i").classList.add("fa-bars");
      toggle.querySelector("i").classList.remove("fa-times");
    }
  });
});

// ===== NAVBAR SECTION END =====


/* ===== SHARE BUTTON SCRIPT START ===== */

// Wait until DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  
  // Get popup element and share button
  const popup = document.getElementById('copy-popup'); // custom popup div
  const shareBtn = document.getElementById('share-btn'); // share button link

  // Add click event to Share button
  shareBtn.addEventListener('click', async (event) => {
    event.preventDefault(); // prevent default link behavior

    // Data to share
    const shareData = {
      title: 'Drops-Kenya',
      text: 'Check out Drops-Kenya for premium DJ drops!',
      url: 'https://drops-kenya.vercel.app' // replace with your hosted link
    };

    try {
      if (navigator.share) {
        // Mobile browsers: open native share sheet
        await navigator.share(shareData);
      } else {
        // Desktop fallback: copy link to clipboard
        await navigator.clipboard.writeText(shareData.url);

        // Show custom popup
        popup.classList.add('show');

        // Hide popup after 3 seconds
        setTimeout(() => {
          popup.classList.remove('show');
        }, 3000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  });
});

/* ===== SHARE BUTTON SCRIPT END ===== */



// ===== DROPS SECTION START =====

// Play/Pause logic for audio cards
document.addEventListener("DOMContentLoaded", () => {
  const playButtons = document.querySelectorAll(".play-btn");

  playButtons.forEach(button => {
    button.addEventListener("click", () => {
      const audioId = button.getAttribute("data-audio");
      const audio = document.getElementById(audioId);

      // Pause all other audios
      document.querySelectorAll("audio").forEach(a => {
        if (a !== audio) {
          a.pause();
          a.currentTime = 0;
        }
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
});

// ===== DROPS SECTION END =====


// ===== TESTIMONIALS SECTION START =====

// Optional: Auto-scroll slider effect
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".testimonials-grid");
  let scrollAmount = 0;

  setInterval(() => {
    grid.scrollBy({ left: 300, behavior: "smooth" });
    scrollAmount += 300;

    if (scrollAmount >= grid.scrollWidth) {
      grid.scrollTo({ left: 0, behavior: "smooth" });
      scrollAmount = 0;
    }
  }, 5000); // every 5 seconds
});

// ===== TESTIMONIALS SECTION END =====




// ===== CONTACT FORM VALIDATION & WHATSAPP SEND =====
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const message = document.getElementById("message");
  const charCount = document.getElementById("charCount");

  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const messageError = document.getElementById("messageError");

  // Character countdown
  message.addEventListener("input", () => {
    const remaining = 100 - message.value.length;
    charCount.textContent = `${remaining} characters remaining`;
    charCount.style.color = remaining < 0 ? "red" : "var(--color-light)";
  });

  // Form validation and WhatsApp send
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let valid = true;

    // Reset errors
    nameError.textContent = "";
    emailError.textContent = "";
    messageError.textContent = "";

    // Name validation
    if (name.value.trim() === "") {
      nameError.textContent = "Name is required.";
      valid = false;
    }

    // Email validation
    if (email.value.trim() === "") {
      emailError.textContent = "Email is required.";
      valid = false;
    } else {
      const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,}$/i;
      if (!email.value.match(emailPattern)) {
        emailError.textContent = "Please enter a valid email address.";
        valid = false;
      }
    }

    // Message validation
    if (message.value.trim() === "") {
      messageError.textContent = "Message is required.";
      valid = false;
    } else if (message.value.length > 100) {
      messageError.textContent = "Message must not exceed 100 characters.";
      valid = false;
    }

    if (valid) {
      // Build WhatsApp message
      const whatsappMessage = `Name: ${encodeURIComponent(name.value)}%0AEmail: ${encodeURIComponent(email.value)}%0AMessage: ${encodeURIComponent(message.value)}`;
      const whatsappURL = `https://wa.me/254745736283?text=${whatsappMessage}`;

      // Redirect to WhatsApp
      window.open(whatsappURL, "_blank");

      // Reset form and countdown
      form.reset();
      charCount.textContent = "100 characters remaining";
      charCount.style.color = "var(--color-light)";
    }
  });
});


// ===== CONTACT FORM VALIDATION & WHATSAPP SEND ENDS =====




// ===== FOOTER YEAR SCRIPT START =====
document.addEventListener("DOMContentLoaded", () => {
  // Get the span element where the year will be displayed
  const yearSpan = document.getElementById("year");

  // Get the current year from the system date
  const currentYear = new Date().getFullYear();

  // Insert the current year into the footer
  yearSpan.textContent = currentYear;
});
// ===== FOOTER YEAR SCRIPT END =====

