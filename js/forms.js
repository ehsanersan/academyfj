/* ============================================================
   آکادمی زبان حسین فرج پور - مدیریت فرم‌ها
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {
  initAllForms();
});

function initAllForms() {
  // Contact Form
  setupForm('contact-form', ['name', 'phone', 'subject', 'message'], 'پیام شما با موفقیت ارسال شد. به زودی با شما تماس خواهیم گرفت.');

  // Consultation Form
  setupForm('consultation-form', ['name', 'phone', 'courseType'], 'درخواست مشاوره شما ثبت شد. به زودی با شما تماس خواهیم گرفت.');

  // Placement Test Form
  setupForm('placement-form', ['name', 'phone', 'age', 'city'], 'درخواست تعیین سطح شما ثبت شد. نتیجه دقیق‌تر پس از بررسی مدرس برای شما ارسال می‌شود.');

  // Free Demo Form
  setupForm('demo-form', ['name', 'phone', 'messenger'], 'درخواست نمونه درس رایگان ثبت شد. لینک دانلود برای شما ارسال خواهد شد.');

  // Enroll Form
  setupForm('enroll-form', ['name', 'phone', 'city', 'course'], 'درخواست ثبت‌نام شما با موفقیت ثبت شد. منتظر تماس ما باشید.');

  // Checkout Form
  setupForm('checkout-form', ['name', 'phone'], null, function() {
    window.location.href = 'payment-success.html';
  });
}

function setupForm(formId, requiredFields, successMessage, callback) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Honeypot check
    const honeypot = form.querySelector('.ohnohoney input');
    if (honeypot && honeypot.value !== '') {
      return; // Bot detected
    }

    // Validate
    let isValid = true;
    requiredFields.forEach(function(field) {
      const input = form.querySelector('[name="' + field + '"]');
      if (!input) return;
      const errorEl = input.parentElement.querySelector('.form-error');

      if (!input.value.trim()) {
        isValid = false;
        input.classList.add('error');
        if (errorEl) { errorEl.classList.add('show'); errorEl.textContent = 'این فیلد الزامی است'; }
      } else {
        input.classList.remove('error');
        if (errorEl) errorEl.classList.remove('show');
      }

      // Phone validation
      if (field === 'phone' && input.value.trim()) {
        const phoneRegex = /^09[0-9]{9}$/;
        if (!phoneRegex.test(input.value.trim())) {
          isValid = false;
          input.classList.add('error');
          if (errorEl) { errorEl.classList.add('show'); errorEl.textContent = 'شماره تماس معتبر نیست (مثال: 09173673306)'; }
        }
      }
    });

    if (!isValid) return;

    // Collect data
    const formData = {};
    new FormData(form).forEach(function(value, key) {
      if (key !== 'honeypot') {
        formData[key] = value;
      }
    });

    // Save to localStorage
    const savedForms = JSON.parse(localStorage.getItem('academy_forms') || '[]');
    formData._formId = formId;
    formData._timestamp = new Date().toISOString();
    savedForms.push(formData);
    localStorage.setItem('academy_forms', JSON.stringify(savedForms));

    // Log to console
    console.log('Form submitted:', formId, formData);

    if (callback) {
      callback();
      return;
    }

    // Show success
    const successEl = form.parentElement.querySelector('.form-success');
    if (successEl && successMessage) {
      successEl.textContent = successMessage;
      successEl.classList.add('show');
      form.style.display = 'none';
      window.scrollTo({ top: successEl.offsetTop - 100, behavior: 'smooth' });
    }
  });

  // Real-time validation
  form.querySelectorAll('.input, .textarea, .select').forEach(function(input) {
    input.addEventListener('input', function() {
      input.classList.remove('error');
      const errorEl = input.parentElement.querySelector('.form-error');
      if (errorEl) errorEl.classList.remove('show');
    });
  });
}
