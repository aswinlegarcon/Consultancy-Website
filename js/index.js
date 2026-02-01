document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');

    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('show');
            toggle.setAttribute('aria-expanded', menu.classList.contains('show'));
        });
    }

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Section Animations
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Navbar Scroll Effect
    const navbar = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(255,255,255,0.95)';
            navbar.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
        } else {
            navbar.style.backgroundColor = 'white';
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        }
    });

    // Initialize carousel
    initCarousel();
});

// ===== ENHANCED CAROUSEL WITH MULTI-IMAGE SUPPORT =====
let currentSlideIndex = 0;
let currentImageIndex = 0;
let autoPlayInterval = null;
let imageAutoPlayInterval = null;
let touchStartX = 0;
let touchEndX = 0;

// Initialize carousel
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicatorsContainer = document.getElementById('carousel-indicators');
    const carouselContainer = document.getElementById('carousel-container');
    
    // Generate indicators
    slides.forEach((_, idx) => {
        const indicator = document.createElement('span');
        indicator.className = 'indicator' + (idx === 0 ? ' active' : '');
        indicator.onclick = () => goToSlide(idx);
        indicatorsContainer.appendChild(indicator);
    });
    
    // Show first slide
    showSlide(0);
    
    // Touch support for mobile
    if (carouselContainer) {
        carouselContainer.addEventListener('touchstart', handleTouchStart, false);
        carouselContainer.addEventListener('touchend', handleTouchEnd, false);
    }
    
    // Keyboard support
    document.addEventListener('keydown', handleKeyboard);
}

// Show specific slide
function showSlide(n) {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    // Wrap around
    if (n >= slides.length) currentSlideIndex = 0;
    else if (n < 0) currentSlideIndex = slides.length - 1;
    else currentSlideIndex = n;
    
    // Update slides
    slides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === currentSlideIndex);
    });
    
    // Update indicators
    indicators.forEach((ind, idx) => {
        ind.classList.toggle('active', idx === currentSlideIndex);
    });
    
    // Reset image index and start auto-play for current slide
    currentImageIndex = 0;
    stopImageAutoPlay();
    handleSlideImages();
}

// Handle images within a slide
function handleSlideImages() {
    const currentSlide = document.querySelectorAll('.carousel-slide')[currentSlideIndex];
    if (!currentSlide) return;
    
    const images = currentSlide.querySelectorAll('.slide-image');
    const imgNavBtns = currentSlide.querySelectorAll('.img-nav-btn');
    const imageCounter = currentSlide.querySelector('.image-counter');
    
    // Show/hide navigation for multi-image slides
    if (images.length > 1) {
        imgNavBtns.forEach(btn => btn.style.display = 'flex');
        if (imageCounter) imageCounter.style.display = 'block';
        startImageAutoPlay();
    } else {
        imgNavBtns.forEach(btn => btn.style.display = 'none');
        if (imageCounter) imageCounter.style.display = 'none';
    }
    
    // Show first image
    showImage(0);
}

// Show specific image in current slide
function showImage(n) {
    const currentSlide = document.querySelectorAll('.carousel-slide')[currentSlideIndex];
    if (!currentSlide) return;
    
    const images = currentSlide.querySelectorAll('.slide-image');
    if (images.length === 0) return;
    
    // Wrap around
    if (n >= images.length) currentImageIndex = 0;
    else if (n < 0) currentImageIndex = images.length - 1;
    else currentImageIndex = n;
    
    // Update images
    images.forEach((img, idx) => {
        img.classList.toggle('active', idx === currentImageIndex);
    });
    
    // Update counter
    const currentImgSpan = currentSlide.querySelector('.current-img');
    const totalImgsSpan = currentSlide.querySelector('.total-imgs');
    if (currentImgSpan) currentImgSpan.textContent = currentImageIndex + 1;
    if (totalImgsSpan) totalImgsSpan.textContent = images.length;
}

// Move to next/previous slide
function moveCarousel(n) {
    stopImageAutoPlay();
    showSlide(currentSlideIndex + n);
}

// Go to specific slide
function goToSlide(n) {
    stopImageAutoPlay();
    showSlide(n);
}

// Move to next/previous image in current slide
function moveImage(n) {
    stopImageAutoPlay();
    showImage(currentImageIndex + n);
    startImageAutoPlay();
}

// Auto-play images within a slide
function startImageAutoPlay() {
    const currentSlide = document.querySelectorAll('.carousel-slide')[currentSlideIndex];
    if (!currentSlide) return;
    
    const images = currentSlide.querySelectorAll('.slide-image');
    if (images.length <= 1) return;
    
    stopImageAutoPlay();
    imageAutoPlayInterval = setInterval(() => {
        showImage(currentImageIndex + 1);
    }, 3000);
}

function stopImageAutoPlay() {
    if (imageAutoPlayInterval) {
        clearInterval(imageAutoPlayInterval);
        imageAutoPlayInterval = null;
    }
}

// Touch handlers for mobile swipe
function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next slide
            moveCarousel(1);
        } else {
            // Swipe right - previous slide
            moveCarousel(-1);
        }
    }
}

// Keyboard navigation
function handleKeyboard(e) {
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        moveCarousel(-1);
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        moveCarousel(1);
    }
}