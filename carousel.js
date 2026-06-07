// Carousel
var lightbox = document.getElementById('lightbox');
var lightboxImg = lightbox.querySelector('img');
var lightboxPrev = lightbox.querySelector('.lightbox-prev');
var lightboxNext = lightbox.querySelector('.lightbox-next');
var lightboxState = { slides: [], current: 0 };

document.querySelectorAll('.carousel').forEach(function (carousel) {
  var track = carousel.querySelector('.carousel-track');
  var slides = carousel.querySelectorAll('.carousel-slide');
  var dotsContainer = carousel.querySelector('.carousel-dots');
  var prevBtn = carousel.querySelector('.carousel-prev');
  var nextBtn = carousel.querySelector('.carousel-next');
  var interval = parseInt(carousel.dataset.interval) || 3000;
  var current = 0;
  var timer;

  // Build dots
  slides.forEach(function (_, i) {
    var dot = document.createElement('button');
    if (i === 0) dot.className = 'active';
    dot.addEventListener('click', function (e) {
      e.stopPropagation();
      goTo(i);
      resetTimer();
    });
    dotsContainer.appendChild(dot);
  });
  var dots = dotsContainer.querySelectorAll('button');

  // Single slide: hide arrows
  if (slides.length <= 1) {
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
  }

  function goTo(index) {
    current = ((index % slides.length) + slides.length) % slides.length;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach(function (d, i) { d.className = i === current ? 'active' : ''; });
  }

  function next() {
    goTo(current + 1);
  }

  function prev() {
    goTo(current - 1);
  }

  function resetTimer() {
    stopTimer();
    startTimer();
  }

  function startTimer() {
    stopTimer();
    timer = setInterval(next, interval);
  }

  function stopTimer() {
    clearInterval(timer);
  }

  // Arrow buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      prev();
      resetTimer();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      next();
      resetTimer();
    });
  }

  // Click carousel → lightbox (image carousels only)
  carousel.addEventListener('click', function (e) {
    if (e.target.closest('.carousel-btn') || e.target.closest('.carousel-dots button')) {
      return;
    }
    // Only open lightbox if slides contain images
    var allSlides = [];
    slides.forEach(function (s) {
      var img = s.querySelector('img');
      if (img) allSlides.push(img.src);
    });
    if (allSlides.length === 0) return;
    lightboxState.slides = allSlides;
    lightboxState.current = current;
    updateLightbox();
    lightbox.classList.add('open');
  });

  // Hover pause
  carousel.addEventListener('mouseenter', stopTimer);
  carousel.addEventListener('mouseleave', startTimer);

  startTimer();
});

// Lightbox navigation
function updateLightbox() {
  lightboxImg.src = lightboxState.slides[lightboxState.current] || '';
  lightboxPrev.style.display = lightboxState.slides.length > 1 ? 'flex' : 'none';
  lightboxNext.style.display = lightboxState.slides.length > 1 ? 'flex' : 'none';
}

lightboxPrev.addEventListener('click', function (e) {
  e.stopPropagation();
  if (lightboxState.slides.length === 0) return;
  lightboxState.current = ((lightboxState.current - 1) + lightboxState.slides.length) % lightboxState.slides.length;
  updateLightbox();
});

lightboxNext.addEventListener('click', function (e) {
  e.stopPropagation();
  if (lightboxState.slides.length === 0) return;
  lightboxState.current = (lightboxState.current + 1) % lightboxState.slides.length;
  updateLightbox();
});

// Lightbox close
lightbox.addEventListener('click', function (e) {
  if (e.target === this || e.target.closest('.lightbox-close')) {
    this.classList.remove('open');
  }
});

document.addEventListener('keydown', function (e) {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') {
    lightbox.classList.remove('open');
  } else if (e.key === 'ArrowLeft') {
    lightboxState.current = ((lightboxState.current - 1) + lightboxState.slides.length) % lightboxState.slides.length;
    updateLightbox();
  } else if (e.key === 'ArrowRight') {
    lightboxState.current = (lightboxState.current + 1) % lightboxState.slides.length;
    updateLightbox();
  }
});
