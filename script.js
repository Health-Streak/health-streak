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
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    function toggleMobileMenu() {
        mobileNavToggle.classList.toggle('active');
        mobileNavOverlay.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }

    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', toggleMobileMenu);
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
        rootMargin: '0px 0px -15% 0px',
        threshold: 0.1
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

});
