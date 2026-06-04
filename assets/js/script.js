const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const menuIcon = document.querySelector("[data-menu-icon]");

const contactForm = document.querySelector("[data-contact-form]");
const submitBtn = document.querySelector("[data-submit-btn]");
const formNote = document.querySelector("[data-form-note]");

const cursor = document.querySelector("[data-cursor]");
const cursorText = document.querySelector("[data-cursor-text]");
const soundToggle = document.querySelector("[data-sound-toggle]");
const visualCanvas = document.querySelector("[data-audio-canvas]");
const visualButton = document.querySelector("[data-play-visual]");
const visualPlayer = document.querySelector("[data-audio-player]");
const audioTrack = document.querySelector("[data-audio-track]");

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

/* ==========================
   HEADER
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
   LENIS + GSAP LEVE
========================== */

let lenis = null;

const initLenis = () => {
  if (prefersReducedMotion || !window.Lenis) return;

  lenis = new Lenis({
    duration: 1.12,
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.25,
  });

  const raf = (time) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };

  requestAnimationFrame(raf);
};

const initGsapMotion = () => {
  if (prefersReducedMotion || !window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  const titleSelectors =
    ".section-heading h2, .manifesto h2, .studio h2, .contact h2, .final-cta h2, .sonic-player h2";

  document.querySelectorAll(titleSelectors).forEach((title) => {
    gsap.fromTo(
      title,
      {
        y: 48,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: title,
          start: "top 82%",
        },
      },
    );
  });

  document
    .querySelectorAll(
      ".artist-card, .release-card, .metric-card, .studio-workflow article",
    )
    .forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          y: 42,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          delay: Math.min(index * 0.035, 0.18),
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
          },
        },
      );
    });

  document
    .querySelectorAll(".hero__media img, .final-cta > img")
    .forEach((image) => {
      gsap.to(image, {
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: image.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });
};

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

    if (lenis) {
      lenis.scrollTo(target);
    } else {
      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }

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
   CURSOR CUSTOMIZADO
========================== */

const initCursor = () => {
  if (!cursor || !cursorText || window.innerWidth < 900 || prefersReducedMotion)
    return;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  window.addEventListener("mousemove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;

    cursor.classList.add("is-visible");
  });

  const render = () => {
    currentX += (targetX - currentX) * 0.18;
    currentY += (targetY - currentY) * 0.18;

    cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(render);
  };

  render();

  document
    .querySelectorAll("a, button, .artist-card, .release-card, .visual-player")
    .forEach((element) => {
      element.addEventListener("mouseenter", () => {
        cursor.classList.add("is-active");
        cursorText.textContent = element.dataset.cursorLabel || "";
      });

      element.addEventListener("mouseleave", () => {
        cursor.classList.remove("is-active");
        cursorText.textContent = "";
      });
    });
};

/* ==========================
   EXPERIÊNCIA SONORA OPCIONAL
========================== */

let soundEnabled = false;
let audioContext = null;
let oscillator = null;
let gainNode = null;

const stopAmbientSound = () => {
  if (oscillator) {
    oscillator.stop();
    oscillator.disconnect();
    oscillator = null;
  }

  if (gainNode) {
    gainNode.disconnect();
    gainNode = null;
  }
};

const startAmbientSound = () => {
  const Context = window.AudioContext || window.webkitAudioContext;

  if (!Context) return;

  audioContext = audioContext || new Context();

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  stopAmbientSound();

  oscillator = audioContext.createOscillator();
  gainNode = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = 64;
  gainNode.gain.value = 0.015;

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
};

if (soundToggle) {
  soundToggle.addEventListener("click", () => {
    soundEnabled = !soundEnabled;

    soundToggle.setAttribute("aria-pressed", String(soundEnabled));
    soundToggle.setAttribute(
      "aria-label",
      soundEnabled
        ? "Desativar experiência sonora"
        : "Ativar experiência sonora",
    );

    if (soundEnabled) {
      startAmbientSound();
    } else {
      stopAmbientSound();
    }
  });
}

/* ==========================
   PLAYER VISUAL CANVAS + MP3
========================== */

const initVisualPlayer = () => {
  if (!visualCanvas) return;

  const context = visualCanvas.getContext("2d");

  if (!context) return;

  let isPlaying = false;
  let time = 0;

  const resizeCanvas = () => {
    const rect = visualCanvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;

    visualCanvas.width = Math.max(1, Math.floor(rect.width * ratio));
    visualCanvas.height = Math.max(1, Math.floor(rect.height * ratio));

    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const setPlayerState = (playing) => {
    isPlaying = playing;

    if (visualButton) {
      visualButton.textContent = playing ? "PAUSE" : "PLAY";
    }

    visualPlayer?.classList.toggle("is-playing", playing);
  };

  const draw = () => {
    const { width, height } = visualCanvas.getBoundingClientRect();

    context.clearRect(0, 0, width, height);

    const lines = 42;
    const centerY = height / 2;

    context.lineWidth = 1.2;

    for (let i = 0; i < lines; i += 1) {
      const progress = i / lines;
      const x = progress * width;
      const amp = isPlaying ? 70 : 32;
      const wave = Math.sin(progress * Math.PI * 5 + time) * amp;
      const waveTwo =
        Math.cos(progress * Math.PI * 2.5 + time * 0.7) * (amp * 0.5);
      const y = centerY + wave + waveTwo;

      context.beginPath();
      context.strokeStyle = `rgba(198, 93, 58, ${0.18 + progress * 0.46})`;
      context.moveTo(x, centerY);
      context.lineTo(x, y);
      context.stroke();
    }

    context.beginPath();
    context.strokeStyle = "rgba(243, 238, 231, 0.18)";
    context.moveTo(0, centerY);

    for (let x = 0; x <= width; x += 14) {
      const y = centerY + Math.sin(x * 0.018 + time) * (isPlaying ? 46 : 18);
      context.lineTo(x, y);
    }

    context.stroke();

    time += isPlaying ? 0.045 : 0.015;

    requestAnimationFrame(draw);
  };

  resizeCanvas();
  draw();

  window.addEventListener("resize", resizeCanvas);

  if (visualButton) {
    visualButton.addEventListener("click", async () => {
      if (!audioTrack) {
        setPlayerState(!isPlaying);
        return;
      }

      if (!audioTrack.paused) {
        audioTrack.pause();
        setPlayerState(false);
        return;
      }

      try {
        await audioTrack.play();
        setPlayerState(true);
      } catch (error) {
        setPlayerState(false);
      }
    });
  }

  if (audioTrack) {
    audioTrack.addEventListener("ended", () => {
      setPlayerState(false);
      audioTrack.currentTime = 0;
    });

    audioTrack.addEventListener("pause", () => {
      if (audioTrack.ended) return;

      setPlayerState(false);
    });

    audioTrack.addEventListener("play", () => {
      setPlayerState(true);
    });
  }
};

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
   PERFORMANCE / INIT
========================== */

window.addEventListener("load", () => {
  initLenis();
  initGsapMotion();
  initCursor();
  initVisualPlayer();

  window.setTimeout(() => {
    document.body.classList.add("is-loaded");
  }, 480);
});
