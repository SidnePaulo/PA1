
// ===== ANIMATION CONTROLLER =====

class AnimationController {
    constructor() {
      this.animations = new Map();
      this.observers = new Map();
      this.init();
    }
  
    init() {
      this.setupIntersectionObserver();
      this.setupScrollAnimations();
      this.setupParallaxEffects();
    }
  
    // Intersection Observer for scroll animations
    setupIntersectionObserver() {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px'
      };
  
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateElement(entry.target);
          }
        });
      }, observerOptions);
  
      // Observe elements with animation attributes
      $$('[data-aos]').forEach(element => {
        observer.observe(element);
      });
  
      this.observers.set('main', observer);
    }
  
    // Animate element when it comes into view
    animateElement(element) {
      const animationType = element.dataset.aos || 'fade-up';
      const delay = element.dataset.delay || 0;
      
      setTimeout(() => {
        element.classList.add('aos-animate');
        
        // Add specific animation class
        switch (animationType) {
          case 'fade-up':
            element.classList.add('animate-fade-in-up');
            break;
          case 'fade-down':
            element.classList.add('animate-fade-in-down');
            break;
          case 'fade-left':
            element.classList.add('animate-fade-in-left');
            break;
          case 'fade-right':
            element.classList.add('animate-fade-in-right');
            break;
          case 'scale-in':
            element.classList.add('animate-scale-in');
            break;
          case 'flip-x':
            element.classList.add('animate-flip-in-x');
            break;
          case 'flip-y':
            element.classList.add('animate-flip-in-y');
            break;
          default:
            element.classList.add('animate-fade-in-up');
        }
      }, delay);
    }
  
    // Setup scroll-based animations
    setupScrollAnimations() {
      const handleScroll = throttle(() => {
        this.updateScrollAnimations();
      }, 16);
  
      window.addEventListener('scroll', handleScroll);
    }
  
    updateScrollAnimations() {
      const scrollY = window.pageYOffset;
      const windowHeight = window.innerHeight;
  
      // Parallax background shapes
      const shapes = $$('.shape');
      shapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.2);
        const yPos = scrollY * speed;
        shape.style.transform = `translateY(${yPos}px)`;
      });
  
      // Header background blur effect
      const header = $('.header');
      if (header) {
        if (scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
  
      // Back to top button
      const backToTop = $('#backToTop');
      if (backToTop) {
        if (scrollY > windowHeight) {
          backToTop.classList.add('visible');
        } else {
          backToTop.classList.remove('visible');
        }
      }
    }
  
    // Setup parallax effects
    setupParallaxEffects() {
      const parallaxElements = $$('.parallax');
      
      if (parallaxElements.length === 0) return;
  
      const handleScroll = throttle(() => {
        const scrollY = window.pageYOffset;
        
        parallaxElements.forEach(element => {
          const speed = element.dataset.speed || 0.5;
          const yPos = scrollY * speed;
          element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
      }, 16);
  
      window.addEventListener('scroll', handleScroll);
    }
  
    // Counter animation
    animateCounters() {
      const counters = $$('[data-count]');
      
      counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);
        const duration = 2000;
        
        if (isInViewport(counter) && !counter.classList.contains('animated')) {
          counter.classList.add('animated');
          animateNumber(counter, target, duration);
        }
      });
    }
  
    // Stagger animations
    staggerAnimation(elements, delay = 100) {
      elements.forEach((element, index) => {
        setTimeout(() => {
          element.classList.add('animate-fade-in-up');
        }, index * delay);
      });
    }
  
    // Typing animation
    typeWriter(element, text, speed = 50) {
      let i = 0;
      element.innerHTML = '';
      
      const timer = setInterval(() => {
        if (i < text.length) {
          element.innerHTML += text.charAt(i);
          i++;
        } else {
          clearInterval(timer);
        }
      }, speed);
    }
  
    // Particle animation
    createParticles(container, count = 50) {
      for (let i = 0; i < count; i++) {
        const particle = createElement('div', {
          className: 'particle',
          style: `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            pointer-events: none;
            animation: float ${random(3, 6)}s ease-in-out infinite;
            animation-delay: ${random(0, 2000)}ms;
            top: ${random(0, 100)}%;
            left: ${random(0, 100)}%;
          `
        });
        
        container.appendChild(particle);
      }
    }
  
    // Morphing animations
    morphElement(element, from, to, duration = 1000) {
      const steps = 60;
      const stepDuration = duration / steps;
      let currentStep = 0;
  
      const animate = () => {
        if (currentStep <= steps) {
          const progress = currentStep / steps;
          const eased = this.easeInOutQuad(progress);
          
          // Interpolate between from and to values
          Object.keys(from).forEach(prop => {
            const fromValue = from[prop];
            const toValue = to[prop];
            const currentValue = fromValue + (toValue - fromValue) * eased;
            element.style[prop] = currentValue + (prop.includes('scale') ? '' : 'px');
          });
          
          currentStep++;
          setTimeout(animate, stepDuration);
        }
      };
      
      animate();
    }
  
    // Easing functions
    easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
  
    easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }
  
    // Loading animation
    showLoading() {
      const loader = $('.loading-screen');
      if (loader) {
        loader.classList.remove('hidden');
      }
    }
  
    hideLoading() {
      const loader = $('.loading-screen');
      if (loader) {
        setTimeout(() => {
          loader.classList.add('hidden');
        }, 500);
      }
    }
  
    // Shake animation for errors
    shake(element) {
      element.classList.add('animate-shake');
      setTimeout(() => {
        element.classList.remove('animate-shake');
      }, 500);
    }
  
    // Success animation
    success(element) {
      element.classList.add('animate-bounce');
      setTimeout(() => {
        element.classList.remove('animate-bounce');
      }, 1000);
    }
  
    // Cleanup animations
    cleanup() {
      this.observers.forEach(observer => observer.disconnect());
      this.animations.clear();
    }
  }
  
  // Initialize animation controller
  let animationController;
  
  ready(() => {
    animationController = new AnimationController();
    
    // Setup scroll-triggered counter animations
    const handleCounters = throttle(() => {
      animationController.animateCounters();
    }, 100);
    
    window.addEventListener('scroll', handleCounters);
    
    // Initial check for counters
    animationController.animateCounters();
  });
  
  // Export for global use
  window.AnimationController = AnimationController;
  