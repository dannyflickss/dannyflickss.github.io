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

  const lightboxImages = document.querySelectorAll('.photo img, .home-photo img, .gallery-hero img');
  if (lightboxImages.length) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.innerHTML = `
      <button class="lightbox-close" type="button" aria-label="Close image">Close</button>
      <div class="lightbox-frame">
        <img class="lightbox-image" alt="">
      </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const closeButton = lightbox.querySelector('.lightbox-close');

    const openLightbox = (img) => {
      lightboxImage.src = img.currentSrc || img.src;
      lightboxImage.alt = img.alt || '';
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

    lightboxImages.forEach((img) => {
      img.classList.add('clickable-photo');
      img.addEventListener('click', () => openLightbox(img));
    });

    closeButton.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
    });
  }
});
