/**
 * ARLink Global Animation Engine
 * Handles: scroll-reveal, stat counters, staggered grid children
 */

(function () {
    'use strict';

    /* ── 1. Scroll-Reveal via IntersectionObserver ───────────── */
    const revealClasses = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale'];
    const revealEls = document.querySelectorAll(revealClasses.join(', '));

    if (revealEls.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Once revealed, stop observing
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealEls.forEach(el => revealObserver.observe(el));
    }

    /* ── 2. Staggered Children Auto-Delay ────────────────────── */
    // For grids: automatically applies stagger delay to child .reveal elements
    const staggerContainers = document.querySelectorAll(
        '.features-grid, .destinations-grid, .services-grid-new, ' +
        '.featured-travel-grid, .testimonials-grid, .why-choose-grid, ' +
        '.about-values-grid, .partners-grid-row'
    );

    staggerContainers.forEach(container => {
        const children = container.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
        children.forEach((child, index) => {
            const delayStep = Math.min(index + 1, 10);
            child.classList.add(`reveal-delay-${delayStep}`);
        });
    });

    /* ── 3. Animated Stat Counters ───────────────────────────── */
    function parseTarget(val) {
        // Handles "50,000+", "100+", "30+", "90%", "24/7", "150", "20+"
        const clean = val.replace(/,/g, '');
        const match = clean.match(/^([\d.]+)/);
        return match ? parseFloat(match[1]) : 0;
    }

    function formatStat(current, original) {
        const clean = original.replace(/,/g, '');
        // Detect suffix characters (everything after the number)
        const suffix = clean.replace(/^[\d.]+/, '');
        // Detect if original has comma formatting (>= 1000)
        const hasComma = original.includes(',');

        let num = Math.round(current);
        let formatted = hasComma ? num.toLocaleString() : String(num);
        return formatted + suffix;
    }

    function animateCounter(el) {
        const original = el.getAttribute('data-target');
        if (!original) return;

        const target = parseTarget(original);
        if (target === 0) return;

        const duration = 2000; // ms
        const startTime = performance.now();

        function step(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * target;
            el.textContent = formatStat(current, original);

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = original; // ensure exact final value
            }
        }

        requestAnimationFrame(step);
    }

    // Observe stat counter elements
    const statEls = document.querySelectorAll('[data-target]');
    if (statEls.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        statEls.forEach(el => counterObserver.observe(el));
    }

    /* ── 4. Section Header Reveal ────────────────────────────── */
    // Auto-add reveal ONLY to section headers that:
    // 1. Don't already have the class, AND
    // 2. Are NOT already nested inside another .reveal element
    document.querySelectorAll('.section-header').forEach(header => {
        const alreadyHasReveal = header.classList.contains('reveal');
        const insideReveal = header.closest('.reveal:not(.section-header)');
        if (!alreadyHasReveal && !insideReveal) {
            header.classList.add('reveal');
        }
    });

    /* ── 5. Active Nav Link Highlight ───────────────────────── */
    // Highlight nav link matching current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        const page = href.split('/').pop().split('#')[0] || 'index.html';
        if (page === currentPage) {
            link.classList.add('active');
        }
    });

    /* ── 6. Smooth Scroll for Anchor Links ───────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ── 7. Header scroll sticky with transition ─────────────── */
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('sticky');
            } else {
                header.classList.remove('sticky');
            }
        }, { passive: true });
    }

    /* ── 8. Mobile Navigation Toggle ────────────────────────── */
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const navMenu = document.getElementById('nav-menu');
    const menuOverlay = document.getElementById('menu-overlay');

    if (menuToggleBtn && navMenu && menuOverlay) {
        const toggleMenu = () => {
            navMenu.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            const icon = menuToggleBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        };

        menuToggleBtn.addEventListener('click', toggleMenu);
        menuOverlay.addEventListener('click', toggleMenu);

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuOverlay.classList.remove('active');
                const icon = menuToggleBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    /* ── 9. Booking Widget Tab Switching ─────────────────────── */
    const tabBtns = document.querySelectorAll('.tab-btn');
    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    /* ── 10. Careers Section Carousel ───────────────────────── */
    const carouselContainer = document.querySelector('.jobs-carousel-container');
    const track = document.getElementById('jobs-track');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');

    if (carouselContainer && track && dotsContainer) {
        const slides = track.querySelectorAll('.job-ticket');
        const slideCount = slides.length;
        let activeIndex = 0;

        // 1. Generate dot indicators dynamically
        for (let i = 0; i < slideCount; i++) {
            const dot = document.createElement('span');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('data-index', i);
            dotsContainer.appendChild(dot);
        }

        const dots = dotsContainer.querySelectorAll('.carousel-dot');

        // 2. Helper function to scroll to a specific index
        function scrollToSlide(index) {
            if (index < 0 || index >= slideCount) return;
            
            const slideWidth = slides[0].offsetWidth;
            const gap = 24; // matches the CSS gap
            const scrollTarget = index * (slideWidth + gap);
            
            track.scrollTo({
                left: scrollTarget,
                behavior: 'smooth'
            });
            
            activeIndex = index;
            updateActiveDot(activeIndex);
        }

        // 3. Update dots appearance
        function updateActiveDot(index) {
            dots.forEach((dot, idx) => {
                if (idx === index) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        // 4. Button Click Listeners
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                let target = activeIndex - 1;
                if (target < 0) target = slideCount - 1; // loop to last
                scrollToSlide(target);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                let target = activeIndex + 1;
                if (target >= slideCount) target = 0; // loop to first
                scrollToSlide(target);
            });
        }

        // 5. Dot Click Listeners
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'), 10);
                scrollToSlide(index);
            });
        });

        // 6. Sync dots with native scrolling/swiping (with debouncing)
        let scrollTimeout;
        track.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const slideWidth = slides[0].offsetWidth;
                if (!slideWidth) return;
                const gap = 24;
                const scrollLeft = track.scrollLeft;
                const index = Math.round(scrollLeft / (slideWidth + gap));
                if (index !== activeIndex && index >= 0 && index < slideCount) {
                    activeIndex = index;
                    updateActiveDot(activeIndex);
                }
            }, 50);
        }, { passive: true });
    }

})();
