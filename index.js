const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

function initAccessibilityWidget() {
  const widget = document.createElement("div");
  widget.className = "a11y-widget";
  widget.innerHTML = `
    <button class="a11y-btn" id="a11y-inc" type="button" title="Increase text size">A+</button>
    <button class="a11y-btn" id="a11y-dec" type="button" title="Decrease text size">A-</button>
    <button class="a11y-btn" id="a11y-reset" type="button" title="Reset text size">A</button>
  `;
  document.body.appendChild(widget);

  const root = document.documentElement;
  const STORAGE_KEY = "abcFontScale";
  let scale = parseFloat(localStorage.getItem(STORAGE_KEY)) || 1;

  function applyScale() {
    root.style.fontSize = (16 * scale).toFixed(1) + "px";
    try { localStorage.setItem(STORAGE_KEY, scale); } catch (err) { /* ignore */ }
  }
  applyScale();

  document.getElementById("a11y-inc").addEventListener("click", () => {
    scale = Math.min(scale + 0.1, 1.4);
    applyScale();
  });
  document.getElementById("a11y-dec").addEventListener("click", () => {
    scale = Math.max(scale - 0.1, 0.85);
    applyScale();
  });
  document.getElementById("a11y-reset").addEventListener("click", () => {
    scale = 1;
    applyScale();
  });
}

function initChatWidget() {
  const chat = document.createElement("div");
  chat.className = "chat-widget";
  chat.innerHTML = `
    <span class="chat-tooltip">How can we help?</span>
    <button class="chat-fab" id="chat-fab" type="button" aria-label="Chat with us">💬</button>
  `;
  document.body.appendChild(chat);

  document.getElementById("chat-fab").addEventListener("click", () => {
    const target = document.querySelector(".contact") || document.querySelector(".form-section");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.location.href = "contact.html";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initAccessibilityWidget();
  initChatWidget();
});

document.addEventListener("DOMContentLoaded", () => {
  const autoTargets = document.querySelectorAll(
    ".section-head, .card-grid, .choose-grid, .facility ul, .contact-card, .form-card, .feedback-grid"
  );

  autoTargets.forEach((el) => {
    if (
      el.classList.contains("card-grid") ||
      el.classList.contains("choose-grid") ||
      el.classList.contains("feedback-grid") ||
      el.tagName === "UL"
    ) {
      el.classList.add("reveal-stagger");
    } else {
      el.classList.add("reveal");
    }
  });

  const revealTargets = document.querySelectorAll(".reveal, .reveal-stagger");

  if ("IntersectionObserver" in window && revealTargets.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("in-view"));
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll("form[data-demo-form]");

  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const requiredFields = form.querySelectorAll("[required]");
      let allFilled = true;
      requiredFields.forEach((field) => {
        if (!field.value.trim()) allFilled = false;
      });

      const message = form.querySelector(".form-message");
      if (!message) return;

      if (!allFilled) {
        message.textContent = "Please fill in all required fields.";
        message.style.color = "#B3261E";
        return;
      }

      const successText = form.getAttribute("data-success") || "Submitted successfully.";
      message.textContent = successText;
      message.style.color = "#4E1725";
      form.reset();
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("campusSlider");
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll(".slide"));
  const dots = Array.from(slider.querySelectorAll(".dot"));
  const prevBtn = slider.querySelector(".slider-arrow.prev");
  const nextBtn = slider.querySelector(".slider-arrow.next");

  let current = slides.findIndex((s) => s.classList.contains("is-active"));
  if (current === -1) current = 0;

  let timer = null;
  const intervalMs = 4500;

  function goTo(index) {
    const total = slides.length;
    const next = ((index % total) + total) % total;

    slides[current].classList.remove("is-active");
    dots[current]?.classList.remove("is-active");

    current = next;

    slides[current].classList.add("is-active");
    dots[current]?.classList.add("is-active");
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function start() {
    stop();
    timer = setInterval(next, intervalMs);
  }
  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  nextBtn?.addEventListener("click", () => { next(); start(); });
  prevBtn?.addEventListener("click", () => { prev(); start(); });
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      goTo(parseInt(dot.dataset.index, 10));
      start();
    });
  });

  slider.addEventListener("mouseenter", stop);
  slider.addEventListener("mouseleave", start);

  start();
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("feedback-form");
  const grid = document.getElementById("feedback-grid");
  if (!form || !grid) return;

  const STORAGE_KEY = "abcCollegeFeedback";

  const seedFeedback = [
    {
      name: "Ananya Sharma",
      course: "BCA, Final Year",
      rating: 5,
      message: "The faculty here genuinely cares about your progress. The smart classrooms and lab access made learning practical, not just theoretical.",
      isNew: false,
    },
    {
      name: "Rohan Mehta",
      course: "B.Tech, 4th Year",
      rating: 5,
      message: "Placement cell support was excellent — from resume building to mock interviews, they prepared me well before campus drives.",
      isNew: false,
    },
    {
      name: "Priya Nair",
      course: "B.Com, 2nd Year",
      rating: 4,
      message: "Great campus life overall. Hostel facilities and Wi-Fi access made it easy to balance coursework with everything else.",
      isNew: false,
    },
    {
      name: "Karan Verma",
      course: "MBA, 1st Year",
      rating: 5,
      message: "The MBA programme pushed me to think strategically. Faculty come from real industry backgrounds, which made a big difference.",
      isNew: false,
    },
  ];

  function getStoredFeedback() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  }

  function saveFeedback(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (err) {
    }
  }

  function starString(rating) {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function renderFeedback() {
    const stored = getStoredFeedback();
    const all = [...stored, ...seedFeedback];

    grid.innerHTML = all
      .map((entry) => `
        <div class="feedback-card${entry.isNew ? " is-new" : ""}">
          <div class="stars">${starString(entry.rating)}</div>
          <p class="quote">${escapeHtml(entry.message)}</p>
          <div class="author">
            <div class="author-info">
              <strong>${escapeHtml(entry.name)}</strong>
              <span>${escapeHtml(entry.course)}</span>
            </div>
            ${entry.isNew ? '<span class="fb-badge">Just added</span>' : ""}
          </div>
        </div>
      `)
      .join("");
  }

  const starRating = document.getElementById("fb-star-rating");
  const ratingInput = document.getElementById("fb-rating");
  const starButtons = Array.from(starRating.querySelectorAll(".star-btn"));

  function paintStars(value) {
    starButtons.forEach((btn) => {
      btn.classList.toggle("is-filled", parseInt(btn.dataset.value, 10) <= value);
    });
  }

  starButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = parseInt(btn.dataset.value, 10);
      ratingInput.value = value;
      paintStars(value);
    });
  });

  paintStars(parseInt(ratingInput.value, 10));

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("fb-name").value.trim();
    const course = document.getElementById("fb-course").value.trim();
    const message = document.getElementById("fb-message").value.trim();
    const rating = parseInt(ratingInput.value, 10) || 5;

    const feedbackMessage = document.getElementById("feedback-message");

    if (!name || !course || !message) {
      feedbackMessage.textContent = "Please fill in all fields before submitting.";
      feedbackMessage.style.color = "#B3261E";
      return;
    }

    const stored = getStoredFeedback();
    stored.unshift({ name, course, rating, message, isNew: true });
    saveFeedback(stored);

    renderFeedback();

    feedbackMessage.textContent = "Thank you! Your feedback has been added below.";
    feedbackMessage.style.color = "#4E1725";

    form.reset();
    ratingInput.value = 5;
    paintStars(5);
  });

  renderFeedback();
});
