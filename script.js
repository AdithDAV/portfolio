document.addEventListener('DOMContentLoaded', () => {
    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    // Experience & Project Modal Logic
    const modal = document.getElementById('experience-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalRole = document.getElementById('modal-role');
    const modalCompany = document.getElementById('modal-company');
    const modalDate = document.getElementById('modal-date');
    const modalBody = document.getElementById('modal-body');

    // Selects both Experience and Project cards since they share the class
    document.querySelectorAll('.experience-card-static').forEach(card => {
        card.addEventListener('click', () => {
            // Populate Modal
            modalRole.textContent = card.getAttribute('data-role');
            modalCompany.textContent = card.getAttribute('data-company');
            modalDate.textContent = card.getAttribute('data-date');
            modalBody.innerHTML = card.querySelector('.hidden-details').innerHTML;

            // Show Modal
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    });

    // Close Modal
    closeModal.addEventListener('click', () => {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    });

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });

    // Carousel Logic (Generic)
    const initCarousel = (scrollerSelector, dotsSelector, prevBtnSelector, nextBtnSelector, cardSelector) => {
        const scroller = document.querySelector(scrollerSelector);
        const dotsContainer = document.querySelector(dotsSelector);
        const cards = document.querySelectorAll(cardSelector);
        const prevBtn = document.querySelector(prevBtnSelector);
        const nextBtn = document.querySelector(nextBtnSelector);

        if (!scroller || !dotsContainer || !prevBtn || !nextBtn) return;

        // Determine items per page based on screen width
        const getItemsPerPage = () => {
            if (window.innerWidth <= 768) return 1;
            if (window.innerWidth <= 1024) return 2;
            return 3;
        };

        const setupPagination = () => {
            dotsContainer.innerHTML = '';
            const itemsPerPage = getItemsPerPage();
            // For projects, cards are inside specific scroller, so we should scope the query
            // But for simplicity, we can use the scroller's children count if cards selector is too broad
            // Let's use scroller.children.length / itemsPerPage
            const cardCount = scroller.children.length;
            const pageCount = Math.ceil(cardCount / itemsPerPage);

            for (let i = 0; i < pageCount; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    const scrollAmount = scroller.clientWidth * i;
                    scroller.scrollTo({
                        left: scrollAmount,
                        behavior: 'smooth'
                    });
                });
                dotsContainer.appendChild(dot);
            }
        };

        // Update dots on scroll
        scroller.addEventListener('scroll', () => {
            const pageIndex = Math.round(scroller.scrollLeft / scroller.clientWidth);
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                if (index === pageIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        });

        // Initialize and update on resize
        setupPagination();
        window.addEventListener('resize', setupPagination);

        // Navigation Arrows
        prevBtn.addEventListener('click', () => {
            scroller.scrollBy({
                left: -scroller.clientWidth,
                behavior: 'smooth'
            });
        });

        nextBtn.addEventListener('click', () => {
            scroller.scrollBy({
                left: scroller.clientWidth,
                behavior: 'smooth'
            });
        });
    };

    // Initialize Experience Carousel
    initCarousel('.experience-scroller', '.carousel-dots', '.nav-arrow.prev:not(.project-prev)', '.nav-arrow.next:not(.project-next)', '#experience .experience-card-static');

    // Initialize Project Carousel
    initCarousel('.project-scroller', '.project-dots', '.project-prev', '.project-next', '#projects .experience-card-static');

    // Contact Form Logic
    const connectForm = document.getElementById('connect-form');
    const contactCard = document.querySelector('.contact-card'); // Select the card container
    if (!contactCard) console.error('Contact card not found!');
    const submitBtn = document.getElementById('submit-btn');
    const sendAnotherBtn = document.getElementById('send-another');

    if (connectForm) {
        connectForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            const formData = new FormData(connectForm);

            const formId = 'mblbzdgv'; // User provided ID

            try {
                const response = await fetch(`https://formspree.io/f/${formId}`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success Animation
                    setTimeout(() => {
                        submitBtn.classList.remove('loading');
                        submitBtn.disabled = false;

                        // Trigger Masking Animation
                        if (contactCard) {
                            contactCard.classList.add('submitted');
                            const lottieAnim = document.getElementById('success-anim');
                            if (lottieAnim) {
                                lottieAnim.seek(0); // Reset to start
                                lottieAnim.play();
                            }
                        } else {
                            console.error('Contact card element missing, cannot animate');
                        }

                        // Reset form
                        connectForm.reset();
                    }, 500);
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Oops! There was a problem submitting your form. Please try again.');
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        });
    }

    if (sendAnotherBtn) {
        sendAnotherBtn.addEventListener('click', () => {
            // Reset Masking Animation
            contactCard.classList.remove('submitted');
        });
    }
    // Typewriter Effect for Hero
    const typeWriterElement = document.getElementById('typewriter-text');
    if (typeWriterElement) {
        const textToType = '"352-740-7261 | dharmeshadithvarmap@gmail.com";';
        let i = 0;
        let isDeleting = false;

        function typeWriter() {
            const currentText = typeWriterElement.textContent;

            if (!isDeleting && i < textToType.length) {
                // Typing
                typeWriterElement.textContent += textToType.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            } else if (isDeleting && i > 0) {
                // Deleting
                typeWriterElement.textContent = textToType.substring(0, i - 1);
                i--;
                setTimeout(typeWriter, 30);
            } else {
                // Switching state
                isDeleting = !isDeleting;
                if (!isDeleting) {
                    // Just finished deleting, start typing after pause
                    setTimeout(typeWriter, 500);
                } else {
                    // Just finished typing, start deleting after pause
                    setTimeout(typeWriter, 2000);
                }
            }
        }

        // Start typing after a small delay
        setTimeout(typeWriter, 1000);
    }
});
