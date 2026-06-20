const testimonials = [
  {
    text:
      "The Educational Leadership Course by Cambridge is by far the best training I have ever attended. It opened the educational realm in a complete 360 degree way and gave me practical insight into leadership.",
    name: "V. Meena Thripurasundari",
    role: "Head of Admissions & Marketing, The NEST School, Chennai"
  },
  {
    text:
      "The course surpassed my expectations. In addition to rich Cambridge resources and insightful discussions, the facilitation ensured a proper structure that was followed very rigorously.",
    name: "Dr. Himani Tyagi",
    role: "Principal, Millennium School, Noida"
  },
  {
    text:
      "The CIDEL course is a blend of vision, motivation, inspiration, and practical skills for an effective school leader. It helped me identify my leadership style and implement effective strategies.",
    name: "Inderpal Kaur",
    role: "Principal, The Sanskruti English Medium School"
  },
  {
    text:
      "CIDTL helped me understand the concepts behind different pedagogical methods and gave my work as a teacher an informed direction.",
    name: "Ria Dabas",
    role: "PRT English, Golaya Progressive Public School"
  }
];

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const commencementStrip = document.querySelector(".commencement-strip");
const commencementSentinel = document.querySelector(".commencement-sentinel");
const testimonialText = document.querySelector("#testimonial-text");
const testimonialName = document.querySelector("#testimonial-name");
const testimonialRole = document.querySelector("#testimonial-role");
const testimonialButtons = document.querySelectorAll(".testimonial-controls button");
const instagramFeed = document.querySelector("#instagram-feed");
const courseCards = document.querySelectorAll("[data-course-card]");
const playlistPlayer = document.querySelector("#playlist-player");
const playlistTitle = document.querySelector("#playlist-title");
const playlistDescription = document.querySelector("#playlist-description");
const playlistTrack = document.querySelector("#playlist-track");
const videoSlides = document.querySelectorAll(".video-slide");
const videoScrollButtons = document.querySelectorAll("[data-video-scroll]");
const carouselScrollButtons = document.querySelectorAll("[data-carousel-scroll]");
const galleryScrollButtons = document.querySelectorAll("[data-gallery-scroll]");
const writtenTestimonialsCarousel = document.querySelector("#written-testimonials");
const learningCarousel = document.querySelector("#learning-carousel");
const enquiryModal = document.querySelector("#course-enquiry-modal");
const enquiryTriggers = document.querySelectorAll("[data-enquiry-course]");
const enquiryTitle = document.querySelector("[data-enquiry-title]");
const enquiryCourseField = document.querySelector("[data-enquiry-course-field]");
const enquiryCourseDisplay = document.querySelector("[data-enquiry-course-display]");
const enquiryCloseButtons = document.querySelectorAll("[data-enquiry-close]");
const resultGrids = document.querySelectorAll("[data-results-grid]");
const featuredResultTracks = document.querySelectorAll("[data-featured-results]");
const commencementCards = document.querySelectorAll("[data-commencement-card]");
let testimonialIndex = 0;
let writtenTestimonialsTimer;
let learningCarouselTimer;

function updateCommencementStripState() {
  if (!commencementStrip) return;

  const headerHeight = document.querySelector(".site-header")?.offsetHeight || 0;
  const stripTop = commencementStrip.getBoundingClientRect().top;
  commencementStrip.classList.toggle("is-stuck", stripTop <= headerHeight + 1 && window.scrollY > 4);
}

const courseContent = {
  cidtl: {
    certificate: {
      description:
        "Cambridge Professional Development Qualifications support effective continuing professional development through reflective teaching practice.",
      duration: "Duration: 6 Months",
      learnings: [
        "Engage critically with global best practices",
        "Apply new ideas in teaching contexts",
        "Evaluate experiences for further development",
        "Improve teaching quality and student outcomes"
      ]
    },
    diploma: {
      description:
        "Go deeper into Cambridge PDQ practice by connecting concepts, principles, theories, and classroom evidence.",
      duration: "Duration: 6 Months",
      learnings: [
        "Engage critically with relevant theories",
        "Apply reflective practice in context",
        "Plan further professional growth",
        "Transform teaching and learning outcomes"
      ]
    }
  },
  cidel: {
    certificate: {
      description:
        "Designed for school leaders, educational leaders with direct responsibility for teachers or leaders, and aspiring leaders.",
      duration: "Duration: 8 Months",
      learnings: [
        "Understanding leadership concepts and theories",
        "Defining successful leadership practice",
        "Action planning for leadership development",
        "Teaching and learning in action"
      ]
    },
    diploma: {
      description:
        "Develop professional leadership practice through action planning, reflection, and teaching and learning in action.",
      duration: "Duration: 12 Months",
      learnings: [
        "Key concepts and theories of leadership",
        "Successful educational leadership practice",
        "Developing professional practice",
        "Leadership growth through action planning"
      ]
    }
  }
};

const resultCourseLabels = {
  teachingLearning: "Certificate and Diploma in Teaching and Learning",
  educationalLeadership: "Certificate and Diploma in Educational Leadership",
  other: "EduLead International Programme"
};

function renderTestimonial() {
  if (!testimonialText || !testimonialName || !testimonialRole) return;

  const testimonial = testimonials[testimonialIndex];
  testimonialText.textContent = testimonial.text;
  testimonialName.textContent = testimonial.name;
  testimonialRole.textContent = testimonial.role;
}

function renderInstagramFallback() {
  if (!instagramFeed) return;

  instagramFeed.innerHTML = `
    <article class="instagram-card">
      <div class="instagram-placeholder" aria-hidden="true"></div>
      <div>
        <h3>Instagram feed coming soon</h3>
        <p>Recent posts will appear here once Instagram API credentials are connected.</p>
        <a href="https://www.instagram.com/rupam.sah/" target="_blank" rel="noreferrer">Open Instagram</a>
      </div>
    </article>
  `;
}

function formatPostDate(timestamp) {
  if (!timestamp) return "";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(timestamp)
  );
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getInitials(name) {
  return String(name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatSchoolLocation(result) {
  const school = result.school || "";
  const city = result.city || "";

  if (school && city) {
    return `${escapeHtml(school)} | <strong>${escapeHtml(city)}</strong>`;
  }

  if (city) return `<strong>${escapeHtml(city)}</strong>`;
  return escapeHtml(school);
}

function renderResultPhoto(result) {
  if (result.photoUrl) {
    return `<img src="${escapeHtml(result.photoUrl)}" alt="${escapeHtml(result.name)}">`;
  }

  return escapeHtml(result.initials || getInitials(result.name) || "EL");
}

function renderResultCard(result, groupKey) {
  const courseLabel = resultCourseLabels[groupKey] || result.course || resultCourseLabels.other;
  const schoolLocation = formatSchoolLocation(result);
  const score = result.score ? `<p class="result-score">Score: ${escapeHtml(result.score)}</p>` : "";

  return `
    <article class="result-card">
      <div class="result-photo">${renderResultPhoto(result)}</div>
      <div>
        <h3>${escapeHtml(result.name)}</h3>
        ${result.designation ? `<p class="result-role">${escapeHtml(result.designation)}</p>` : ""}
        ${schoolLocation ? `<p class="result-school">${schoolLocation}</p>` : ""}
        ${score}
        <span class="result-course">${escapeHtml(courseLabel)}</span>
      </div>
    </article>
  `;
}

function renderFeaturedResult(result) {
  const schoolLocation = formatSchoolLocation(result);
  const score = result.score ? `Score: ${result.score}` : "";
  const meta = [schoolLocation, score].filter(Boolean).join(" | ");

  return `
    <article>
      <div class="distinction-avatar">${renderResultPhoto(result)}</div>
      <div>
        <strong>${escapeHtml(result.name)}</strong>
        ${result.designation ? `<span>${escapeHtml(result.designation)}</span>` : ""}
        ${meta ? `<small>${escapeHtml(meta)}</small>` : ""}
      </div>
    </article>
  `;
}

function repeatForCarousel(results, targetCount = 6) {
  if (!results.length) return [];

  const repeated = [];
  while (repeated.length < targetCount) {
    repeated.push(...results);
  }

  return repeated.slice(0, Math.max(targetCount, results.length));
}

function renderResults(payload) {
  const groups = payload.groups || {};
  const featured = payload.featured || {};

  resultGrids.forEach((grid) => {
    const groupKey = grid.dataset.resultsGrid;
    const results = groups[groupKey] || [];
    if (!results.length) return;

    grid.innerHTML = results.map((result) => renderResultCard(result, groupKey)).join("");
  });

  featuredResultTracks.forEach((track) => {
    const groupKey = track.dataset.featuredResults;
    const results = featured[groupKey] || [];
    if (!results.length) return;

    track.innerHTML = repeatForCarousel(results).map(renderFeaturedResult).join("");
  });
}

async function loadResults() {
  if (!resultGrids.length && !featuredResultTracks.length) return;

  try {
    const response = await fetch("/api/results");
    if (!response.ok) throw new Error("Results unavailable");

    const payload = await response.json();
    if (!payload.results?.length) return;

    renderResults(payload);
  } catch (error) {
    // Keep the hardcoded fallback results already present in the HTML.
  }
}

function renderCourseCard(card, option) {
  const course = card.dataset.courseCard;
  const content = courseContent[course]?.[option];
  if (!content) return;

  card.querySelectorAll("[data-course-option]").forEach((button) => {
    const isActive = button.dataset.courseOption === option;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  const description = card.querySelector("[data-course-description]");
  const duration = card.querySelector("[data-course-duration]");
  const learnings = card.querySelector("[data-course-learnings]");

  if (description) description.textContent = content.description;
  if (duration) duration.textContent = content.duration;
  if (learnings) {
    learnings.innerHTML = content.learnings.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  }
}

function renderCommencements(payload) {
  const byCourse = payload.byCourse || {};

  commencementCards.forEach((card) => {
    const record = byCourse[card.dataset.commencementCard];
    if (!record?.commencementDate) return;

    const dateTarget = card.querySelector("[data-commencement-date]");
    const labelTarget = card.querySelector("[data-commencement-label]");

    if (dateTarget) dateTarget.textContent = record.commencementDate;
    if (labelTarget && record.label) labelTarget.textContent = record.label;

    if (record.url && card.matches("a")) {
      card.setAttribute("href", record.url);
    }
  });
}

async function loadCommencements() {
  if (!commencementCards.length) return;

  try {
    const response = await fetch("/api/commencements");
    if (!response.ok) throw new Error("Commencement dates unavailable");

    const payload = await response.json();
    if (!payload.commencements?.length) return;

    renderCommencements(payload);
  } catch (error) {
    // Keep the hardcoded fallback commencement dates already present in the HTML.
  }
}

function selectVideo(slide) {
  if (!slide || !playlistPlayer || !playlistTitle || !playlistDescription) return;

  const videoId = slide.dataset.videoId;
  const title = slide.dataset.videoTitle;
  const description = slide.dataset.videoDescription;

  playlistPlayer.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?rel=0`;
  playlistPlayer.title = title;
  playlistTitle.textContent = title;
  playlistDescription.textContent = description;

  videoSlides.forEach((item) => item.classList.toggle("is-active", item === slide));
  slide.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
}

async function loadInstagramFeed() {
  if (!instagramFeed) return;

  try {
    const response = await fetch("/api/instagram");
    if (!response.ok) throw new Error("Instagram feed unavailable");

    const payload = await response.json();
    const posts = (payload.posts || []).slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    if (!posts.length) {
      renderInstagramFallback();
      return;
    }

    instagramFeed.innerHTML = posts
      .slice(0, 6)
      .map((post) => {
        const caption = post.caption ? post.caption.slice(0, 130) : "Recent EduLead International update.";
        const date = formatPostDate(post.timestamp);
        return `
          <article class="instagram-card">
            <img src="${escapeHtml(post.mediaUrl)}" alt="">
            <div>
              <h3>${escapeHtml(date)}</h3>
              <p>${escapeHtml(caption)}${post.caption && post.caption.length > 130 ? "..." : ""}</p>
              <a href="${escapeHtml(post.permalink)}" target="_blank" rel="noreferrer">View on Instagram</a>
            </div>
          </article>
        `;
      })
      .join("");
  } catch (error) {
    renderInstagramFallback();
  }
}

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      nav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });
}

if (commencementStrip) {
  if (commencementSentinel && "IntersectionObserver" in window) {
    const commencementObserver = new IntersectionObserver(
      ([entry]) => {
        commencementStrip.classList.toggle("is-stuck", !entry.isIntersecting);
      },
      { threshold: 0 }
    );

    commencementObserver.observe(commencementSentinel);
  } else {
    updateCommencementStripState();
    window.addEventListener("scroll", updateCommencementStripState, { passive: true });
    window.addEventListener("resize", updateCommencementStripState);
  }
}

function openEnquiryModal(courseName) {
  if (!enquiryModal) return false;

  const selectedCourse = courseName || "General enquiry";
  if (enquiryTitle) enquiryTitle.textContent = selectedCourse;
  if (enquiryCourseField) enquiryCourseField.value = selectedCourse;
  if (enquiryCourseDisplay) enquiryCourseDisplay.value = selectedCourse;

  enquiryModal.hidden = false;
  document.body.classList.add("modal-open");
  enquiryModal.querySelector("input[name='name']")?.focus();
  return true;
}

function closeEnquiryModal() {
  if (!enquiryModal) return;

  enquiryModal.hidden = true;
  document.body.classList.remove("modal-open");
}

enquiryTriggers.forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    const didOpen = openEnquiryModal(trigger.dataset.enquiryCourse);
    if (didOpen) event.preventDefault();
  });
});

enquiryCloseButtons.forEach((button) => {
  button.addEventListener("click", closeEnquiryModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && enquiryModal && !enquiryModal.hidden) {
    closeEnquiryModal();
  }
});

testimonialButtons.forEach((button) => {
  button.addEventListener("click", () => {
    testimonialIndex =
      button.dataset.direction === "next"
        ? (testimonialIndex + 1) % testimonials.length
        : (testimonialIndex - 1 + testimonials.length) % testimonials.length;
    renderTestimonial();
  });
});

courseCards.forEach((card) => {
  card.querySelectorAll("[data-course-option]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.classList.contains("is-active")));
    button.addEventListener("click", () => {
      renderCourseCard(card, button.dataset.courseOption);
    });
  });
});

videoSlides.forEach((slide) => {
  slide.addEventListener("click", () => selectVideo(slide));
});

videoScrollButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!playlistTrack) return;
    const direction = button.dataset.videoScroll === "next" ? 1 : -1;
    playlistTrack.scrollBy({ left: direction * playlistTrack.clientWidth * 0.82, behavior: "smooth" });
  });
});

carouselScrollButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const carousel = document.querySelector(`#${button.dataset.carouselScroll}`);
    if (!carousel) return;

    const direction = button.dataset.direction === "next" ? 1 : -1;
    carousel.scrollBy({ left: direction * carousel.clientWidth * 0.85, behavior: "smooth" });
  });
});

galleryScrollButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!learningCarousel) return;

    const direction = button.dataset.galleryScroll === "next" ? 1 : -1;
    const slideWidth = learningCarousel.querySelector("figure")?.getBoundingClientRect().width || learningCarousel.clientWidth;
    learningCarousel.scrollBy({ left: direction * (slideWidth + 22), behavior: "smooth" });
  });
});

function startWrittenTestimonialsAutoplay() {
  if (!writtenTestimonialsCarousel) return;

  stopWrittenTestimonialsAutoplay();
  writtenTestimonialsTimer = window.setInterval(() => {
    const slideWidth = writtenTestimonialsCarousel.clientWidth;
    const isAtEnd =
      writtenTestimonialsCarousel.scrollLeft + writtenTestimonialsCarousel.clientWidth >=
      writtenTestimonialsCarousel.scrollWidth - 8;

    writtenTestimonialsCarousel.scrollTo({
      left: isAtEnd ? 0 : writtenTestimonialsCarousel.scrollLeft + slideWidth,
      behavior: "smooth"
    });
  }, 5000);
}

function stopWrittenTestimonialsAutoplay() {
  if (writtenTestimonialsTimer) {
    window.clearInterval(writtenTestimonialsTimer);
    writtenTestimonialsTimer = undefined;
  }
}

if (writtenTestimonialsCarousel) {
  writtenTestimonialsCarousel.addEventListener("mouseenter", stopWrittenTestimonialsAutoplay);
  writtenTestimonialsCarousel.addEventListener("mouseleave", startWrittenTestimonialsAutoplay);
  writtenTestimonialsCarousel.addEventListener("focusin", stopWrittenTestimonialsAutoplay);
  writtenTestimonialsCarousel.addEventListener("focusout", startWrittenTestimonialsAutoplay);
  startWrittenTestimonialsAutoplay();
}

function startLearningCarouselAutoplay() {
  if (!learningCarousel) return;

  stopLearningCarouselAutoplay();
  learningCarouselTimer = window.setInterval(() => {
    const slideWidth = learningCarousel.querySelector("figure")?.getBoundingClientRect().width || learningCarousel.clientWidth;
    const isAtEnd = learningCarousel.scrollLeft + learningCarousel.clientWidth >= learningCarousel.scrollWidth - 8;

    learningCarousel.scrollTo({
      left: isAtEnd ? 0 : learningCarousel.scrollLeft + slideWidth + 28,
      behavior: "smooth"
    });
  }, 4000);
}

function stopLearningCarouselAutoplay() {
  if (learningCarouselTimer) {
    window.clearInterval(learningCarouselTimer);
    learningCarouselTimer = undefined;
  }
}

if (learningCarousel) {
  learningCarousel.addEventListener("mouseenter", stopLearningCarouselAutoplay);
  learningCarousel.addEventListener("mouseleave", startLearningCarouselAutoplay);
  learningCarousel.addEventListener("focusin", stopLearningCarouselAutoplay);
  learningCarousel.addEventListener("focusout", startLearningCarouselAutoplay);
  startLearningCarouselAutoplay();
}

renderTestimonial();
loadInstagramFeed();
loadResults();
loadCommencements();
