window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-loaded');

  const internalLinks = document.querySelectorAll('a[href$=".html"], a[href="/"]');
  internalLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || link.target === '_blank') return;
      event.preventDefault();
      document.body.classList.add('page-exit');
      setTimeout(() => {
        window.location.href = href;
      }, 180);
    });
  });

  const lightboxImages = Array.from(document.querySelectorAll('.photo img, .home-photo img, .gallery-hero img'));
  if (lightboxImages.length) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.innerHTML = `
      <button class="lightbox-close" type="button" aria-label="Close image">×</button>
      <button class="lightbox-nav lightbox-prev" type="button" aria-label="Previous image">←</button>
      <div class="lightbox-frame">
        <img class="lightbox-image" alt="">
      </div>
      <button class="lightbox-nav lightbox-next" type="button" aria-label="Next image">→</button>
      <div class="lightbox-count" aria-live="polite"></div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const closeButton = lightbox.querySelector('.lightbox-close');
    const prevButton = lightbox.querySelector('.lightbox-prev');
    const nextButton = lightbox.querySelector('.lightbox-next');
    const count = lightbox.querySelector('.lightbox-count');
    let currentIndex = 0;
    let touchStartX = 0;

    const renderLightbox = () => {
      const img = lightboxImages[currentIndex];
      lightboxImage.src = img.currentSrc || img.src;
      lightboxImage.alt = img.alt || '';
      count.textContent = `${currentIndex + 1} / ${lightboxImages.length}`;
    };

    const openLightbox = (index) => {
      currentIndex = index;
      renderLightbox();
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');
    };

    const closeLightbox = () => {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('lightbox-open');
      setTimeout(() => {
        if (!lightbox.classList.contains('is-open')) lightboxImage.src = '';
      }, 220);
    };

    const showPrev = () => {
      currentIndex = (currentIndex - 1 + lightboxImages.length) % lightboxImages.length;
      renderLightbox();
    };

    const showNext = () => {
      currentIndex = (currentIndex + 1) % lightboxImages.length;
      renderLightbox();
    };

    lightboxImages.forEach((img, index) => {
      img.classList.add('clickable-photo');
      img.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        openLightbox(index);
      });
    });

    closeButton.addEventListener('click', closeLightbox);
    prevButton.addEventListener('click', showPrev);
    nextButton.addEventListener('click', showNext);

    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });

    lightbox.addEventListener('touchstart', (event) => {
      touchStartX = event.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (event) => {
      const touchEndX = event.changedTouches[0].screenX;
      const distance = touchEndX - touchStartX;
      if (Math.abs(distance) > 45) {
        distance > 0 ? showPrev() : showNext();
      }
    }, { passive: true });

    document.addEventListener('keydown', (event) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') showPrev();
      if (event.key === 'ArrowRight') showNext();
    });
  }
});
