// Carousel
document.querySelectorAll('.carousel').forEach(function (carousel) {
  var track = carousel.querySelector('.carousel-track');
  var slides = carousel.querySelectorAll('.carousel-slide');
  var dotsContainer = carousel.querySelector('.carousel-dots');
  var interval = parseInt(carousel.dataset.interval) || 3000;
  var current = 0;
  var timer;

  // Build dots
  slides.forEach(function (_, i) {
    var dot = document.createElement('button');
    if (i === 0) dot.className = 'active';
    dot.addEventListener('click', function () { goTo(i); });
    dotsContainer.appendChild(dot);
  });
  var dots = dotsContainer.querySelectorAll('button');

  function goTo(index) {
    current = index;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach(function (d, i) { d.className = i === current ? 'active' : ''; });
  }

  function next() {
    goTo((current + 1) % slides.length);
  }

  function startTimer() {
    stopTimer();
    timer = setInterval(next, interval);
  }

  function stopTimer() {
    clearInterval(timer);
  }

  // Click carousel → lightbox
  carousel.addEventListener('click', function (e) {
    if (e.target.closest('.carousel-dots button')) {
      stopTimer();
      startTimer();
      return;
    }
    var slide = carousel.querySelectorAll('.carousel-slide')[current];
    var img = slide.querySelector('img');
    if (!img) return;
    var lb = document.getElementById('lightbox');
    lb.querySelector('img').src = img.src;
    lb.classList.add('open');
  });

  // Hover pause
  carousel.addEventListener('mouseenter', stopTimer);
  carousel.addEventListener('mouseleave', startTimer);

  startTimer();
});

// Lightbox close
document.getElementById('lightbox').addEventListener('click', function (e) {
  if (e.target === this || e.target.closest('.lightbox-close')) {
    this.classList.remove('open');
  }
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    document.getElementById('lightbox').classList.remove('open');
  }
});
