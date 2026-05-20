// Minimal carousel — auto-advance, fade transition, touch swipe
(function() {
  document.querySelectorAll('.carousel').forEach(function(el) {
    var track = el.querySelector('.carousel-track');
    var slides = track.querySelectorAll('.carousel-slide');
    var dots = el.querySelector('.carousel-dots');
    var current = 0;
    var timer = null;
    var interval = parseInt(el.dataset.interval) || 3000;
    var touchStartX = 0;
    var touchEndX = 0;

    // Build dots
    slides.forEach(function(_, i) {
      var dot = document.createElement('span');
      dot.className = 'carousel-dot';
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', function() { goTo(i); resetTimer(); });
      dots.appendChild(dot);
    });
    var allDots = dots.querySelectorAll('.carousel-dot');

    function goTo(index) {
      slides[current].classList.remove('active');
      allDots[current].classList.remove('active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
      allDots[current].classList.add('active');
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(next, interval);
    }

    // Touch
    el.addEventListener('touchstart', function(e) { touchStartX = e.touches[0].clientX; }, {passive: true});
    el.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].clientX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        diff > 0 ? next() : prev();
        resetTimer();
      }
    }, {passive: true});

    // Pause on hover
    el.addEventListener('mouseenter', function() { clearInterval(timer); });
    el.addEventListener('mouseleave', function() { resetTimer(); });

    // Start
    timer = setInterval(next, interval);
  });
})();
