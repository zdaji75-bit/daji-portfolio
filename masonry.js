(function () {
  var container = document.querySelector('.masonry');
  if (!container) return;

  var gap = 6;

  function getCols() {
    var w = window.innerWidth;
    if (w <= 480) return 2;
    if (w <= 768) return 3;
    return 4;
  }

  function layout() {
    var cols = getCols();
    var cw = container.offsetWidth;
    var colW = (cw - gap * (cols - 1)) / cols;

    // Reset — return everything to flow so heights measure correctly
    var allItems = container.querySelectorAll('.masonry-item');
    allItems.forEach(function (it) {
      it.style.position = '';
      it.style.width = '';
      it.style.left = '';
      it.style.top = '';
    });
    var labels = container.querySelectorAll('.masonry-label-row');
    labels.forEach(function (lb) {
      lb.style.position = '';
      lb.style.top = '';
    });
    container.style.height = '';

    // Group children by label breaks
    var groups = [];
    var cur = { items: [] };
    Array.from(container.children).forEach(function (el) {
      if (el.classList.contains('masonry-label-row')) {
        groups.push(cur);
        cur = { label: el, items: [] };
      } else if (el.classList.contains('masonry-item')) {
        cur.items.push(el);
      }
    });
    groups.push(cur);

    var totalY = 0;

    groups.forEach(function (g) {
      // Label
      if (g.label) {
        g.label.style.position = 'relative';
        g.label.style.top = totalY + 'px';
        totalY += g.label.offsetHeight;
      }

      if (g.items.length === 0) return;

      var heights = new Array(cols).fill(totalY);

      g.items.forEach(function (item) {
        item.style.position = 'absolute';
        item.style.width = colW + 'px';

        var h = item.offsetHeight;
        if (h < 20) h = colW * 9 / 16; // fallback for unloaded videos

        var short = 0;
        for (var i = 1; i < cols; i++) {
          if (heights[i] < heights[short]) short = i;
        }

        item.style.left = (short * (colW + gap)) + 'px';
        item.style.top = heights[short] + 'px';

        heights[short] += h + gap;
      });

      totalY = Math.max.apply(null, heights);
    });

    container.style.height = totalY + 'px';
  }

  // Initial layout
  layout();

  // Relayout on resize (debounced)
  var timer;
  window.addEventListener('resize', function () {
    clearTimeout(timer);
    timer = setTimeout(layout, 120);
  });

  // Relayout after video metadata loads (heights may change)
  var videos = container.querySelectorAll('video');
  var pending = videos.length;
  if (pending === 0) return;

  videos.forEach(function (v) {
    if (v.readyState >= 1) {
      pending--;
      if (pending === 0) layout();
    } else {
      v.addEventListener('loadedmetadata', function () {
        pending--;
        if (pending <= 0) layout();
      }, { once: true });
      // Fallback: relayout after a short delay even if metadata never fires
      v.addEventListener('loadeddata', function () {
        layout();
      }, { once: true });
    }
  });

  // Safety net: relayout after window load
  window.addEventListener('load', function () {
    layout();
  });
})();
