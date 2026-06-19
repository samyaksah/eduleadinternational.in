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
let testimonialIndex = 0;
let writtenTestimonialsTimer;
let learningCarouselTimer;

const courseContent = {
  cidtl: {
    certificate: {
      description:
        "Build practical classroom strategies through reflective practice, assessment design, and active learning.",
      duration: "Duration: 4 Months",
      learnings: [
        "Active learning strategies",
        "Assessment for learning",
        "Reflective classroom practice",
        "Instructional design basics"
      ]
    },
    diploma: {
      description:
        "Go deeper into teaching practice with a wider portfolio of classroom inquiry, learner support, and evidence-based improvement.",
      duration: "Duration: 8 Months",
      learnings: [
        "Advanced instructional design",
        "Differentiated classroom practice",
        "Meaningful assessment systems",
        "Professional portfolio development"
      ]
    }
  },
  cidel: {
    certificate: {
      description:
        "Develop strategic leadership skills to drive school improvement and create positive learning environments.",
      duration: "Duration: 8 Months",
      learnings: [
        "Strategic planning and vision setting",
        "Leading school improvement initiatives",
        "Building effective teaching teams",
        "Data-driven decision making"
      ]
    },
    diploma: {
      description:
        "Extend your leadership practice through deeper school improvement planning, organisational change, and reflective leadership evidence.",
      duration: "Duration: 12 Months",
      learnings: [
        "Long-term school improvement planning",
        "Leading organisational change",
        "Coaching and developing teaching teams",
        "Evidence-informed leadership practice"
      ]
    }
  }
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
        <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Open Instagram</a>
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
