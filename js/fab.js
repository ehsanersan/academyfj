/* ============================================================
   آکادمی زبان حسین فرج پور - Floating Action Button
   دکمه چندمنظوره شناور
   ============================================================ */

class FloatingActionButton {
  constructor() {
    this.isOpen = false;
    this.init();
  }

  init() {
    this.createElements();
    this.bindEvents();
  }

  createElements() {
    const container = document.createElement('div');
    container.className = 'fab-container';
    container.innerHTML = `
      <div class="fab-menu" id="fabMenu">
        <a href="tel:09173673306" class="fab-item call">
          📞
          <span class="fab-tooltip">تماس مستقیم</span>
        </a>
        <a href="https://wa.me/989173673306" target="_blank" class="fab-item whatsapp">
          💬
          <span class="fab-tooltip">پیام در واتساپ</span>
        </a>
        <a href="https://instagram.com/Hossein_Farajpour_" target="_blank" class="fab-item instagram">
          📷
          <span class="fab-tooltip">اینستاگرام</span>
        </a>
        <a href="placement-test.html" class="fab-item consult">
          🎯
          <span class="fab-tooltip">مشاوره رایگان</span>
        </a>
      </div>
      <button class="fab-main" id="fabMain" aria-label="منوی دسترسی سریع">
        ✦
      </button>
    `;
    document.body.appendChild(container);

    this.mainBtn = document.getElementById('fabMain');
    this.menu = document.getElementById('fabMenu');
  }

  bindEvents() {
    this.mainBtn.addEventListener('click', () => this.toggle());
    
    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.fab-container') && this.isOpen) {
        this.close();
      }
    });

    // Close on scroll (optional)
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (this.isOpen) {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          // Keep open if user is still scrolling
        }, 150);
      }
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    this.mainBtn.classList.add('active');
    this.menu.classList.add('active');
    this.mainBtn.innerHTML = '✕';
  }

  close() {
    this.isOpen = false;
    this.mainBtn.classList.remove('active');
    this.menu.classList.remove('active');
    this.mainBtn.innerHTML = '✦';
  }
}

// Initialize FAB when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.fab = new FloatingActionButton();
});
