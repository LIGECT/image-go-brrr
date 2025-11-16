class Carousel {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.currentIndex = 0;

    if (!this.container) {
      console.error(
        `Container with selector "${containerSelector}" not found.`
      );
      return;
    }

    this.wrapContents();
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

  goToSlide(index) {
    if (!this.strip) {
      console.error('Strip element not found. Was it initialized?');
      return;
    }

    this.strip.style.transform = `translateX(-${100 * index}%)`;
  }

  nextSlide() {
    const numSlides = this.strip.children.length;
    this.currentIndex = (this.currentIndex + 1) % numSlides;
    this.goToSlide(this.currentIndex);
  }

  prevSlide() {
    const numSlides = this.strip.children.length;
    this.currentIndex = (this.currentIndex - 1 + numSlides) % numSlides;
    this.goToSlide(this.currentIndex);
  }
}

let myCarousel;

document.addEventListener('DOMContentLoaded', () => {
  myCarousel = new Carousel('#my-carousel');
});

document.getElementById('wrapper').addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    const action = e.target.dataset.action;

    if (action === 'prev') {
      myCarousel.prevSlide();
    } else if (action === 'next') {
      myCarousel.nextSlide();
    }
  }
});
