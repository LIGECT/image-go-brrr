# Image Carousel

## A lightweight, dependency-free, and highly customizable image carousel library.

Status: In active development. Not ready for production use.

## Features

* Zero Dependencies: No jQuery or other unnecessary libraries. Pure JavaScript.
* Responsive: Adapts to any screen size, from mobile to TV.
* Swipe/Touch Support: Swipe through slides on touch devices.
* Full Customization: Easily customizable via CSS and JS options.
* Accessible: Supports keyboard navigation (WCAG).

## Installation

```shell
# Not yet published
npm install @ligect/image-carousel
```

## Usage

### HTML

```html
<div class="carousel">
  <!-- Slides will go here -->
</div>
```

### JavaScript

```javascript
// Basic initialization (API is subject to change)
import Carousel from '@ligect/image-carousel';

const myCarousel = new Carousel('.carousel', {
  /* options */
});