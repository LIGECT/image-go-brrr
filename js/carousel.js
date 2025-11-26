class Carousel {
  constructor(containerSelector, options = {}) {
    const defaultOptions = {
      autoplay: true,
      interval: 3000,
      loop: true,
    };
    this.options = { ...defaultOptions, ...options };

    this.container = document.querySelector(containerSelector);

    if (!this.container) {
      console.error(
        `Container with selector "${containerSelector}" not found.`
      );
      return;
    }

    this.isTransitioning = false;

    this.wrapContents();
    this.originalCount = this.strip.children.length;
    this.setupClones();
    this.currentIndex = 1;
    this.autoplayInterval = null;

    this.goToSlide(this.currentIndex, false);

    this.boundTransitionEndHandler = this.handleTransitionEnd.bind(this);
    this.boundMouseEnterHandler = this.handleMouseEnter.bind(this);
    this.boundMouseLeaveHandler = this.handleMouseLeave.bind(this);
    this.boundDotsClickHandler = this.handleDotsClick.bind(this);
    this.boundArrowsPrevHandler = this.handlerArrowsPrev.bind(this);
    this.boundArrowsNextHandler = this.handlerArrowsNext.bind(this);

    this.strip.addEventListener(
      'transitionend',
      this.boundTransitionEndHandler
    );

    this.container.addEventListener('mouseenter', this.boundMouseEnterHandler);
    this.container.addEventListener('mouseleave', this.boundMouseLeaveHandler);

    this.setupDots();
    this.setupArrows();
    if (this.options.autoplay) {
      this.startAutoplay();
    }
  }

  createBlock(tagName, className) {
    const element = document.createElement(tagName);
    element.className = className;
    return element;
  }

  wrapContents() {
    const frame = this.createBlock('div', 'carousel-frame');

    const strip = this.createBlock('div', 'carousel-strip');

    const children = Array.from(this.container.children);

    children.forEach((child) => {
      strip.appendChild(child);
    });

    frame.appendChild(strip);

    this.container.innerHTML = '';
    this.container.appendChild(frame);

    this.strip = strip;
    this.frame = frame;
  }

  setupClones() {
    const first = this.strip.children[0];
    const last = this.strip.children[this.strip.children.length - 1];

    const firstClone = first.cloneNode(true);
    const lastClone = last.cloneNode(true);

    this.strip.appendChild(firstClone);
    this.strip.insertBefore(lastClone, first);
  }

  goToSlide(index, withAnimation = true) {
    if (!this.strip) {
      console.error('Strip element not found. Was it initialized?');
      return;
    }

    if (withAnimation) {
      this.strip.style.transition = 'transform 0.5s ease-in-out';
    } else {
      this.strip.style.transition = 'none';
    }

    this.strip.style.transform = `translateX(-${100 * index}%)`;
  }

  handleTransitionEnd() {
    if (this.currentIndex === this.originalCount + 1) {
      if (this.options.loop) {
        this.currentIndex = 1;
        this.goToSlide(this.currentIndex, false);
        this.updateActiveDot();
      } else {
        this.currentIndex = this.originalCount;
        this.goToSlide(this.currentIndex, false);
        this.updateActiveDot();
        this.stopAutoplay();
      }
      this.isTransitioning = false;
      return;
    }

    if (this.currentIndex === 0) {
      if (this.options.loop) {
        this.currentIndex = this.originalCount;
        this.goToSlide(this.currentIndex, false);
        this.updateActiveDot();
      } else {
        this.currentIndex = 1;
        this.goToSlide(this.currentIndex, false);
        this.updateActiveDot();
        this.stopAutoplay();
      }
      this.isTransitioning = false;
      return;
    }

    this.isTransitioning = false;
  }

  nextSlide() {
    if (this.isTransitioning) return;
    this.stopAutoplay();
    this.isTransitioning = true;
    this.currentIndex++;
    this.goToSlide(this.currentIndex);
    this.updateActiveDot();
    if (this.options.autoplay) {
      this.startAutoplay();
    }
  }

  prevSlide() {
    if (this.isTransitioning) return;
    this.stopAutoplay();
    this.isTransitioning = true;
    this.currentIndex--;
    this.goToSlide(this.currentIndex);
    this.updateActiveDot();
    if (this.options.autoplay) {
      this.startAutoplay();
    }
  }

  setupDots() {
    const dotsContainer = this.createBlock('div', 'carousel-dots');

    for (let i = 0; i < this.originalCount; i++) {
      const dots = this.createBlock('button', 'dots-nav');
      dots.dataset.index = `${i}`;
      dotsContainer.appendChild(dots);
    }
    this.container.appendChild(dotsContainer);

    this.dotsContainer = dotsContainer;
    dotsContainer.addEventListener('click', this.boundDotsClickHandler);
    this.updateActiveDot();
  }

  updateActiveDot() {
    if (!this.dotsContainer) return;

    const dots = this.dotsContainer.querySelectorAll('.dots-nav');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === this.currentIndex - 1);
    });
  }

  setupArrows() {
    this.arrowPrev = this.createBlock(
      'button',
      'carousel-arrow carousel-arrow--prev'
    );

    this.arrowNext = this.createBlock(
      'button',
      'carousel-arrow carousel-arrow--next'
    );

    this.arrowPrev.innerHTML = `
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>`;

    this.arrowNext.innerHTML = `
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>`;

    this.arrowPrev.addEventListener('click', this.boundArrowsPrevHandler);
    this.arrowNext.addEventListener('click', this.boundArrowsNextHandler);

    this.container.appendChild(this.arrowPrev);
    this.container.appendChild(this.arrowNext);
  }

  handlerArrowsPrev() {
    this.prevSlide();
  }

  handlerArrowsNext() {
    this.nextSlide();
  }

  handleDotsClick(e) {
    if (e.target.classList.contains('dots-nav')) {
      if (this.isTransitioning) return;

      const dotIndex = parseInt(e.target.dataset.index, 10);
      const targetIndex = dotIndex + 1;

      if (targetIndex === this.currentIndex) return;

      this.stopAutoplay();
      this.isTransitioning = true;
      this.currentIndex = targetIndex;
      this.goToSlide(this.currentIndex);
      this.updateActiveDot();
      if (this.options.autoplay) {
        this.startAutoplay();
      }
    }
  }

  startAutoplay() {
    if (this.autoplayInterval !== null) {
      return;
    }

    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, this.options.interval);
  }

  stopAutoplay() {
    if (this.autoplayInterval !== null) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  handleMouseEnter() {
    if (this.options.autoplay) {
      this.stopAutoplay();
    }
  }

  handleMouseLeave() {
    if (this.options.autoplay) {
      this.startAutoplay();
    }
  }

  destroy() {
    this.stopAutoplay();

    if (this.strip && this.boundTransitionEndHandler) {
      this.strip.removeEventListener(
        'transitionend',
        this.boundTransitionEndHandler
      );
    }

    if (this.container) {
      this.container.removeEventListener(
        'mouseenter',
        this.boundMouseEnterHandler
      );
      this.container.removeEventListener(
        'mouseleave',
        this.boundMouseLeaveHandler
      );
    }

    if (this.dotsContainer && this.boundDotsClickHandler) {
      this.dotsContainer.removeEventListener(
        'click',
        this.boundDotsClickHandler
      );
    }

    this.container = null;
    this.strip = null;
    this.frame = null;
    this.dotsContainer = null;
  }
}

const carousel = new Carousel('#my-carousel');
