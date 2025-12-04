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
    showSlide(currentSlideIndex);
    
    // Auto-play carousel (optional - uncomment to enable)
    // startAutoPlay();
});

// Carousel variables
let currentSlideIndex = 0;
let autoPlayInterval;

// Move carousel function
function moveCarousel(n) {
    showSlide(currentSlideIndex += n);
    resetAutoPlay(); // Reset auto-play timer when user interacts
}

// Current slide function
function currentSlide(n) {
    showSlide(currentSlideIndex = n);
    resetAutoPlay(); // Reset auto-play timer when user interacts
}

// Show slide function
function showSlide(n) {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');

    if (n >= slides.length) {
        currentSlideIndex = 0;
    }
    if (n < 0) {
        currentSlideIndex = slides.length - 1;
    }

    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
    });

    if (slides[currentSlideIndex]) {
        slides[currentSlideIndex].classList.add('active');
    }
    if (indicators[currentSlideIndex]) {
        indicators[currentSlideIndex].classList.add('active');
    }
}

// Auto-play functions (optional)
function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
        moveCarousel(1);
    }, 5000); // Change slide every 5 seconds
}

function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
    }
}

function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
}