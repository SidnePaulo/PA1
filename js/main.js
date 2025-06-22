
// ===== MAIN APPLICATION =====

class TechPhoneApp {
    constructor() {
        this.components = {};
        this.state = {
          theme: 'light',
          currentTestimonial: 0,
          activeFilter: 'all'
        };
        this.init();
      }
    
      async init() {
        await this.loadComponents();
        this.setupEventListeners();
        this.initializeComponents();
        this.hideLoading();
      }
    
      async loadComponents() {
        // Initialize main components
        this.components.navigation = new NavigationComponent();
        this.components.testimonials = new TestimonialsComponent();
        this.components.products = new ProductsComponent();
        this.components.theme = new ThemeController();
      }
    
      setupEventListeners() {
        // Smooth scrolling for navigation
        $$('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = $(anchor.getAttribute('href'));
            if (target) {
              smoothScrollTo(target);
              // Update active nav link
              this.updateActiveNavLink(anchor);
            }
          });
        });
    
        // Back to top button
        const backToTop = $('#backToTop');
        if (backToTop) {
          backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          });
        }
    
        // Hero buttons
        const watchDemo = $('#watchDemo');
        if (watchDemo) {
          watchDemo.addEventListener('click', () => {
            this.showDemo();
          });
        }
    
        // Window events
        window.addEventListener('scroll', throttle(() => {
          this.handleScroll();
        }, 16));
    
        window.addEventListener('resize', debounce(() => {
          this.handleResize();
        }, 250));
      }
    
      initializeComponents() {
        // Initialize counter animations
        this.initCounters();
        
        // Initialize product filters
        this.initProductFilters();
        
        // Initialize theme
        this.components.theme.init();
        
        // Initialize navigation
        this.components.navigation.init();
        
        // Initialize testimonials slider
        this.components.testimonials.init();
        
        // Initialize products
        this.components.products.init();
      }
    
      initCounters() {
        const counters = $$('[data-count]');
        let countersAnimated = false;
    
        const animateCountersOnScroll = () => {
          if (countersAnimated) return;
          
          const heroSection = $('#inicio');
          if (heroSection && isInViewport(heroSection)) {
            countersAnimated = true;
            counters.forEach(counter => {
              const target = parseInt(counter.dataset.count);
              animateNumber(counter, target, 2000);
            });
          }
        };
    
        window.addEventListener('scroll', throttle(animateCountersOnScroll, 100));
        animateCountersOnScroll(); // Check on load
      }
    
      initProductFilters() {
        const filterBtns = $$('.filter-btn');
        const productCards = $$('.product-card');
    
        filterBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            this.filterProducts(filter);
            this.updateActiveFilter(btn);
          });
        });
      }
    
      filterProducts(filter) {
        const productCards = $$('.product-card');
        
        productCards.forEach(card => {
          const category = card.dataset.category;
          const shouldShow = filter === 'all' || category === filter;
          
          if (shouldShow) {
            card.style.display = 'block';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 100);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      }
    
      updateActiveFilter(activeBtn) {
        $$('.filter-btn').forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
      }
    
      updateActiveNavLink(activeLink) {
        $$('.nav-link').forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
      }
    
      handleScroll() {
        const scrollY = window.pageYOffset;
        
        // Update header
        const header = $('.header');
        if (header) {
          if (scrollY > 50) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
        }
    
        // Update back to top button
        const backToTop = $('#backToTop');
        if (backToTop) {
          if (scrollY > window.innerHeight) {
            backToTop.classList.add('visible');
          } else {
            backToTop.classList.remove('visible');
          }
        }
    
        // Update active navigation based on scroll position
        this.updateNavigationOnScroll();
      }
    
      updateNavigationOnScroll() {
        const sections = $$('section[id]');
        const navLinks = $$('.nav-link[data-section]');
        
        let currentSection = '';
        
        sections.forEach(section => {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = section.id;
          }
        });
        
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.dataset.section === currentSection) {
            link.classList.add('active');
          }
        });
      }
    
      handleResize() {
        // Handle responsive behavior
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
          this.enableMobileView();
        } else {
          this.disableMobileView();
        }
      }
    
      enableMobileView() {
        // Mobile-specific functionality
        const heroContent = $('.hero-content');
        if (heroContent) {
          heroContent.style.gridTemplateColumns = '1fr';
          heroContent.style.textAlign = 'center';
        }
      }
    
      disableMobileView() {
        // Desktop-specific functionality
        const heroContent = $('.hero-content');
        if (heroContent) {
          heroContent.style.gridTemplateColumns = '1fr 1fr';
          heroContent.style.textAlign = 'left';
        }
      }
    
      showDemo() {
        // Create modal for demo
        const modal = createElement('div', {
          className: 'demo-modal',
          innerHTML: `
            <div class="demo-content">
              <button class="demo-close">&times;</button>
              <h2>Demo del Producto</h2>
              <div class="demo-video">
                <div class="video-placeholder">
                  <div class="play-btn">▶</div>
                  <p>Demo interactivo del TechPhone</p>
                </div>
              </div>
            </div>
          `
        });
    
        // Add styles
        modal.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          opacity: 0;
          transition: opacity 0.3s ease;
        `;
    
        document.body.appendChild(modal);
        
        // Animate in
        setTimeout(() => {
          modal.style.opacity = '1';
        }, 10);
    
        // Close functionality
        const closeBtn = modal.querySelector('.demo-close');
        const closeModal = () => {
          modal.style.opacity = '0';
          setTimeout(() => {
            document.body.removeChild(modal);
          }, 300);
        };
    
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
          if (e.target === modal) closeModal();
        });
      }
    
      hideLoading() {
        const loader = $('.loading-screen');
        if (loader) {
          setTimeout(() => {
            loader.classList.add('hidden');
          }, 1000);
        }
      }
    
      // Public API methods
      setTheme(theme) {
        this.components.theme.setTheme(theme);
      }
    
      nextTestimonial() {
        this.components.testimonials.next();
      }
    
      prevTestimonial() {
        this.components.testimonials.prev();
      }
    }
    
    // Theme Controller
    class ThemeController {
      constructor() {
        this.currentTheme = storage.get('theme') || 'light';
      }
    
      init() {
        this.applyTheme(this.currentTheme);
        this.setupToggle();
      }
    
      setupToggle() {
        const toggle = $('#themeToggle');
        if (toggle) {
          toggle.addEventListener('click', () => {
            this.toggleTheme();
          });
        }
      }
    
      toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
      }
    
      setTheme(theme) {
        this.currentTheme = theme;
        this.applyTheme(theme);
        storage.set('theme', theme);
        
        const toggle = $('#themeToggle');
        if (toggle) {
          const icon = toggle.querySelector('.theme-icon');
          if (icon) {
            icon.textContent = theme === 'light' ? '🌙' : '☀️';
          }
        }
      }
    
      applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
      }
    }
    
    // Initialize app when DOM is ready
    ready(() => {
      window.techPhoneApp = new TechPhoneApp();
      
      // Global error handling
      window.addEventListener('error', (e) => {
        handleError(e.error, 'Global Error Handler');
      });
    
      // Performance monitoring
      if ('performance' in window) {
        window.addEventListener('load', () => {
          setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart);
          }, 0);
        });
      }
    });
    
    // Service Worker Registration (if available)
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('SW registered: ', registration);
          })
          .catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
    
    // Export for global access
    window.TechPhoneApp = TechPhoneApp;
    window.ThemeController = ThemeController;    