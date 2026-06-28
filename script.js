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
const headerCta = document.querySelector(".header-cta");
const commencementStrip = document.querySelector(".commencement-strip");
const commencementSentinel = document.querySelector(".commencement-sentinel");
const testimonialText = document.querySelector("#testimonial-text");
const testimonialName = document.querySelector("#testimonial-name");
const testimonialRole = document.querySelector("#testimonial-role");
const testimonialButtons = document.querySelectorAll(".testimonial-controls button");
const instagramFeed = document.querySelector("#instagram-feed");
const courseCards = document.querySelectorAll("[data-course-card]");
const courseVisualImages = document.querySelectorAll(".course-visual img, .brain-visual img");
const testimonialPortraits = document.querySelectorAll("[data-testimonial-portrait]");
const testimonialVideoPlayers = document.querySelectorAll("[data-testimonial-video]");
const testimonialContainers = document.querySelectorAll("[data-testimonials-course][data-testimonials-type]");
const playlistPlayer = document.querySelector("#playlist-player");
const playlistTitle = document.querySelector("#playlist-title");
const playlistDescription = document.querySelector("#playlist-description");
const playlistTrack = document.querySelector("#playlist-track");
const videoSlides = document.querySelectorAll(".video-slide");
const videoScrollButtons = document.querySelectorAll("[data-video-scroll]");
const carouselScrollButtons = document.querySelectorAll("[data-carousel-scroll]");
const galleryScrollButtons = document.querySelectorAll("[data-gallery-scroll]");
const galleryGrid = document.querySelector("[data-gallery-grid]");
const galleryModal = document.querySelector("#gallery-modal");
const galleryPreviewImage = document.querySelector("[data-gallery-preview-image]");
const galleryPreviewDescription = document.querySelector("[data-gallery-preview-description]");
const galleryCloseButtons = document.querySelectorAll("[data-gallery-close]");
const galleryPreview = galleryPreviewImage?.closest(".gallery-preview");
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
const faqItems = document.querySelectorAll(".faq-list details");
const certificateModal = document.querySelector("#certificate-proof-modal");
const certificateTriggers = document.querySelectorAll("[data-certificate-image]");
const certificateCloseButtons = document.querySelectorAll("[data-certificate-close]");
const certificatePreviewImage = document.querySelector("[data-certificate-preview-image]");
const certificatePreviewTitle = document.querySelector("[data-certificate-preview-title]");
const certificatePreviewPlaceholder = document.querySelector("[data-certificate-preview-placeholder]");
const certificatePreview = certificatePreviewImage?.closest(".certificate-preview");
const heroCarousel = document.querySelector("[data-hero-carousel]");
const heroCarouselSlides = heroCarousel?.querySelectorAll("[data-hero-slide]") || [];
const heroCarouselDotsContainer = heroCarousel?.querySelector("[data-hero-carousel-dots]");
const heroCarouselPrevious = heroCarousel?.querySelector("[data-hero-carousel-previous]");
const heroCarouselNext = heroCarousel?.querySelector("[data-hero-carousel-next]");
let heroCarouselDots = [];
let testimonialIndex = 0;
let writtenTestimonialsTimer;
let learningCarouselTimer;
let heroCarouselIndex = 0;
let heroCarouselTimer;
let heroCarouselTouchStart = 0;

if (nav && headerCta && !nav.querySelector(".mobile-nav-cta")) {
  const mobileCta = headerCta.cloneNode(true);
  mobileCta.classList.remove("header-cta");
  mobileCta.classList.add("mobile-nav-cta");
  mobileCta.removeAttribute("aria-current");
  nav.appendChild(mobileCta);
}

courseVisualImages.forEach((image) => {
  image.addEventListener("error", () => {
    image.hidden = true;
  });
});

function setupTestimonialPortrait(image) {
  const source = image.dataset.src;
  if (!source) return;

  const portrait = new Image();
  portrait.onload = () => {
    image.src = source;
    image.hidden = false;
  };
  portrait.onerror = () => {
    image.hidden = true;
  };
  portrait.src = source;
}

testimonialPortraits.forEach(setupTestimonialPortrait);

function getGoogleDrivePreviewUrl(source) {
  const filePathMatch = source.match(/drive\.google\.com\/file\/d\/([^/?#]+)/i);
  const fileIdMatch = source.match(/[?&]id=([^&#]+)/i);
  const fileId = filePathMatch?.[1] || fileIdMatch?.[1];
  return fileId ? `https://drive.google.com/file/d/${encodeURIComponent(fileId)}/preview` : "";
}

function setupTestimonialVideo(player) {
  const source = player.dataset.videoUrl?.trim();
  if (!source) return;

  const title = player.dataset.videoTitle || "Video testimonial";
  const drivePreviewUrl = getGoogleDrivePreviewUrl(source);

  if (drivePreviewUrl) {
    const iframe = document.createElement("iframe");
    iframe.src = drivePreviewUrl;
    iframe.title = title;
    iframe.loading = "lazy";
    iframe.allow = "autoplay; fullscreen";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.setAttribute("allowfullscreen", "");
    player.replaceChildren(iframe);
    player.classList.add("has-video");
    return;
  }

  if (/\.(mp4|webm|ogg)(?:[?#].*)?$/i.test(source)) {
    const video = document.createElement("video");
    video.src = source;
    video.controls = true;
    video.playsInline = true;
    video.preload = "metadata";
    if (player.dataset.videoThumbnail) video.poster = player.dataset.videoThumbnail;
    video.setAttribute("aria-label", title);
    player.replaceChildren(video);
    player.classList.add("has-video");
  }
}

testimonialVideoPlayers.forEach(setupTestimonialVideo);

if (heroCarouselDotsContainer) {
  heroCarouselDotsContainer.innerHTML = Array.from(heroCarouselSlides, (_, index) => `
    <button
      type="button"
      data-hero-carousel-dot="${index}"
      aria-label="Show image ${index + 1}"
      aria-current="${index === 0}"
      class="${index === 0 ? "is-active" : ""}"
    ></button>
  `).join("");
  heroCarouselDotsContainer.classList.toggle("is-many", heroCarouselSlides.length > 6);
  heroCarouselDots = heroCarouselDotsContainer.querySelectorAll("[data-hero-carousel-dot]");
}

function showHeroCarouselSlide(index) {
  if (!heroCarouselSlides.length) return;

  heroCarouselIndex = (index + heroCarouselSlides.length) % heroCarouselSlides.length;

  heroCarouselSlides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === heroCarouselIndex;
    slide.classList.toggle("is-active", isActive);
    slide.setAttribute("aria-hidden", String(!isActive));
  });

  heroCarouselDots.forEach((dot, dotIndex) => {
    const isActive = dotIndex === heroCarouselIndex;
    dot.classList.toggle("is-active", isActive);
    dot.setAttribute("aria-current", String(isActive));
  });
}

function stopHeroCarouselAutoplay() {
  if (!heroCarouselTimer) return;
  window.clearInterval(heroCarouselTimer);
  heroCarouselTimer = undefined;
}

function startHeroCarouselAutoplay() {
  if (
    heroCarouselSlides.length < 2 ||
    document.hidden ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  stopHeroCarouselAutoplay();
  heroCarouselTimer = window.setInterval(() => {
    showHeroCarouselSlide(heroCarouselIndex + 1);
  }, 5000);
}

function moveHeroCarousel(direction) {
  showHeroCarouselSlide(heroCarouselIndex + direction);
}

if (heroCarousel) {
  heroCarouselPrevious?.addEventListener("click", () => moveHeroCarousel(-1));
  heroCarouselNext?.addEventListener("click", () => moveHeroCarousel(1));

  heroCarouselDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      showHeroCarouselSlide(Number(dot.dataset.heroCarouselDot));
    });
  });

  heroCarousel.addEventListener("mouseenter", stopHeroCarouselAutoplay);
  heroCarousel.addEventListener("mouseleave", startHeroCarouselAutoplay);
  heroCarousel.addEventListener("focusin", stopHeroCarouselAutoplay);
  heroCarousel.addEventListener("focusout", (event) => {
    if (!heroCarousel.contains(event.relatedTarget)) {
      startHeroCarouselAutoplay();
    }
  });
  heroCarousel.addEventListener("touchstart", (event) => {
    heroCarouselTouchStart = event.changedTouches[0]?.clientX || 0;
    stopHeroCarouselAutoplay();
  }, { passive: true });
  heroCarousel.addEventListener("touchend", (event) => {
    const touchEnd = event.changedTouches[0]?.clientX || 0;
    const distance = touchEnd - heroCarouselTouchStart;

    if (Math.abs(distance) > 48) {
      showHeroCarouselSlide(heroCarouselIndex + (distance < 0 ? 1 : -1));
    }

    startHeroCarouselAutoplay();
  }, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopHeroCarouselAutoplay();
    } else {
      startHeroCarouselAutoplay();
    }
  });

  showHeroCarouselSlide(0);
  startHeroCarouselAutoplay();
}

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

function renderResultCard(result) {
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
      </div>
    </article>
  `;
}

function renderFeaturedResult(result) {
  const schoolLocation = formatSchoolLocation(result);
  const score = result.score ? `Score: ${escapeHtml(result.score)}` : "";
  const meta = [schoolLocation, score].filter(Boolean).join(" | ");

  return `
    <article>
      <div class="distinction-avatar">${renderResultPhoto(result)}</div>
      <div>
        <strong>${escapeHtml(result.name)}</strong>
        ${result.designation ? `<span>${escapeHtml(result.designation)}</span>` : ""}
        ${meta ? `<small>${meta}</small>` : ""}
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

function setResultsMessage(grid, message) {
  grid.innerHTML = `<p class="results-message">${escapeHtml(message)}</p>`;
}

function renderResults(payload) {
  const groups = payload.groups || {};
  const featured = payload.featured || {};

  resultGrids.forEach((grid) => {
    const groupKey = grid.dataset.resultsGrid;
    const results = groups[groupKey] || [];
    if (!results.length) {
      setResultsMessage(grid, "No published distinction holders yet.");
      return;
    }

    grid.innerHTML = results.map(renderResultCard).join("");
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
    renderResults(payload);
  } catch (error) {
    resultGrids.forEach((grid) => {
      setResultsMessage(grid, "Results are being updated. Please check back soon.");
    });
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
        const caption = post.caption ? post.caption.slice(0, 130) : "Recent Edu Lead International update.";
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
  if ((!certificateModal || certificateModal.hidden) && (!galleryModal || galleryModal.hidden)) {
    document.body.classList.remove("modal-open");
  }
}

function setCertificatePreviewImage(src, title) {
  if (!certificatePreviewImage) return;

  certificatePreview?.classList.remove("is-loaded");
  certificatePreviewImage.hidden = true;
  certificatePreviewImage.removeAttribute("src");
  certificatePreviewImage.alt = "";
  if (certificatePreviewPlaceholder) certificatePreviewPlaceholder.hidden = false;

  if (!src) return;

  const preview = new Image();
  preview.onload = () => {
    certificatePreviewImage.src = src;
    certificatePreviewImage.alt = `${title} preview`;
    certificatePreviewImage.hidden = false;
    if (certificatePreviewPlaceholder) certificatePreviewPlaceholder.hidden = true;
    certificatePreview?.classList.add("is-loaded");
  };
  preview.onerror = () => {
    certificatePreview?.classList.remove("is-loaded");
    certificatePreviewImage.hidden = true;
    if (certificatePreviewPlaceholder) certificatePreviewPlaceholder.hidden = false;
  };
  preview.src = src;
}

function openCertificateModal(trigger) {
  if (!certificateModal || !trigger) return false;

  const title = trigger.dataset.certificateTitle || "Certificate preview";
  const image = trigger.dataset.certificateImage || "";

  if (certificatePreviewTitle) certificatePreviewTitle.textContent = title;
  setCertificatePreviewImage(image, title);
  certificateModal.hidden = false;
  document.body.classList.add("modal-open");
  certificateModal.querySelector("[data-certificate-close]")?.focus();
  return true;
}

function closeCertificateModal() {
  if (!certificateModal) return;

  certificateModal.hidden = true;
  if ((!enquiryModal || enquiryModal.hidden) && (!galleryModal || galleryModal.hidden)) {
    document.body.classList.remove("modal-open");
  }
}

function setGalleryPreviewImage(src, title) {
  if (!galleryPreviewImage) return;

  galleryPreview?.classList.remove("is-loaded");
  galleryPreviewImage.hidden = true;
  galleryPreviewImage.removeAttribute("src");
  galleryPreviewImage.alt = "";

  if (!src) return;

  const preview = new Image();
  preview.onload = () => {
    galleryPreviewImage.src = src;
    galleryPreviewImage.alt = title;
    galleryPreviewImage.hidden = false;
    galleryPreview?.classList.add("is-loaded");
  };
  preview.onerror = () => {
    galleryPreview?.classList.remove("is-loaded");
    galleryPreviewImage.hidden = true;
  };
  preview.src = src;
}

function openGalleryModal(trigger) {
  if (!galleryModal || !trigger) return false;

  const title = trigger.dataset.galleryTitle || "Gallery image";
  const description = trigger.dataset.galleryDescription || "";
  const image = trigger.dataset.galleryImage || "";

  if (galleryPreviewDescription) galleryPreviewDescription.textContent = description;
  setGalleryPreviewImage(image, title);
  galleryModal.hidden = false;
  document.body.classList.add("modal-open");
  galleryModal.querySelector(".modal-close[data-gallery-close]")?.focus();
  return true;
}

function closeGalleryModal() {
  if (!galleryModal) return;

  galleryModal.hidden = true;
  if ((!enquiryModal || enquiryModal.hidden) && (!certificateModal || certificateModal.hidden)) {
    document.body.classList.remove("modal-open");
  }
}

function setupGalleryItem(item) {
  const imagePath = item.dataset.galleryImage;
  const media = item.querySelector(".gallery-item-media");
  const title = item.dataset.galleryTitle || "Gallery image";

  if (imagePath && media && !media.querySelector("img")) {
    const image = new Image();
    image.onload = () => {
      const thumbnail = document.createElement("img");
      thumbnail.src = imagePath;
      thumbnail.alt = title;
      media.appendChild(thumbnail);
    };
    image.src = imagePath;
  }

  item.addEventListener("click", () => {
    openGalleryModal(item);
  });
}

function renderGalleryItem(item, index) {
  const number = String(index + 1).padStart(2, "0");
  const description = item.description || "";
  const image = item.imageUrl || item.image_url || "";

  return `
    <button type="button" class="gallery-item" data-gallery-title="${escapeHtml(description || "Edu Lead training gallery image")}" data-gallery-description="${escapeHtml(description)}" data-gallery-image="${escapeHtml(image)}">
      <span class="gallery-item-media" aria-hidden="true"><strong>${number}</strong></span>
      <span class="gallery-item-copy"><small>${escapeHtml(description)}</small></span>
    </button>
  `;
}

function initializeGalleryItems() {
  document.querySelectorAll("[data-gallery-image]").forEach(setupGalleryItem);
}

async function loadGallery() {
  if (!galleryGrid) return;

  try {
    const response = await fetch("/api/gallery");
    if (!response.ok) throw new Error("Gallery unavailable");

    const payload = await response.json();
    if (!payload.gallery?.length) {
      initializeGalleryItems();
      return;
    }

    galleryGrid.innerHTML = payload.gallery.map(renderGalleryItem).join("");
    initializeGalleryItems();
  } catch (error) {
    initializeGalleryItems();
  }
}

function testimonialMeta(item) {
  return [item.designation, item.school, item.city].filter(Boolean).join(", ");
}

function renderTestimonialPortrait(item, className) {
  const initials = escapeHtml(getInitials(item.name) || "EL");
  const portrait = item.portraitUrl
    ? `<img class="testimonial-portrait" data-testimonial-portrait data-src="${escapeHtml(item.portraitUrl)}" alt="${escapeHtml(item.name)}" hidden>`
    : "";

  return `<div class="${className}"><span aria-hidden="true">${initials}</span>${portrait}</div>`;
}

function renderWrittenTestimonial(item, container) {
  const meta = testimonialMeta(item);

  if (container.classList.contains("student-testimonial-grid")) {
    return `
      <article>
        ${renderTestimonialPortrait(item, "student-avatar")}
        <p>${escapeHtml(item.quote)}</p>
        <strong>${escapeHtml(item.name)}</strong>
        ${meta ? `<span>${escapeHtml(meta)}</span>` : ""}
      </article>
    `;
  }

  return `
    <article class="written-testimonial-card">
      ${renderTestimonialPortrait(item, "person-photo")}
      <div class="written-testimonial-content">
        <div><span class="quote-mark" aria-hidden="true">&ldquo;</span></div>
        <p>${escapeHtml(item.quote)}</p>
        <div class="testimonial-person">
          <strong>${escapeHtml(item.name)}</strong>
          ${item.designation ? `<span>${escapeHtml(item.designation)}</span>` : ""}
          ${[item.school, item.city].filter(Boolean).length ? `<small>${escapeHtml([item.school, item.city].filter(Boolean).join(", "))}</small>` : ""}
        </div>
      </div>
    </article>
  `;
}

function renderVideoTestimonial(item) {
  const meta = testimonialMeta(item);

  return `
    <article class="video-testimonial-card">
      <div
        class="local-video-placeholder"
        data-testimonial-video
        data-video-url="${escapeHtml(item.videoUrl)}"
        data-video-thumbnail="${escapeHtml(item.videoThumbnailUrl || "")}"
        data-video-title="Video testimonial from ${escapeHtml(item.name)}"
      ><span>Video testimonial</span></div>
      <div>
        <h3>${escapeHtml(item.name)}</h3>
        ${meta ? `<p>${escapeHtml(meta)}</p>` : ""}
      </div>
    </article>
  `;
}

function testimonialsForContainer(items, container) {
  const type = container.dataset.testimonialsType;
  const course = container.dataset.testimonialsCourse;

  return items.filter((item) => {
    if (item.type !== type) return false;
    if (course === "all") return true;
    return item.courseSlug === course;
  });
}

function renderDynamicTestimonials(items) {
  testimonialContainers.forEach((container) => {
    const matches = testimonialsForContainer(items, container);
    if (!matches.length) return;

    container.innerHTML = matches
      .map((item) =>
        item.type === "video"
          ? renderVideoTestimonial(item)
          : renderWrittenTestimonial(item, container)
      )
      .join("");
    container.dataset.itemCount = String(matches.length);
    container.querySelectorAll("[data-testimonial-portrait]").forEach(setupTestimonialPortrait);
    container.querySelectorAll("[data-testimonial-video]").forEach(setupTestimonialVideo);
    updateCarouselControls(container);
  });
}

async function loadTestimonials() {
  if (!testimonialContainers.length) return;

  try {
    const response = await fetch("/api/testimonials");
    if (!response.ok) throw new Error("Testimonials unavailable");
    const payload = await response.json();
    if (!payload.testimonials?.length) return;
    renderDynamicTestimonials(payload.testimonials);
  } catch (error) {
    // Keep the curated HTML testimonials as a fallback.
  }
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

  if (event.key === "Escape" && certificateModal && !certificateModal.hidden) {
    closeCertificateModal();
  }

  if (event.key === "Escape" && galleryModal && !galleryModal.hidden) {
    closeGalleryModal();
  }
});

certificateTriggers.forEach((trigger) => {
  const imagePath = trigger.dataset.certificateImage;
  const media = trigger.querySelector(".certificate-proof-media");

  if (imagePath && media) {
    const image = new Image();
    image.onload = () => {
      const thumbnail = document.createElement("img");
      thumbnail.src = imagePath;
      thumbnail.alt = "";
      media.appendChild(thumbnail);
    };
    image.src = imagePath;
  }

  trigger.addEventListener("click", () => {
    openCertificateModal(trigger);
  });
});

certificateCloseButtons.forEach((button) => {
  button.addEventListener("click", closeCertificateModal);
});

galleryCloseButtons.forEach((button) => {
  button.addEventListener("click", closeGalleryModal);
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

faqItems.forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;

    faqItems.forEach((otherItem) => {
      if (otherItem !== item) otherItem.open = false;
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

function getCarouselStep(carousel) {
  const firstItem = carousel.firstElementChild;
  if (!firstItem) return carousel.clientWidth;

  const styles = window.getComputedStyle(carousel);
  const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
  return firstItem.getBoundingClientRect().width + gap;
}

function getCarouselControlButtons(carousel) {
  return Array.from(carouselScrollButtons).filter(
    (button) => button.dataset.carouselScroll === carousel.id
  );
}

function updateCarouselControls(carousel) {
  const buttons = getCarouselControlButtons(carousel);
  if (!buttons.length) return;

  const controls = buttons[0].closest(".testimonial-carousel-controls");
  const maxScroll = Math.max(0, carousel.scrollWidth - carousel.clientWidth);
  const hasOverflow = maxScroll > 4;

  if (controls) controls.hidden = !hasOverflow;

  buttons.forEach((button) => {
    const isPrevious = button.dataset.direction !== "next";
    button.disabled = !hasOverflow ||
      (isPrevious ? carousel.scrollLeft <= 4 : carousel.scrollLeft >= maxScroll - 4);
  });
}

const controlledCarousels = Array.from(
  new Set(
    Array.from(carouselScrollButtons)
      .map((button) => document.getElementById(button.dataset.carouselScroll))
      .filter(Boolean)
  )
);

carouselScrollButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const carousel = document.getElementById(button.dataset.carouselScroll);
    if (!carousel) return;

    const direction = button.dataset.direction === "next" ? 1 : -1;
    carousel.scrollBy({ left: direction * getCarouselStep(carousel), behavior: "smooth" });
  });
});

controlledCarousels.forEach((carousel) => {
  carousel.dataset.itemCount = String(carousel.children.length);
  let updateFrame;
  carousel.addEventListener("scroll", () => {
    window.cancelAnimationFrame(updateFrame);
    updateFrame = window.requestAnimationFrame(() => updateCarouselControls(carousel));
  }, { passive: true });
});

function updateAllCarouselControls() {
  controlledCarousels.forEach(updateCarouselControls);
}

window.addEventListener("resize", updateAllCarouselControls);
window.addEventListener("load", updateAllCarouselControls);
window.requestAnimationFrame(updateAllCarouselControls);

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
loadGallery();
loadTestimonials();
