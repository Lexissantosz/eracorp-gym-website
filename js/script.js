console.log("Site ERACORP carregado");

const form = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
const revealElements = document.querySelectorAll(".reveal");
const navbar = document.getElementById("mainNavbar");
const siteLoader = document.getElementById("siteLoader");
const scrollProgress = document.getElementById("scrollProgress");
const counters = document.querySelectorAll(".counter");

let countersStarted = false;

/* FORMULÁRIO — FORMSPREE */
if (form) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    formMessage.textContent = "Enviando...";
    formMessage.style.color = "#dccaff";

    const formData = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/mdawdeyb", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        formMessage.textContent = "Mensagem enviada com sucesso!";
        formMessage.style.color = "#9dffb0";
        form.reset();
      } else {
        const data = await response.json().catch(() => null);

        if (data && data.errors && data.errors.length > 0) {
          formMessage.textContent = data.errors[0].message;
        } else {
          formMessage.textContent = "Não foi possível enviar. Tente novamente.";
        }

        formMessage.style.color = "#ffb3c1";
      }
    } catch (error) {
      formMessage.textContent = "Erro de conexão. Verifique sua internet.";
      formMessage.style.color = "#ffb3c1";
    }

    setTimeout(() => {
      formMessage.textContent = "";
      formMessage.style.color = "#dccaff";
    }, 5000);
  });
}

/* REVEAL */
function revealOnScroll() {
  const triggerBottom = window.innerHeight * 0.88;

  revealElements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;

    if (elementTop < triggerBottom) {
      element.classList.add("show");
    }
  });
}

/* NAVBAR */
function updateNavbarOnScroll() {
  if (!navbar) return;

  if (window.scrollY > 25) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}

/* BARRA DE PROGRESSO */
function updateScrollProgress() {
  if (!scrollProgress) return;

  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  scrollProgress.style.width = `${progress}%`;
}

/* CONTADORES */
function animateCounters() {
  if (countersStarted) return;

  const statsSection = document.getElementById("numeros");
  if (!statsSection) return;

  const sectionTop = statsSection.getBoundingClientRect().top;
  const triggerPoint = window.innerHeight * 0.85;

  if (sectionTop < triggerPoint) {
    countersStarted = true;

    counters.forEach((counter) => {
      const target = +counter.getAttribute("data-target");
      let current = 0;
      const increment = Math.max(1, Math.ceil(target / 80));

      const updateCounter = () => {
        current += increment;

        if (current >= target) {
          if (target === 100) {
            counter.textContent = "100%";
          } else if (target >= 100) {
            counter.textContent = "+" + target;
          } else {
            counter.textContent = target;
          }
        } else {
          if (target === 100) {
            counter.textContent = current + "%";
          } else if (target >= 100) {
            counter.textContent = "+" + current;
          } else {
            counter.textContent = current;
          }

          requestAnimationFrame(updateCounter);
        }
      };

      updateCounter();
    });
  }
}

window.addEventListener("load", function () {
  revealOnScroll();
  updateNavbarOnScroll();
  updateScrollProgress();
  animateCounters();

  if (siteLoader) {
    setTimeout(() => {
      siteLoader.classList.add("hidden");
    }, 700);
  }
});

window.addEventListener("scroll", function () {
  revealOnScroll();
  updateNavbarOnScroll();
  updateScrollProgress();
  animateCounters();
});