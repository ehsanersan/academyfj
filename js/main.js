/* ============================================================
   آکادمی زبان حسین فرج پور - اسکریپت اصلی
   با پشتیبانی دارک مود هوشمند
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {
  initTheme();
  initHeader();
  initMobileMenu();
  initAccordion();
  initBackToTop();
  initFadeAnimations();
  initFilters();
  renderDynamicContent();
});

/* ---------- Smart Theme Toggle (Dark Mode) ---------- */
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const themeToggleMobile = document.getElementById('themeToggleMobile');
  
  // Check saved preference or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  } else if (systemPrefersDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcon('dark');
  }
  
  // Toggle theme on click
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  }
  
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', toggleTheme);
  }
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (!localStorage.getItem('theme')) {
      const newTheme = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      updateThemeIcon(newTheme);
    }
  });
}

function updateThemeIcon(theme) {
  const icons = document.querySelectorAll('.theme-toggle');
  icons.forEach(function(icon) {
    icon.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    icon.setAttribute('aria-label', theme === 'dark' ? 'حالت روشن' : 'حالت تیره');
  });
}

/* ---------- Header Scroll Effect ---------- */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;
  
  function checkScroll() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  
  window.addEventListener('scroll', checkScroll);
  checkScroll();
}

/* ---------- Mobile Menu ---------- */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const overlay = document.querySelector('.mobile-overlay');
  if (!hamburger || !mobileMenu) return;

  function closeMenu() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function() {
    const isActive = mobileMenu.classList.contains('active');
    if (isActive) {
      closeMenu();
    } else {
      hamburger.classList.add('active');
      mobileMenu.classList.add('active');
      if (overlay) overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });

  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  mobileMenu.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', closeMenu);
  });
  
  // Close on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeMenu();
  });
}

/* ---------- Accordion ---------- */
function initAccordion() {
  document.querySelectorAll('.accordion-header').forEach(function(header) {
    header.addEventListener('click', function() {
      const accordion = this.parentElement;
      const body = accordion.querySelector('.accordion-body');
      const isActive = accordion.classList.contains('active');

      // Close all in same container
      const parent = accordion.parentElement;
      parent.querySelectorAll('.accordion').forEach(function(item) {
        item.classList.remove('active');
        item.querySelector('.accordion-body').style.maxHeight = null;
      });

      if (!isActive) {
        accordion.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

/* ---------- Back to Top ---------- */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 500) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });
  
  btn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------- Fade-in Animations ---------- */
function initFadeAnimations() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  
  elements.forEach(function(el) { observer.observe(el); });
}

/* ---------- Filter Functionality ---------- */
function initFilters() {
  document.querySelectorAll('.filter-bar').forEach(function(bar) {
    bar.querySelectorAll('.filter-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        bar.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        
        const filter = btn.dataset.filter;
        const container = document.querySelector(bar.dataset.target);
        if (!container) return;
        
        container.querySelectorAll('[data-category]').forEach(function(item) {
          if (filter === 'all' || item.dataset.category === filter || item.dataset.category.includes(filter)) {
            item.style.display = '';
            item.style.animation = 'fadeIn 0.4s ease';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  });
}

/* ---------- Render Dynamic Content ---------- */
function renderDynamicContent() {
  // Render testimonials
  const testimonialsGrid = document.getElementById('testimonials-grid');
  if (testimonialsGrid && typeof testimonials !== 'undefined') {
    testimonialsGrid.innerHTML = testimonials.slice(0, 3).map(function(t) {
      const stars = '★'.repeat(t.rating) + '☆'.repeat(5 - t.rating);
      return '<div class="testimonial-card fade-in">' +
        '<div class="stars">' + stars + '</div>' +
        '<p class="text">«' + t.text + '»</p>' +
        '<div class="author">' +
          '<div class="author-avatar">' + t.name.charAt(0) + '</div>' +
          '<div class="author-info">' +
            '<h4>' + t.name + '</h4>' +
            '<span>' + t.city + ' • ' + t.courseType + '</span>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
    initFadeAnimations();
  }

  // Render courses
  const coursesGrid = document.getElementById('courses-grid');
  if (coursesGrid && typeof courses !== 'undefined') {
    const icons = { 'online': '💻', 'in-person': '🏫', 'offline': '📱' };
    coursesGrid.innerHTML = courses.map(function(c) {
      const icon = icons[c.type] || '📚';
      return '<div class="course-card fade-in" data-category="' + c.type + '">' +
        '<div class="course-card-image">' + icon +
          '<span class="badge badge-accent">' + c.badge + '</span>' +
        '</div>' +
        '<div class="course-card-body">' +
          '<h3>' + c.title + '</h3>' +
          '<p>' + c.shortDesc + '</p>' +
          '<div class="course-card-meta">' +
            '<span>📊 ' + c.level + '</span>' +
            '<span>⏱ ' + c.duration + '</span>' +
            '<span>🎯 ' + c.typeLabel + '</span>' +
          '</div>' +
          '<div class="course-card-price">' + c.price + ' <small>تومان</small></div>' +
          '<div class="course-card-actions">' +
            '<a href="course-detail.html?slug=' + c.slug + '" class="btn btn-primary btn-sm">مشاهده جزئیات</a>' +
            '<a href="enroll.html?course=' + c.id + '" class="btn btn-accent btn-sm">ثبت‌نام</a>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
    initFadeAnimations();
  }

  // Render blog posts
  const blogGrid = document.getElementById('blog-grid');
  if (blogGrid && typeof blogPosts !== 'undefined') {
    blogGrid.innerHTML = blogPosts.map(function(p) {
      return '<div class="blog-card fade-in" data-category="' + p.category + '">' +
        '<div class="blog-card-image">📝</div>' +
        '<div class="blog-card-body">' +
          '<span class="badge badge-purple">' + p.category + '</span>' +
          '<h3><a href="blog-detail.html?slug=' + p.slug + '">' + p.title + '</a></h3>' +
          '<p>' + p.excerpt + '</p>' +
          '<div class="blog-card-footer">' +
            '<span>📅 ' + p.date + '</span>' +
            '<span>⏱ ' + p.readTime + ' مطالعه</span>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
    initFadeAnimations();
  }

  // Render videos
  const videosGrid = document.getElementById('videos-grid');
  if (videosGrid && typeof videos !== 'undefined') {
    videosGrid.innerHTML = videos.map(function(v) {
      return '<div class="video-card fade-in" data-category="' + v.category + '">' +
        '<div class="video-card-thumb">' +
          '<div class="play-btn">▶</div>' +
          '<span class="duration">' + v.duration + '</span>' +
        '</div>' +
        '<div class="video-card-body">' +
          '<span class="badge badge-primary" style="margin-bottom:10px">' + v.category + '</span>' +
          '<h3><a href="video-detail.html?slug=' + v.slug + '" style="color:inherit">' + v.title + '</a></h3>' +
          '<p>' + v.description + '</p>' +
        '</div>' +
      '</div>';
    }).join('');
    initFadeAnimations();
  }

  // Render FAQs
  const faqList = document.getElementById('faq-list');
  if (faqList && typeof faqs !== 'undefined') {
    faqList.innerHTML = faqs.map(function(f) {
      return '<div class="accordion">' +
        '<div class="accordion-header">' +
          '<span>' + f.question + '</span>' +
          '<span class="icon">+</span>' +
        '</div>' +
        '<div class="accordion-body">' +
          '<div class="accordion-body-inner">' + f.answer + '</div>' +
        '</div>' +
      '</div>';
    }).join('');
    initAccordion();
  }
}
