const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const menuIcon = document.querySelector("[data-menu-icon]");
const contactForm = document.querySelector("[data-contact-form]");
const submitBtn = document.querySelector("[data-submit-btn]");
const formNote = document.querySelector("[data-form-note]");

const updateHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

const closeMobileMenu = () => {
  if (!menuToggle || !mobileMenu || !menuIcon) return;

  mobileMenu.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  mobileMenu.setAttribute("aria-hidden", "true");
  menuToggle.setAttribute("aria-label", "Open menu");
  menuIcon.src = "assets/icons/ui/menu.svg";
  document.body.style.overflow = "";
};

if (menuToggle && mobileMenu && menuIcon) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("is-open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    mobileMenu.setAttribute("aria-hidden", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");

    menuIcon.src = isOpen
      ? "assets/icons/ui/close.svg"
      : "assets/icons/ui/menu.svg";

    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1120) {
      closeMobileMenu();
    }
  });
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  revealItems.forEach((item) => {
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => {
    item.classList.add("is-visible");
  });
}

if (contactForm && submitBtn && formNote) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      formNote.textContent = "Please complete all required fields.";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    formNote.textContent = "";

    setTimeout(() => {
      contactForm.reset();

      submitBtn.textContent = "Inquiry Sent";

      formNote.textContent =
        "Thank you. MONARCH SOUND will review your inquiry and respond soon.";

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Inquiry";
      }, 1800);
    }, 850);
  });
}
