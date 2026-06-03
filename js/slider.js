/* ============================================================
   آکادمی زبان حسین فرج پور - اسلایدر ساده
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {
  initSliders();
});

function initSliders() {
  document.querySelectorAll('.slider-container').forEach(function(container) {
    const track = container.querySelector('.slider-track');
    const prevBtn = container.querySelector('.slider-prev');
    const nextBtn = container.querySelector('.slider-next');
    if (!track) return;

    let position = 0;
    const items = track.children;
    const itemWidth = items[0] ? items[0].offsetWidth + 24 : 300;
    const maxPosition = Math.max(0, (items.length * itemWidth) - container.offsetWidth);

    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        position = Math.min(position + itemWidth, maxPosition);
        track.style.transform = 'translateX(' + position + 'px)';
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function() {
        position = Math.max(position - itemWidth, 0);
        track.style.transform = 'translateX(' + position + 'px)';
      });
    }

    // Touch support
    let startX = 0;
    let currentX = 0;
    track.addEventListener('touchstart', function(e) {
      startX = e.touches[0].clientX;
    });
    track.addEventListener('touchmove', function(e) {
      currentX = e.touches[0].clientX;
    });
    track.addEventListener('touchend', function() {
      const diff = startX - currentX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          position = Math.min(position + itemWidth, maxPosition);
        } else {
          position = Math.max(position - itemWidth, 0);
        }
        track.style.transform = 'translateX(' + position + 'px)';
      }
    });
  });
}
