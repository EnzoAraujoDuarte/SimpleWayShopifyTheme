/**
 * @class ProductSlideItem
 * @extends HTMLElement
 * @description A custom web component that represents a single item in the product slider.
 * It automatically creates a swiper-slide container and includes a product-card.
 * 
 * @example
 * // Usage in HTML/Liquid
 * <product-slide-item data-handle="product-handle"></product-slide-item>
 */
class ProductSlideItem extends HTMLElement {
  /**
   * Creates an instance of ProductSlideItem.
   */
  constructor() {
    super();
    this.initialized = false;
  }

  /**
   * Lifecycle callback when the element is added to the DOM.
   * Creates the product card and necessary structure.
   * @override
   */
  connectedCallback() {
    if (this.initialized) return;
    
    this.className = 'swiper-slide';
    this.setupProductCard();
    this.initialized = true;
  }

  /**
   * Sets up the product card inside the slide.
   * @private
   */
  setupProductCard() {
    const productHandle = this.dataset.handle;
    if (!productHandle) {
      console.error('Product handle is required for product-slide-item');
      return;
    }

    // Only create product card if it doesn't exist
    if (!this.querySelector('product-card')) {
      const productCard = document.createElement('div');
      productCard.innerHTML = `<product-card data-handle="${productHandle}"></product-card>`;
      this.appendChild(productCard.firstElementChild);
    }
  }
}

/**
 * @class ProductSlide
 * @extends HTMLElement
 * @description A custom web component that creates a responsive product slider using Swiper.js.
 * The slider automatically adapts to different screen sizes, showing 2 products on mobile,
 * 3 on tablet, and 4 on desktop.
 * 
 * @example
 * // Usage in HTML/Liquid
 * <product-slide data-title="Recommended Products" data-link="/collections/all">
 *   <product-slide-item data-handle="product-1"></product-slide-item>
 *   <product-slide-item data-handle="product-2"></product-slide-item>
 * </product-slide>
 */
class ProductSlide extends HTMLElement {
  /**
   * Creates an instance of ProductSlide.
   * Initializes the Swiper instance and state tracking variables.
   */
  constructor() {
    super();
    /** @private {Swiper|null} Reference to the Swiper instance */
    this.swiper = null;
    /** @private {boolean} Flag to track initialization state */
    this.isInitialized = false;
    /** @private {number|null} Reference to the interval check */
    this.swiperCheckInterval = null;
  }

  /**
   * Lifecycle callback when the element is added to the DOM.
   * Ensures Swiper is only initialized after the page and required resources are loaded.
   * @override
   */
  connectedCallback() {
    if (this.isInitialized) return;

    // Setup structure only once
    this.setupSliderStructure();

    // Wait for both window load and Swiper to be available
    if (document.readyState === 'complete') {
      this.waitForSwiper();
    } else {
      window.addEventListener('load', () => this.waitForSwiper(), { once: true });
    }
  }

  /**
   * Lifecycle callback when the element is removed from the DOM.
   * Cleans up Swiper instance.
   * @override
   */
  disconnectedCallback() {
    this.destroySwiper();
    if (this.swiperCheckInterval) {
      clearInterval(this.swiperCheckInterval);
      this.swiperCheckInterval = null;
    }
  }

  /**
   * Waits for the Swiper library to be available before initialization.
   * Implements a polling mechanism with a timeout.
   * @private
   */
  waitForSwiper() {
    if (this.isInitialized) return;

    // Clear any existing interval
    if (this.swiperCheckInterval) {
      clearInterval(this.swiperCheckInterval);
      this.swiperCheckInterval = null;
    }

    // Check if Swiper is available
    if (typeof Swiper !== 'undefined') {
      this.initSwiper();
      this.isInitialized = true;
      return;
    }

    // Poll for Swiper availability
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds with 100ms interval

    this.swiperCheckInterval = setInterval(() => {
      attempts++;
      
      if (typeof Swiper !== 'undefined') {
        clearInterval(this.swiperCheckInterval);
        this.swiperCheckInterval = null;
        this.initSwiper();
        this.isInitialized = true;
      } else if (attempts >= maxAttempts) {
        clearInterval(this.swiperCheckInterval);
        this.swiperCheckInterval = null;
        console.error('Swiper failed to load within timeout period');
      }
    }, 100);
  }

  /**
   * Sets up the HTML structure required for the Swiper slider.
   * @private
   */
  setupSliderStructure() {
    // Only setup if not already done
    if (this.querySelector('.swiper')) return;

    // Add overflow-hidden to the parent container
    this.className = 'overflow-hidden block w-full';

    // Add title if provided
    if (this.dataset.title && !this.querySelector('.product-slide__title')) {
      const titleElement = document.createElement('h2');
      titleElement.className = 'product-slide__title text-2xl tablet:text-4xl inline-block';
      titleElement.textContent = this.dataset.title;

      // Create a container for title and link
      const titleContainer = document.createElement('div');
      titleContainer.className = 'flex items-center justify-between px-4 mb-5 mt-5';
      titleContainer.appendChild(titleElement);

      // If data-link is present, add the View All link
      if (this.dataset.link) {
        const viewAllLink = document.createElement('a');
        viewAllLink.href = this.dataset.link;
        viewAllLink.textContent = 'View All';
        viewAllLink.className = 'product-slider-view-all-btn';
        titleContainer.appendChild(viewAllLink);
      }

      this.insertBefore(titleContainer, this.firstChild);
    }

    // Create wrapper and container for Swiper
    const swiperWrapper = document.createElement('div');
    swiperWrapper.className = 'swiper overflow-visible px-4';

    const swiperContainer = document.createElement('div');
    swiperContainer.className = 'swiper-wrapper';

    // Move existing product-slide-items into the swiper container
    const items = Array.from(this.children).filter(
      child => child.tagName?.toLowerCase() === 'product-slide-item'
    );
    
    items.forEach(item => swiperContainer.appendChild(item));

    swiperWrapper.appendChild(swiperContainer);

    // Add navigation
    const prevButton = document.createElement('div');
    prevButton.className = 'swiper-button-prev hidden -top-[40px] right-[70px] left-auto tablet:flex';
    const nextButton = document.createElement('div');
    nextButton.className = 'swiper-button-next hidden -top-[40px] right-[20px] left-auto tablet:flex';

    swiperWrapper.appendChild(prevButton);
    swiperWrapper.appendChild(nextButton);

    this.appendChild(swiperWrapper);
  }

  /**
   * Getter for Swiper configuration options.
   * @returns {Object} Configuration object for Swiper initialization
   * @private
   */
  get swiperConfig() {
    return {
      slidesPerView: 1.6, // Mobile default
      spaceBetween: 20,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        // Tablet
        768: {
          slidesPerView: 3,
        },
        // Desktop
        1024: {
          slidesPerView: 4,
        }
      }
    };
  }

  /**
   * Initializes the Swiper instance with the configured options.
   * @private
   */
  initSwiper() {
    if (this.swiper) return;

    const swiperElement = this.querySelector('.swiper');
    if (swiperElement) {
      this.swiper = new Swiper(swiperElement, this.swiperConfig);
    }
  }

  /**
   * Destroys the Swiper instance and cleans up references.
   * @private
   */
  destroySwiper() {
    if (this.swiper) {
      this.swiper.destroy(true, true);
      this.swiper = null;
    }
  }
}

// Register both web components
customElements.define('product-slide-item', ProductSlideItem);
customElements.define('product-slide', ProductSlide); 