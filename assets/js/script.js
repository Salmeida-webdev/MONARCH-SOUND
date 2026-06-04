const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const menuIcon = document.querySelector("[data-menu-icon]");

const contactForm = document.querySelector("[data-contact-form]");
const submitBtn = document.querySelector("[data-submit-btn]");
const formNote = document.querySelector("[data-form-note]");

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

/* ==========================
   ESTADO DO HEADER NO SCROLL
========================== */

const updateHeaderState = () => {
  if (!header) return;

  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

updateHeaderState();

window.addEventListener("scroll", updateHeaderState, {
  passive: true,
});

/* ==========================
   MENU MOBILE
========================== */

const closeMobileMenu = () => {
  if (!menuToggle || !mobileMenu || !menuIcon) return;

  mobileMenu.classList.remove("is-open");

  menuToggle.setAttribute("aria-expanded", "false");
  mobileMenu.setAttribute("aria-hidden", "true");
  menuToggle.setAttribute("aria-label", "Abrir menu");

  menuIcon.src = "assets/icons/ui/menu.svg";

  document.body.style.overflow = "";
};

if (menuToggle && mobileMenu && menuIcon) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("is-open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));

    mobileMenu.setAttribute("aria-hidden", String(!isOpen));

    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Fechar menu" : "Abrir menu",
    );

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

/* ==========================
   NAVEGAÇÃO SUAVE
========================== */

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);

    if (!target) return;

    event.preventDefault();

    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });

    closeMobileMenu();
  });
});

/* ==========================
   REVEAL AO ROLAR
========================== */

const revealItems = document.querySelectorAll(".reveal");

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 0.035, 0.28)}s`;
});

if (prefersReducedMotion) {
  revealItems.forEach((item) => {
    item.classList.add("is-visible");
  });
} else if ("IntersectionObserver" in window) {
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

/* ==========================
   FORMULÁRIO ASSÍNCRONO
========================== */

const encodeFormData = (formData) => new URLSearchParams(formData).toString();

const setFormState = (state, message) => {
  if (!contactForm || !submitBtn || !formNote) return;

  contactForm.classList.remove("is-sending", "is-sent", "is-error");

  if (state) {
    contactForm.classList.add(state);
  }

  formNote.textContent = message || "";
};

if (contactForm && submitBtn && formNote) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      setFormState("is-error", "Preencha todos os campos obrigatórios.");

      contactForm.reportValidity();

      return;
    }

    const formData = new FormData(contactForm);

    submitBtn.disabled = true;
    submitBtn.textContent = "Processando...";

    setFormState("is-sending", "");

    try {
      await fetch("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: encodeFormData(formData),
      });

      contactForm.reset();

      submitBtn.textContent = "Solicitação Enviada";

      setFormState(
        "is-sent",
        "Obrigado. Solicitações selecionadas recebem retorno em até 72 horas.",
      );

      window.setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = "Enviar Solicitação";

        contactForm.classList.remove("is-sent");
      }, 2400);
    } catch (error) {
      submitBtn.disabled = false;

      submitBtn.textContent = "Enviar Solicitação";

      setFormState(
        "is-error",
        "Não foi possível enviar a mensagem. Entre em contato pelo WhatsApp ou e-mail.",
      );
    }
  });
}

/* ==========================
   ACESSIBILIDADE
========================== */

document.addEventListener("keydown", (event) => {
  if (event.key !== "Tab") return;

  document.body.classList.add("is-keyboard-user");
});

document.addEventListener("mousedown", () => {
  document.body.classList.remove("is-keyboard-user");
});

/* ==========================
   PERFORMANCE
========================== */

window.addEventListener("load", () => {
  document.body.classList.add("is-loaded");
});
