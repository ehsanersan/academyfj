/* ============================================================
   آکادمی زبان حسین فرج پور - ربات مشاور هوشمند
   ============================================================ */

class ChatBot {
  constructor() {
    this.isOpen = false;
    this.currentStep = 'greeting';
    this.userData = {
      name: '',
      phone: '',
      interest: '',
      messages: []
    };
    this.responses = {
      greeting: 'سلام دوست من! 👋\n\nخوشحالم که به آکادمی زبان حسین فرج پور سر زدی. چطور می‌تونم بهت کمک کنم؟',
      options: [
        { text: 'می‌خوام زبان یاد بگیرم', value: 'learn' },
        { text: 'درباره دوره‌ها بگو', value: 'courses' },
        { text: 'قیمت‌ها چطوره؟', value: 'pricing' },
        { text: 'مشاوره رایگان می‌خوام', value: 'consult' }
      ],
      learn: 'عالیه! 🎯\n\nآموزش زبان با فیلم روش ماست. از دل فیلم‌ها و سریال‌های واقعی مکالمه یاد می‌گیری.\n\nبرای اینکه بهترین مسیر رو برات مشخص کنیم، می‌تونم یه مشاوره رایگان برات هماهنگ کنم. نظرت چیه؟',
      courses: '📚 ما سه نوع دوره داریم:\n\n🏫 حضوری - بندرعباس، قشم، کیش\n💻 آنلاین - خصوصی از سراسر ایران\n📱 آفلاین - ویدیو + PDF + پشتیبانی\n\nکدوم بیشتر به دردت می‌خوره؟',
      pricing: '💰 قیمت دوره‌ها:\n\n• آفلاین: ۱,۹۰۰,۰۰۰ تومان\n• آنلاین با فیلم: ۲,۹۰۰,۰۰۰ تومان\n• خصوصی آنلاین: ۳,۵۰۰,۰۰۰ تومان\n• حضوری: ۴,۲۰۰,۰۰۰ تومان\n\nمی‌خوای مشاوره رایگان بگیری تا بهترین گزینه رو پیدا کنی؟',
      consult: 'حتماً! 🎯\n\nبرای هماهنگی مشاوره رایگان، لطفاً اسمت رو بگو:',
      askPhone: 'ممنون {name} عزیز! 📱\n\nحالا شماره تماست رو بذار تا همکارمون باهات تماس بگیره:',
      thanks: 'عالی {name} جان! ✅\n\nاطلاعاتت ثبت شد. به زودی باهات تماس می‌گیریم.\n\n📞 اگه عجله داری می‌تونی مستقیم زنگ بزنی:\n۰۹۱۷۳۶۷۳۳۰۶',
      default: 'ممنون از پیامت! 😊\n\nبرای پاسخ دقیق‌تر، می‌تونی مستقیم با ما تماس بگیری یا مشاوره رایگان رزرو کنی.\n\n📞 ۰۹۱۷۳۶۷۳۳۰۶'
    };
    
    this.init();
  }

  init() {
    this.createElements();
    this.bindEvents();
    
    // Show greeting after 3 seconds
    setTimeout(() => {
      if (!sessionStorage.getItem('chatbot_greeted')) {
        this.showNotification();
        sessionStorage.setItem('chatbot_greeted', 'true');
      }
    }, 3000);
  }

  createElements() {
    // Create chatbot container
    const container = document.createElement('div');
    container.className = 'chatbot-container';
    container.innerHTML = `
      <button class="chatbot-toggle has-message" id="chatbotToggle" aria-label="ربات مشاور">
        💬
      </button>
      <div class="chatbot-window" id="chatbotWindow">
        <div class="chatbot-header">
          <div class="chatbot-header-info">
            <div class="chatbot-avatar">🤖</div>
            <div class="chatbot-header-text">
              <h4>مشاور آکادمی</h4>
              <span>آنلاین | پاسخ‌گویی سریع</span>
            </div>
          </div>
          <button class="chatbot-close" id="chatbotClose">✕</button>
        </div>
        <div class="chatbot-messages" id="chatbotMessages"></div>
        <div class="chatbot-input-area">
          <input type="text" class="chatbot-input" id="chatbotInput" placeholder="پیامت رو بنویس..." autocomplete="off">
          <button class="chatbot-send" id="chatbotSend">➤</button>
        </div>
      </div>
    `;
    document.body.appendChild(container);

    // Store references
    this.toggle = document.getElementById('chatbotToggle');
    this.window = document.getElementById('chatbotWindow');
    this.messages = document.getElementById('chatbotMessages');
    this.input = document.getElementById('chatbotInput');
    this.sendBtn = document.getElementById('chatbotSend');
    this.closeBtn = document.getElementById('chatbotClose');
  }

  bindEvents() {
    this.toggle.addEventListener('click', () => this.toggleChat());
    this.closeBtn.addEventListener('click', () => this.closeChat());
    this.sendBtn.addEventListener('click', () => this.sendMessage());
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.closeChat();
    });
  }

  showNotification() {
    this.toggle.classList.add('has-message');
  }

  toggleChat() {
    if (this.isOpen) {
      this.closeChat();
    } else {
      this.openChat();
    }
  }

  openChat() {
    this.isOpen = true;
    this.window.classList.add('active');
    this.toggle.classList.remove('has-message');
    this.toggle.innerHTML = '✕';
    this.input.focus();

    // Show greeting if first time
    if (this.messages.children.length === 0) {
      this.showGreeting();
    }
  }

  closeChat() {
    this.isOpen = false;
    this.window.classList.remove('active');
    this.toggle.innerHTML = '💬';
  }

  showGreeting() {
    this.addBotMessage(this.responses.greeting);
    setTimeout(() => {
      this.showOptions(this.responses.options);
    }, 800);
  }

  addBotMessage(text, showTyping = true) {
    if (showTyping) {
      this.showTyping();
      setTimeout(() => {
        this.removeTyping();
        this.appendMessage('bot', text);
      }, 1000);
    } else {
      this.appendMessage('bot', text);
    }
  }

  addUserMessage(text) {
    this.appendMessage('user', text);
    this.userData.messages.push({ role: 'user', text, time: new Date().toISOString() });
  }

  appendMessage(type, text) {
    const msg = document.createElement('div');
    msg.className = `chat-message ${type}`;
    msg.innerHTML = text.replace(/\n/g, '<br>');
    this.messages.appendChild(msg);
    this.scrollToBottom();
  }

  showTyping() {
    const typing = document.createElement('div');
    typing.className = 'chat-message bot typing';
    typing.id = 'typingIndicator';
    typing.innerHTML = '<span></span><span></span><span></span>';
    this.messages.appendChild(typing);
    this.scrollToBottom();
  }

  removeTyping() {
    const typing = document.getElementById('typingIndicator');
    if (typing) typing.remove();
  }

  showOptions(options) {
    const container = document.createElement('div');
    container.className = 'chat-options';
    
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'chat-option-btn';
      btn.textContent = opt.text;
      btn.addEventListener('click', () => {
        container.remove();
        this.handleOption(opt.value, opt.text);
      });
      container.appendChild(btn);
    });

    this.messages.appendChild(container);
    this.scrollToBottom();
  }

  handleOption(value, text) {
    this.addUserMessage(text);
    
    setTimeout(() => {
      if (this.responses[value]) {
        this.addBotMessage(this.responses[value]);
        
        // If they want consultation, start collecting info
        if (value === 'consult' || value === 'learn' || value === 'pricing') {
          this.currentStep = 'askName';
          setTimeout(() => {
            if (value !== 'consult') {
              this.addBotMessage('می‌خوای یه مشاوره رایگان برات هماهنگ کنم؟ فقط اسمت رو بگو:');
            }
            this.currentStep = 'waitingName';
          }, 1500);
        } else if (value === 'courses') {
          setTimeout(() => {
            this.showOptions([
              { text: 'حضوری', value: 'in-person' },
              { text: 'آنلاین', value: 'online' },
              { text: 'آفلاین', value: 'offline' },
              { text: 'مشاوره می‌خوام', value: 'consult' }
            ]);
          }, 1200);
        }
      } else {
        this.addBotMessage(this.responses.default);
      }
    }, 500);
  }

  sendMessage() {
    const text = this.input.value.trim();
    if (!text) return;

    this.input.value = '';
    this.addUserMessage(text);

    // Process based on current step
    setTimeout(() => {
      this.processUserInput(text);
    }, 500);
  }

  processUserInput(text) {
    if (this.currentStep === 'waitingName') {
      this.userData.name = text;
      const response = this.responses.askPhone.replace('{name}', text);
      this.addBotMessage(response);
      this.currentStep = 'waitingPhone';
    }
    else if (this.currentStep === 'waitingPhone') {
      // Validate phone
      const phoneRegex = /^09[0-9]{9}$/;
      if (phoneRegex.test(text.replace(/\s/g, ''))) {
        this.userData.phone = text;
        const response = this.responses.thanks.replace('{name}', this.userData.name);
        this.addBotMessage(response);
        this.currentStep = 'completed';
        
        // Save to storage
        this.saveUserData();
        
        // Show final options
        setTimeout(() => {
          this.showOptions([
            { text: '📞 تماس مستقیم', value: 'call' },
            { text: '💬 واتساپ', value: 'whatsapp' },
            { text: '📚 مشاهده دوره‌ها', value: 'courses-page' }
          ]);
        }, 1500);
      } else {
        this.addBotMessage('لطفاً شماره موبایل معتبر وارد کن (مثال: ۰۹۱۷۳۶۷۳۳۰۶)');
      }
    }
    else if (this.currentStep === 'completed') {
      // Handle action buttons
      if (text.includes('تماس')) {
        window.location.href = 'tel:09173673306';
      } else if (text.includes('واتساپ')) {
        window.open('https://wa.me/989173673306', '_blank');
      } else if (text.includes('دوره')) {
        window.location.href = 'courses.html';
      } else {
        this.addBotMessage(this.responses.default);
      }
    }
    else {
      // Check for keywords
      const lowerText = text.toLowerCase();
      if (lowerText.includes('دوره') || lowerText.includes('کلاس')) {
        this.handleOption('courses', text);
      } else if (lowerText.includes('قیمت') || lowerText.includes('هزینه')) {
        this.handleOption('pricing', text);
      } else if (lowerText.includes('مشاوره') || lowerText.includes('راهنما')) {
        this.handleOption('consult', text);
      } else if (lowerText.includes('فیلم') || lowerText.includes('یاد')) {
        this.handleOption('learn', text);
      } else {
        this.addBotMessage(this.responses.default);
        setTimeout(() => {
          this.showOptions(this.responses.options);
        }, 1200);
      }
    }
  }

  saveUserData() {
    // Save to localStorage for admin panel
    const leads = JSON.parse(localStorage.getItem('chatbot_leads') || '[]');
    leads.push({
      ...this.userData,
      timestamp: new Date().toISOString(),
      source: 'chatbot'
    });
    localStorage.setItem('chatbot_leads', JSON.stringify(leads));
    
    console.log('Lead saved:', this.userData);
  }

  scrollToBottom() {
    this.messages.scrollTop = this.messages.scrollHeight;
  }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.chatbot = new ChatBot();
});
