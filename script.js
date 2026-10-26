document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Sticky Navigation Scroll Effect ---
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });

    // --- 2. Mobile Menu Toggle ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    function toggleMobileMenu() {
        if (mobileNavToggle) mobileNavToggle.classList.toggle('active');
        if (mobileNavOverlay) mobileNavOverlay.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }

    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', toggleMobileMenu);
    }

    if (mobileNavClose) {
        mobileNavClose.addEventListener('click', toggleMobileMenu);
    }

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNavOverlay.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    // --- 4. FAQ Accordion Mechanics ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const toggleBtn = item.querySelector('.faq-toggle');
        const answer = item.querySelector('.faq-answer');

        if (toggleBtn && answer) {
            toggleBtn.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');
                
                // Close other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.faq-answer').style.maxHeight = '0px';
                    }
                });

                if (isOpen) {
                    item.classList.remove('active');
                    answer.style.maxHeight = '0px';
                } else {
                    item.classList.add('active');
                    // Compute content scrollHeight
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        }
    });

    // --- 5. Contact Form Submission Success Handling ---
    const contactForm = document.getElementById('contactForm');
    const successModal = document.getElementById('successModal');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect form details
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const program = document.getElementById('programSelect').value;
            const message = document.getElementById('message').value;

            console.log("Form Submission details:", { firstName, lastName, email, program, message });

            // Display success modal
            if (successModal) {
                successModal.classList.add('active');
            }
            
            // Reset the form
            contactForm.reset();
        });
    }

    // --- 6. GSAP and ScrollTrigger On-Scroll Animations ---
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // -- Global Setup --
        const animDefaults = {
            duration: 1.6,
            ease: 'power3.out'
        };

        // -- Hero Section Animations --
        // Ensure hero elements are visible first, then animate
        gsap.set('.hero-info', { opacity: 1, x: 0 });
        gsap.set('.hero-image-block', { opacity: 1, scale: 1 });
        gsap.set('.hero-right', { opacity: 1, x: 0 });

        gsap.from('.hero-info', {
            x: -80,
            opacity: 0,
            duration: 1.6,
            ease: 'power4.out',
            delay: 0.3
        });

        gsap.from('.hero-image-block', {
            scale: 0.9,
            opacity: 0,
            duration: 2.0,
            ease: 'power2.out',
            delay: 0.6
        });

        gsap.from('.hero-right', {
            x: 80,
            opacity: 0,
            duration: 1.6,
            ease: 'power4.out',
            delay: 0.8
        });

        // -- Wavy Journey Path & Pop Bubbles Timeline --
        const journeyPath = document.querySelector('.journey-path');
        if (journeyPath) {
            const pathLength = journeyPath.getTotalLength();
            
            // Set initial state of path
            gsap.set(journeyPath, {
                strokeDasharray: pathLength,
                strokeDashoffset: pathLength
            });

            // Set initial state of dots, bubbles and bullets (for progressive enhancement, dynamic reveal)
            gsap.set('.trough-dot', { scale: 0, opacity: 0 });
            gsap.set('.timeline-col .bubble-container', { scale: 0, opacity: 0 });
            gsap.set('.timeline-col .col-bullets li', { opacity: 0, x: -20 });

            const journeyTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: '.journey-timeline-row',
                    start: 'top 75%',
                    toggleActions: 'play none none none'
                }
            });

            // Smooth caterpillar crawl: line draws segment by segment
            // Each segment ~0.7s with gentle sine easing for organic feel

            // 1. Draw line from start to Bubble 1 position
            journeyTimeline.to(journeyPath, {
                strokeDashoffset: pathLength * 0.75,
                duration: 0.7,
                ease: 'sine.inOut'
            });

            // 2. Pop Bubble 1 (gentle, not snappy)
            journeyTimeline.to('.col-1 .bubble-container', {
                scale: 1,
                opacity: 1,
                duration: 0.42,
                ease: 'elastic.out(1, 0.5)'
            }, '-=0.14');

            // 3. Reveal Bullets for Col 1
            journeyTimeline.to('.col-1 .col-bullets li', {
                opacity: 1,
                x: 0,
                duration: 0.28,
                stagger: 0.07,
                ease: 'power2.out'
            }, '-=0.1');

            // 4. Continue crawling to Dot 1 + Bubble 2
            journeyTimeline.to(journeyPath, {
                strokeDashoffset: pathLength * 0.5,
                duration: 0.7,
                ease: 'sine.inOut'
            }, '+=0.1');

            // Dot 1 reveal
            journeyTimeline.to('.dot-1', {
                scale: 1,
                opacity: 1,
                duration: 0.28,
                ease: 'back.out(1.7)'
            }, '-=0.2');

            // 5. Pop Bubble 2
            journeyTimeline.to('.col-2 .bubble-container', {
                scale: 1,
                opacity: 1,
                duration: 0.42,
                ease: 'elastic.out(1, 0.5)'
            }, '-=0.1');

            // 6. Reveal Bullets for Col 2
            journeyTimeline.to('.col-2 .col-bullets li', {
                opacity: 1,
                x: 0,
                duration: 0.28,
                stagger: 0.07,
                ease: 'power2.out'
            }, '-=0.1');

            // 7. Continue crawling to Dot 2 + Bubble 3
            journeyTimeline.to(journeyPath, {
                strokeDashoffset: pathLength * 0.25,
                duration: 0.7,
                ease: 'sine.inOut'
            }, '+=0.1');

            // Dot 2 reveal
            journeyTimeline.to('.dot-2', {
                scale: 1,
                opacity: 1,
                duration: 0.28,
                ease: 'back.out(1.7)'
            }, '-=0.2');

            // 8. Pop Bubble 3
            journeyTimeline.to('.col-3 .bubble-container', {
                scale: 1,
                opacity: 1,
                duration: 0.42,
                ease: 'elastic.out(1, 0.5)'
            }, '-=0.1');

            // 9. Reveal Bullets for Col 3
            journeyTimeline.to('.col-3 .col-bullets li', {
                opacity: 1,
                x: 0,
                duration: 0.28,
                stagger: 0.07,
                ease: 'power2.out'
            }, '-=0.1');

            // 10. Final crawl to Dot 3 + Bubble 4
            journeyTimeline.to(journeyPath, {
                strokeDashoffset: 0,
                duration: 0.7,
                ease: 'sine.inOut'
            }, '+=0.1');

            // Dot 3 reveal
            journeyTimeline.to('.dot-3', {
                scale: 1,
                opacity: 1,
                duration: 0.28,
                ease: 'back.out(1.7)'
            }, '-=0.2');

            // 11. Pop Bubble 4
            journeyTimeline.to('.col-4 .bubble-container', {
                scale: 1,
                opacity: 1,
                duration: 0.42,
                ease: 'elastic.out(1, 0.5)'
            }, '-=0.1');

            // 12. Reveal Bullets for Col 4
            journeyTimeline.to('.col-4 .col-bullets li', {
                opacity: 1,
                x: 0,
                duration: 0.28,
                stagger: 0.07,
                ease: 'power2.out'
            }, '-=0.1');

        }
    }

    // --- 6. Scroll Appear Animations (Intersection Observer) ---
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -5% 0px',
        threshold: 0.05
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll(
        '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-bottom, .scroll-reveal-center'
    );
    
    revealElements.forEach(el => revealObserver.observe(el));

    // --- 7. Dynamic Testimonials & Infinite Carousel ---
    const testimonialsGrid = document.getElementById('testimonialsGrid');
    const carouselControls = document.getElementById('carouselControls');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    const dotsContainer = document.getElementById('carouselDots');
    const carouselWrapper = document.querySelector('.testimonials-carousel-wrapper');

    let currentTestimonials = [];
    let carouselState = {
        currentIndex: 0,
        isAnimating: false,
        autoSlideTimer: null,
        totalUnique: 0
    };

    function renderStars(rating) {
        const count = Math.max(1, Math.min(5, parseInt(rating, 10) || 5));
        return '★'.repeat(count) + '☆'.repeat(5 - count);
    }

    function getInitials(name) {
        if (!name) return 'HS';
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    function createTestimonialCard(item) {
        const card = document.createElement('div');
        card.className = 'testimonial-card scroll-reveal-bottom revealed';

        const avatarContent = item.image
            ? `<img src="${item.image}" alt="${item.name}" onerror="this.parentElement.textContent='${getInitials(item.name)}'">`
            : getInitials(item.name);

        card.innerHTML = `
            <div class="testimonial-header">
                <div class="author-avatar">${avatarContent}</div>
                <div class="author-meta">
                    <h4 class="author-name">${item.name}</h4>
                    ${item.tag ? `<span class="author-tag">${item.tag}</span>` : ''}
                </div>
            </div>
            <div class="testimonial-stars" aria-label="${item.rating || 5} out of 5 stars">${renderStars(item.rating || 5)}</div>
            <p class="testimonial-text">"${item.text}"</p>
        `;
        return card;
    }

    function getVisibleCardsCount() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1100) return 2;
        return 3;
    }

    function resizeCards() {
        if (!testimonialsGrid || !testimonialsGrid.parentElement) return { cardWidth: 360, gap: 28 };
        const visibleCount = getVisibleCardsCount();
        const containerWidth = testimonialsGrid.parentElement.clientWidth;
        const gap = 28;
        const cardWidth = Math.floor((containerWidth - (visibleCount - 1) * gap) / visibleCount);
        
        const allCards = testimonialsGrid.querySelectorAll('.testimonial-card');
        allCards.forEach(c => {
            c.style.flex = `0 0 ${cardWidth}px`;
            c.style.width = `${cardWidth}px`;
            c.style.maxWidth = `${cardWidth}px`;
            c.style.boxSizing = 'border-box';
        });

        return { cardWidth, gap };
    }

    function initInfiniteCarousel(testimonials) {
        if (!testimonialsGrid || !testimonials || testimonials.length === 0) return;

        if (carouselState.autoSlideTimer) {
            clearInterval(carouselState.autoSlideTimer);
            carouselState.autoSlideTimer = null;
        }

        const N = testimonials.length;
        carouselState.totalUnique = N;
        carouselState.currentIndex = 0;
        carouselState.isAnimating = false;

        testimonialsGrid.classList.add('is-carousel');
        if (carouselControls) carouselControls.style.display = 'flex';

        // Clear grid and render unique cards + clones for seamless infinite loop
        testimonialsGrid.innerHTML = '';

        let cardsList = [...testimonials];
        while (cardsList.length < 6 || cardsList.length < N + 3) {
            cardsList = cardsList.concat(testimonials);
        }

        cardsList.forEach(item => {
            testimonialsGrid.appendChild(createTestimonialCard(item));
        });

        resizeCards();

        // Render pagination dots
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < N; i++) {
                const dot = document.createElement('button');
                dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
                dot.setAttribute('aria-label', `Testimonial slide ${i + 1}`);
                dot.addEventListener('click', () => {
                    pauseAutoSlide();
                    goToIndex(i);
                    resumeAutoSlide();
                });
                dotsContainer.appendChild(dot);
            }
        }

        function updateDots() {
            if (!dotsContainer) return;
            const activeIdx = (carouselState.currentIndex % N + N) % N;
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === activeIdx);
            });
        }

        function moveTo(index, smooth = true) {
            const { cardWidth, gap } = resizeCards();
            const shift = index * (cardWidth + gap);

            if (smooth) {
                testimonialsGrid.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
                carouselState.isAnimating = true;
            } else {
                testimonialsGrid.style.transition = 'none';
                carouselState.isAnimating = false;
            }

            testimonialsGrid.style.transform = `translateX(-${shift}px)`;
            updateDots();

            if (smooth) {
                setTimeout(() => {
                    carouselState.isAnimating = false;
                    if (carouselState.currentIndex >= N) {
                        testimonialsGrid.style.transition = 'none';
                        carouselState.currentIndex = 0;
                        testimonialsGrid.style.transform = 'translateX(0px)';
                        updateDots();
                    }
                }, 820);
            }
        }

        function stepNext() {
            if (carouselState.isAnimating) return;
            carouselState.currentIndex++;
            moveTo(carouselState.currentIndex, true);
        }

        function stepPrev() {
            if (carouselState.isAnimating) return;
            if (carouselState.currentIndex <= 0) {
                testimonialsGrid.style.transition = 'none';
                carouselState.currentIndex = N;
                const { cardWidth, gap } = resizeCards();
                testimonialsGrid.style.transform = `translateX(-${carouselState.currentIndex * (cardWidth + gap)}px)`;
                void testimonialsGrid.offsetWidth;
            }
            carouselState.currentIndex--;
            moveTo(carouselState.currentIndex, true);
        }

        function goToIndex(idx) {
            carouselState.currentIndex = idx;
            moveTo(carouselState.currentIndex, true);
        }

        function startAutoSlide() {
            if (carouselState.autoSlideTimer) clearInterval(carouselState.autoSlideTimer);
            carouselState.autoSlideTimer = setInterval(() => {
                stepNext();
            }, 4000);
        }

        function pauseAutoSlide() {
            if (carouselState.autoSlideTimer) {
                clearInterval(carouselState.autoSlideTimer);
                carouselState.autoSlideTimer = null;
            }
        }

        function resumeAutoSlide() {
            pauseAutoSlide();
            startAutoSlide();
        }

        if (nextBtn) {
            nextBtn.onclick = () => {
                pauseAutoSlide();
                stepNext();
                resumeAutoSlide();
            };
        }

        if (prevBtn) {
            prevBtn.onclick = () => {
                pauseAutoSlide();
                stepPrev();
                resumeAutoSlide();
            };
        }

        const hoverTarget = carouselWrapper || testimonialsGrid;
        hoverTarget.onmouseenter = pauseAutoSlide;
        hoverTarget.onmouseleave = resumeAutoSlide;

        // Mobile touch swipe
        let touchStartX = 0;
        let touchStartY = 0;
        testimonialsGrid.ontouchstart = (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            pauseAutoSlide();
        };

        testimonialsGrid.ontouchend = (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;
            if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 0) stepNext();
                else stepPrev();
            }
            resumeAutoSlide();
        };

        window.onresize = () => {
            moveTo(carouselState.currentIndex, false);
        };

        moveTo(0, false);
        startAutoSlide();
    }

    async function loadTestimonials() {
        if (!testimonialsGrid) return;

        let loaded = false;
        try {
            const cached = localStorage.getItem('hs_cached_testimonials');
            if (cached) {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    currentTestimonials = parsed;
                    initInfiniteCarousel(parsed);
                    loaded = true;
                }
            }
        } catch (e) {}

        let freshData = null;
        try {
            const res = await fetch('data/testimonials.json?v=' + Date.now(), { cache: 'no-store' });
            if (res.ok) {
                freshData = await res.json();
            }
        } catch (err) {}

        if (!freshData) {
            try {
                const fallbackRes = await fetch('https://raw.githubusercontent.com/Health-Streak/health-streak/main/data/testimonials.json?v=' + Date.now(), { cache: 'no-store' });
                if (fallbackRes.ok) {
                    freshData = await fallbackRes.json();
                }
            } catch (err) {}
        }

        if (Array.isArray(freshData) && freshData.length > 0) {
            const freshJson = JSON.stringify(freshData);
            const currentJson = JSON.stringify(currentTestimonials);
            try {
                localStorage.setItem('hs_cached_testimonials', freshJson);
            } catch (e) {}

            if (freshJson !== currentJson || !loaded) {
                currentTestimonials = freshData;
                initInfiniteCarousel(freshData);
            }
        } else if (!loaded) {
            initInfiniteCarousel([
                {
                    id: "2",
                    name: "Rangaraj R",
                    tag: "Parent of Client",
                    rating: 5,
                    text: "As a father, seeing my son reduce his weight from 77.3 kgs to 70.5 kgs while his SGPT, SGOT, and triglyceride levels all improved significantly was beyond satisfying. What I appreciated most was that it never felt extreme. Thank you, Dt. Drashti Zatakia, for guiding him so patiently."
                },
                {
                    id: "1",
                    name: "Vidula Karhadkar",
                    tag: "Verified Client",
                    rating: 5,
                    text: "I had an excellent experience working with Drashti. From understanding my lifestyle, preferences, and health goals, her guidance was practical, easy to follow, and tailored specifically to me. Thanks to her expertise, I've seen real improvements in my energy levels, eating habits, and overall well-being."
                },
                {
                    id: "3",
                    name: "Parth Trivedi",
                    tag: "Verified Client",
                    rating: 5,
                    text: "Full marks to Drashti's knowledge which she applies into the real world. She helped me get back in shape and overcome cholesterol levels and a pre-diabetic condition. I came down to 72kg from 87kg within 3 months, and have maintained it since. Give your health another shot — the best help you can get is from Drashti."
                },
                {
                    id: "1793042365096",
                    name: "Yathaarth Jaju",
                    tag: "Verified Client",
                    rating: 5,
                    text: "Demo testimonial"
                }
            ]);
        }
    }

    window.addEventListener('storage', (e) => {
        if (e.key === 'hs_cached_testimonials') {
            loadTestimonials();
        }
    });

    loadTestimonials();

});
