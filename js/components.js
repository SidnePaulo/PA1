
// ===== COMPONENT CONTROLLERS =====

// Navigation Component
class Navigation {
    constructor() {
      this.header = $('.header');
      this.navLinks = $('.nav-links');
      this.menuToggle = $('#menuToggle');
      this.navItems = $$('.nav-link');
      this.init();
    }
  
    init() {
      this.setupMenuToggle();
      this.setupSmoothScrolling();
      this.setupActiveNavigation();
      this.setupMobileMenu();
    }
  
    setupMenuToggle() {
      if (this.menuToggle) {
        this.menuToggle.addEventListener('click', () => {
          this.toggleMobileMenu();
        });
      }
    }
  
    toggleMobileMenu() {
      this.navLinks.classList.toggle('active');
      this.menuToggle.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    }
  
    closeMobileMenu() {
      this.navLinks.classList.remove('active');
      this.menuToggle.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  
    setupSmoothScrolling() {
      this.navItems.forEach(link => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          
          if (href.startsWith('#')) {
            e.preventDefault();
            const target = $(href);
            
            if (target) {
              smoothScrollTo(target);
              this.closeMobileMenu();
              this.setActiveNavItem(link);
            }
          }
        });
      });
    }
  
    setupActiveNavigation() {
      const sections = $$('section[id]');
      
      const observerOptions = {
        threshold: 0.3,
        rootMargin: '-80px 0px -80px 0px'
      };
  
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            const navLink = $(`.nav-link[href="#${sectionId}"]`);
            
            if (navLink) {
              this.setActiveNavItem(navLink);
            }
          }
        });
      }, observerOptions);
  
      sections.forEach(section => observer.observe(section));
    }
  
    setActiveNavItem(activeLink) {
      this.navItems.forEach(link => link.classList.remove('active'));
      activeLink.classList.add('active');
    }
  
    setupMobileMenu() {
      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!this.header.contains(e.target)) {
          this.closeMobileMenu();
        }
      });
  
      // Close menu on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeMobileMenu();
        }
      });
    }
  }
  
  // Theme Controller
  class ThemeController {
    constructor() {
      this.themeToggle = $('#themeToggle');
      this.currentTheme = storage.get('theme') || 'light';
      this.init();
    }
  
    init() {
      this.applyTheme(this.currentTheme);
      this.setupThemeToggle();
    }
  
    setupThemeToggle() {
      if (this.themeToggle) {
        this.themeToggle.addEventListener('click', () => {
          this.toggleTheme();
        });
      }
    }
  
    toggleTheme() {
      const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
      this.applyTheme(newTheme);
    }
  
    applyTheme(theme) {
      this.currentTheme = theme;
      document.documentElement.setAttribute('data-theme', theme);
      storage.set('theme', theme);
      
      // Update toggle icon
      if (this.themeToggle) {
        const icon = this.themeToggle.querySelector('.theme-icon');
        if (icon) {
          icon.textContent = theme === 'light' ? '🌙' : '☀️';
        }
      }
    }
  }
  
  // Product Filter
  class ProductFilter {
    constructor() {
      this.filterBtns = $$('.filter-btn');
      this.products = $$('.product-card');
      this.init();
    }
  
    init() {
      this.setupFilterButtons();
    }
  
    setupFilterButtons() {
      this.filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const filter = btn.dataset.filter;
          this.filterProducts(filter);
          this.setActiveFilter(btn);
        });
      });
    }
  
    filterProducts(filter) {
      this.products.forEach(product => {
        const category = product.dataset.category;
        const shouldShow = filter === 'all' || category === filter;
        
        if (shouldShow) {
          product.style.display = 'block';
          product.style.opacity = '0';
          setTimeout(() => {
            product.style.opacity = '1';
            product.style.transform = 'translateY(0)';
          }, 100);
        } else {
          product.style.opacity = '0';
          product.style.transform = 'translateY(20px)';
          setTimeout(() => {
            product.style.display = 'none';
          }, 300);
        }
      });
    }
  
    setActiveFilter(activeBtn) {
      this.filterBtns.forEach(btn => btn.classList.remove('active'));
      activeBtn.classList.add('active');
    }
  }
  
  // Testimonials Slider
  class TestimonialsSlider {
    constructor() {
      this.slider = $('#testimonialsSlider');
      this.track = $('.testimonials-track');
      this.slides = $$('.testimonial-card');
      this.prevBtn = $('#prevTestimonial');
      this.nextBtn = $('#nextTestimonial');
      this.dots = $$('.dot');
      this.currentSlide = 0;
      this.autoplayInterval = null;
      this.init();
    }
  
    init() {
      if (!this.slider) return;
      
      this.setupControls();
      this.startAutoplay();
      this.setupTouchGestures();
    }
  
    setupControls() {
      if (this.prevBtn) {
        this.prevBtn.addEventListener('click', () => {
          this.prevSlide();
        });
      }
  
      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', () => {
          this.nextSlide();
        });
      }
  
      this.dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          this.goToSlide(index);
        });
      });
    }
  
    prevSlide() {
      this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
      this.updateSlider();
    }
  
    nextSlide() {
      this.currentSlide = this.currentSlide === this.slides.length - 1 ? 0 : this.currentSlide + 1;
      this.updateSlider();
    }
  
    goToSlide(index) {
      this.currentSlide = index;
      this.updateSlider();
    }
  
    updateSlider() {
      // Update track position
      if (this.track) {
        this.track.style.transform = `translateX(-${this.currentSlide * 100}%)`;
      }
  
      // Update active slide
      this.slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === this.currentSlide);
      });
  
      // Update dots
      this.dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === this.currentSlide);
      });
    }
  
    startAutoplay() {
      this.autoplayInterval = setInterval(() => {
        this.nextSlide();
      }, 5000);
    }
  
    stopAutoplay() {
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval);
        this.autoplayInterval = null;
      }
    }
  
    setupTouchGestures() {
      if (!isTouch()) return;
  
      let startX = 0;
      let endX = 0;
  
      this.slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        this.stopAutoplay();
      });
  
      this.slider.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        this.handleSwipe();
        this.startAutoplay();
      });
    }
  
    handleSwipe() {
      const threshold = 50;
      const diff = startX - endX;
  
      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
      }
    }
  }
  
  // Hero Phone Animation
  class HeroPhoneAnimation {
    constructor() {
      this.heroPhone = $('#heroPhone');
      this.init();
    }
  
    init() {
      if (!this.heroPhone) return;
      
      this.setupInteractiveAnimation();
    }
  
    setupInteractiveAnimation() {
      this.heroPhone.addEventListener('mouseenter', () => {
        this.heroPhone.style.transform = 'scale(1.05) rotateY(10deg)';
      });
  
      this.heroPhone.addEventListener('mouseleave', () => {
        this.heroPhone.style.transform = 'scale(1) rotateY(0deg)';
      });
  
      // Mouse movement parallax
      document.addEventListener('mousemove', throttle((e) => {
        if (!isInViewport(this.heroPhone)) return;
        
        const rect = this.heroPhone.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const moveX = (e.clientX - centerX) * 0.01;
        const moveY = (e.clientY - centerY) * 0.01;
        
        this.heroPhone.style.transform = `perspective(1000px) rotateX(${-moveY}deg) rotateY(${moveX}deg)`;
      }, 16));
    }
  }
  
  // Back to Top Button
  class BackToTop {
    constructor() {
      this.button = $('#backToTop');
      this.init();
    }
  
    init() {
      if (!this.button) return;
      
      this.setupButton();
    }
  
    setupButton() {
      this.button.addEventListener('click', () => {
        smoothScrollTo(document.body);
      });
    }
  }
  
  // Watch Demo Modal (placeholder)
  class DemoModal {
    constructor() {
      this.watchDemoBtn = $('#watchDemo');
      this.init();
    }
  
    init() {
      if (!this.watchDemoBtn) return;
      
      this.watchDemoBtn.addEventListener('click', () => {
        this.showDemo();
      });
    }
  
    showDemo() {
      // Placeholder for demo modal
      alert('Demo modal will be implemented here');
    }
  }
  
  // Form Handler
  class FormHandler {
    constructor() {
      this.forms = $$('form');
      this.init();
    }
  
    init() {
      this.setupForms();
    }
  
    setupForms() {
      this.forms.forEach(form => {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleSubmit(form);
        });
      });
    }
  
    handleSubmit(form) {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      
      // Placeholder for form submission
      console.log('Form data:', data);
      
      // Show success message
      this.showSuccessMessage(form);
    }
  
    showSuccessMessage(form) {
      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = '✓ Enviado';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        form.reset();
      }, 2000);
    }
  }
  
  // Initialize all components
  ready(() => {
    try {
      new Navigation();
      new ThemeController();
      new ProductFilter();
      new TestimonialsSlider();
      new HeroPhoneAnimation();
      new BackToTop();
      new DemoModal();
      new FormHandler();
      
      console.log('All components initialized successfully');
    } catch (error) {
      handleError(error, 'Component Initialization');
    }
  });
  
  // Export components for external use
  window.Components = {
    Navigation,
    ThemeController,
    ProductFilter,
    TestimonialsSlider,
    HeroPhoneAnimation,
    BackToTop,
    DemoModal,
    FormHandler
  };