document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. NAVIGATION & MOBILE DRAWER
       ========================================== */
    const header = document.querySelector('.header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');

    // Add scroll class to header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Toggle Mobile Drawer
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('open');
            // Toggle hamburger icon animation
            const spans = mobileMenuBtn.querySelectorAll('span');
            if (nav.classList.contains('open')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Close mobile menu on click link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('open')) {
                nav.classList.remove('open');
                const spans = mobileMenuBtn.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    });

    /* ==========================================
       2. DARK / LIGHT THEME TOGGLE
       ========================================== */
    const themeToggleBtn = document.querySelector('.theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';

    // Apply saved theme on load
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const theme = document.documentElement.getAttribute('data-theme');
            let newTheme = 'dark';
            if (theme === 'dark') {
                newTheme = 'light';
            }
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    /* ==========================================
       3. SCROLL REVEAL ANIMATION (INTERSECTION OBSERVER)
       ========================================== */
    const revealElements = document.querySelectorAll('.reveal');
    
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('active'));
    }

    /* ==========================================
       4. ANIMATED COUNTER METRICS
       ========================================== */
    const statsSection = document.querySelector('.stats-section');
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    const startCounters = () => {
        statNumbers.forEach(num => {
            const target = parseInt(num.getAttribute('data-target'), 10);
            const duration = 2000; // 2 seconds
            const startTime = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease out quad
                const easeProgress = progress * (2 - progress);
                const currentCount = Math.floor(easeProgress * target);
                
                num.textContent = currentCount + (num.getAttribute('data-suffix') || '');
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    num.textContent = target + (num.getAttribute('data-suffix') || '');
                }
            };
            requestAnimationFrame(animate);
        });
    };

    if (statsSection && statNumbers.length > 0) {
        if ('IntersectionObserver' in window) {
            const statsObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !countersStarted) {
                        countersStarted = true;
                        startCounters();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            statsObserver.observe(statsSection);
        } else {
            // Fallback
            startCounters();
        }
    }

    /* ==========================================
       5. FAQ ACCORDION INTERACTION
       ========================================== */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const content = item.querySelector('.faq-content');

        if (trigger && content) {
            trigger.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all other FAQs
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.faq-content').style.maxHeight = null;
                    }
                });

                // Toggle current FAQ
                if (isActive) {
                    item.classList.remove('active');
                    content.style.maxHeight = null;
                } else {
                    item.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        }
    });

    /* ==========================================
       6. PREMIUM TESTIMONIAL CAROUSEL
       ========================================== */
    const testimonialsTrack = document.querySelector('.testimonial-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const dotsContainer = document.querySelector('.slider-dots');

    if (testimonialsTrack && slides.length > 0) {
        let currentIdx = 0;
        const totalSlides = slides.length;

        // Create Navigation Dots
        if (dotsContainer) {
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('div');
                dot.classList.add('slider-dot');
                if (i === 0) dot.classList.add('active');
                dot.dataset.idx = i;
                dotsContainer.appendChild(dot);

                dot.addEventListener('click', () => {
                    goToSlide(i);
                });
            }
        }

        const updateDots = () => {
            const dots = document.querySelectorAll('.slider-dot');
            dots.forEach((dot, idx) => {
                if (idx === currentIdx) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        };

        const goToSlide = (idx) => {
            currentIdx = idx;
            testimonialsTrack.style.transform = `translateX(-${currentIdx * 100}%)`;
            updateDots();
        };

        const nextSlide = () => {
            let nextIdx = currentIdx + 1;
            if (nextIdx >= totalSlides) nextIdx = 0;
            goToSlide(nextIdx);
        };

        const prevSlide = () => {
            let prevIdx = currentIdx - 1;
            if (prevIdx < 0) prevIdx = totalSlides - 1;
            goToSlide(prevIdx);
        };

        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        // Auto slide every 7 seconds
        let autoSlideTimer = setInterval(nextSlide, 7000);

        // Reset timer on manual navigation
        const resetAutoSlide = () => {
            clearInterval(autoSlideTimer);
            autoSlideTimer = setInterval(nextSlide, 7000);
        };

        if (nextBtn) nextBtn.addEventListener('click', resetAutoSlide);
        if (prevBtn) prevBtn.addEventListener('click', resetAutoSlide);
        document.querySelectorAll('.slider-dot').forEach(dot => {
            dot.addEventListener('click', resetAutoSlide);
        });
    }

    /* ==========================================
       7. INTERACTIVE SEO AUDIT SIMULATOR
       ========================================== */
    const seoSubmitBtn = document.getElementById('seo-check-btn');
    const seoInput = document.getElementById('seo-domain-input');
    const seoLoader = document.querySelector('.seo-loader');
    const seoLoaderText = document.querySelector('.seo-loader-text');
    const seoResults = document.querySelector('.seo-results');
    
    if (seoSubmitBtn && seoInput) {
        seoSubmitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const value = seoInput.value.trim();
            if (!value) return;

            // Simple validation helper
            if (!value.includes('.') || value.length < 4) {
                alert('Please enter a valid website domain name (e.g., example.com)');
                return;
            }

            // Reset and start analysis loader
            seoResults.classList.remove('active');
            seoLoader.classList.add('active');
            
            const steps = [
                "Establishing secure connection to domain server...",
                "Downloading landing page HTML and asset registry...",
                "Evaluating title tags, meta tags, and header tag structures...",
                "Measuring core web vitals and speed optimization parameters...",
                "Scanning search visibility score and robot directory configs..."
            ];

            let stepIdx = 0;
            seoLoaderText.textContent = steps[stepIdx];

            const interval = setInterval(() => {
                stepIdx++;
                if (stepIdx < steps.length) {
                    seoLoaderText.textContent = steps[stepIdx];
                } else {
                    clearInterval(interval);
                    showAuditorResults(value);
                }
            }, 800);
        });
    }

    const showAuditorResults = (domain) => {
        seoLoader.classList.remove('active');
        
        // Generate realistic scores based on input domain
        let score = 65; // Default score
        
        // If they enter their current domain, give a realistic audit
        if (domain.toLowerCase().includes('xelectonline')) {
            score = 68;
        } else if (domain.toLowerCase().includes('google') || domain.toLowerCase().includes('apple')) {
            score = 94;
        } else {
            // Semi-random score between 55 and 85
            score = Math.floor(Math.random() * 30) + 55;
        }

        // DOM elements update
        document.getElementById('res-score').textContent = score + '/100';
        
        // Score color and status badges
        const scoreCard = document.getElementById('res-score-card');
        const speedCard = document.getElementById('res-speed-card');
        const mobileCard = document.getElementById('res-mobile-card');
        
        if (score >= 85) {
            scoreCard.querySelector('.seo-metric-status').textContent = 'Good';
            scoreCard.querySelector('.seo-metric-status').className = 'seo-metric-status seo-status-good';
            scoreCard.querySelector('.seo-metric-value').style.color = '#10b981';
        } else if (score >= 70) {
            scoreCard.querySelector('.seo-metric-status').textContent = 'Moderate';
            scoreCard.querySelector('.seo-metric-status').className = 'seo-metric-status seo-status-warn';
            scoreCard.querySelector('.seo-metric-value').style.color = '#f59e0b';
        } else {
            scoreCard.querySelector('.seo-metric-status').textContent = 'Needs Work';
            scoreCard.querySelector('.seo-metric-status').className = 'seo-metric-status seo-status-critical';
            scoreCard.querySelector('.seo-metric-value').style.color = '#ef4444';
        }

        // Mock Speed
        const speedScore = Math.round(score * 0.9 + (Math.random() * 10 - 5));
        document.getElementById('res-speed').textContent = speedScore + '%';
        if (speedScore >= 80) {
            speedCard.querySelector('.seo-metric-status').textContent = 'Fast';
            speedCard.querySelector('.seo-metric-status').className = 'seo-metric-status seo-status-good';
        } else if (speedScore >= 60) {
            speedCard.querySelector('.seo-metric-status').textContent = 'Average';
            speedCard.querySelector('.seo-metric-status').className = 'seo-metric-status seo-status-warn';
        } else {
            speedCard.querySelector('.seo-metric-status').textContent = 'Slow';
            speedCard.querySelector('.seo-metric-status').className = 'seo-metric-status seo-status-critical';
        }

        // Mock Mobile
        const mobileScore = score > 75 ? "92%" : "74%";
        document.getElementById('res-mobile').textContent = mobileScore;
        if (score > 75) {
            mobileCard.querySelector('.seo-metric-status').textContent = 'Responsive';
            mobileCard.querySelector('.seo-metric-status').className = 'seo-metric-status seo-status-good';
        } else {
            mobileCard.querySelector('.seo-metric-status').textContent = 'Viewports Issues';
            mobileCard.querySelector('.seo-metric-status').className = 'seo-metric-status seo-status-warn';
        }

        // Build recommendations list
        const recList = document.getElementById('res-rec-list');
        recList.innerHTML = ''; // Clear

        const recommendations = [
            { text: "Missing Alt Text on 24 content image elements (limits search crawlers).", icon: "warning" },
            { text: "Server response latency can be decreased by using a Global Edge CDN.", icon: "info" },
            { text: "Render-blocking Javascript bundles are slowing visual initialization.", icon: "warning" },
            { text: "Duplicate header tags (multiple H1 nodes detected on home page).", icon: "critical" },
            { text: "Lack of XML Sitemap submission file detected in domain directory.", icon: "critical" }
        ];

        // Filter recommendation based on score (better score = fewer problems)
        let showCount = 5;
        if (score > 85) showCount = 2;
        else if (score > 70) showCount = 3;

        for (let i = 0; i < showCount; i++) {
            const item = recommendations[i];
            const li = document.createElement('li');
            
            let strokeColor = "#f59e0b"; // Warning amber
            if (item.icon === "critical") strokeColor = "#ef4444"; // Red
            if (item.icon === "info") strokeColor = "#06b6d4"; // Cyan
            
            li.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>${item.text}</span>
            `;
            recList.appendChild(li);
        }

        seoResults.classList.add('active');
        
        // Scroll results into view smoothly
        seoResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    /* ==========================================
       8. SERVICE PAGE TABS FILTERING
       ========================================== */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const serviceDetails = document.querySelectorAll('.service-detail-item');

    if (tabBtns.length > 0 && serviceDetails.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                
                // Toggle active buttons
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter details
                serviceDetails.forEach(detail => {
                    if (category === 'all' || detail.dataset.category === category) {
                        detail.style.display = 'grid';
                        // Add entrance animation
                        detail.style.animation = 'fadeIn 0.5s ease forwards';
                    } else {
                        detail.style.display = 'none';
                    }
                });
            });
        });
    }

    /* ==========================================
       9. SERVICE PAGE INTERACTIVE QUOTE CALCULATOR
       ========================================== */
    const calcCheckboxes = document.querySelectorAll('.calc-checkbox');
    const budgetSlider = document.getElementById('calc-budget-slider');
    const budgetValDisplay = document.getElementById('budget-val');
    
    // Outputs
    const costDisplay = document.getElementById('est-cost');
    const leadsDisplay = document.getElementById('est-leads');
    const roiDisplay = document.getElementById('est-roi');

    const updateCalculator = () => {
        let totalBaseCost = 0;
        let activeChecks = 0;

        calcCheckboxes.forEach(checkbox => {
            const label = checkbox.closest('.calc-checkbox-label');
            if (checkbox.checked) {
                totalBaseCost += parseInt(checkbox.dataset.price, 10);
                activeChecks++;
                label.classList.add('checked');
            } else {
                label.classList.remove('checked');
            }
        });

        const adBudget = budgetSlider ? parseInt(budgetSlider.value, 10) : 0;
        if (budgetValDisplay) budgetValDisplay.textContent = `$${adBudget.toLocaleString()}`;

        // Calculations
        const monthlyCost = totalBaseCost + adBudget;
        
        // Estimated metrics calculation
        let trafficMultiplier = 1.0;
        if (totalBaseCost > 0) {
            trafficMultiplier += (totalBaseCost / 500) * 0.4; // +40% traffic per $500 spent
        }
        if (adBudget > 0) {
            trafficMultiplier += (adBudget / 1000) * 0.6; // +60% traffic per $1000 ad budget
        }

        // Leads = Math.round(monthlyCost / 35 * (activeChecks > 0 ? activeChecks : 1))
        const estimatedLeads = Math.round((monthlyCost / 32) * (activeChecks > 0 ? (1 + activeChecks * 0.1) : 0.8));
        
        // ROI estimate percentage
        const estimatedRoi = Math.max(120, Math.round(150 + (trafficMultiplier * 20)));

        // Update DOM
        if (costDisplay) costDisplay.textContent = `$${monthlyCost.toLocaleString()}`;
        if (leadsDisplay) leadsDisplay.textContent = `${estimatedLeads}`;
        if (roiDisplay) roiDisplay.textContent = `${estimatedRoi}%`;
    };

    if (calcCheckboxes.length > 0) {
        calcCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateCalculator);
        });
        if (budgetSlider) {
            budgetSlider.addEventListener('input', updateCalculator);
        }
        // Run once on load
        updateCalculator();
    }

    // Scroll to contact form with prefilled state on Quote submit
    const quoteCta = document.getElementById('quote-cta-btn');
    if (quoteCta) {
        quoteCta.addEventListener('click', () => {
            const selectedServices = [];
            calcCheckboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    selectedServices.push(checkbox.value);
                }
            });

            // Store in sessionStorage to populate in contact form if on contact page or redirect
            sessionStorage.setItem('selected_services', JSON.stringify(selectedServices));
            sessionStorage.setItem('budget_selected', budgetSlider ? budgetSlider.value : 0);

            // Redirect or scroll to contact
            if (document.getElementById('contact-form')) {
                document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' });
                // Populate checks
                populateContactServices();
            } else {
                window.location.href = 'contact.html';
            }
        });
    }

    const populateContactServices = () => {
        const contactServicesInput = document.getElementById('contact-services');
        if (contactServicesInput) {
            const saved = sessionStorage.getItem('selected_services');
            if (saved) {
                const services = JSON.parse(saved);
                contactServicesInput.value = services.join(', ');
                
                const savedBudget = sessionStorage.getItem('budget_selected');
                const contactMsg = document.getElementById('contact-message');
                if (contactMsg && savedBudget) {
                    contactMsg.value = `Hi, I used the calculator and I'm interested in: ${services.join(', ')} with an estimated ad spend budget of $${parseInt(savedBudget).toLocaleString()}/mo. Please get in touch!`;
                }
            }
        }
    };

    // Run if on contact page
    if (document.getElementById('contact-services')) {
        populateContactServices();
    }

    /* ==========================================
       10. FORM SUBMISSION (LOCAL STORAGE RECORD)
       ========================================== */
    const contactForm = document.getElementById('contact-form-el');
    const successOverlay = document.querySelector('.form-success-overlay');
    
    if (contactForm && successOverlay) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Validate fields
            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const site = document.getElementById('contact-website').value.trim();
            const msg = document.getElementById('contact-message').value.trim();

            if (!name || !email || !msg) {
                alert('Please fill in all required fields (Name, Email, and Message).');
                return;
            }

            // Save form data to localStorage as simulated backend lead capture
            const lead = {
                name,
                email,
                website: site,
                message: msg,
                services: document.getElementById('contact-services') ? document.getElementById('contact-services').value : '',
                timestamp: new Date().toISOString()
            };

            const existingLeads = JSON.parse(localStorage.getItem('leads') || '[]');
            existingLeads.push(lead);
            localStorage.setItem('leads', JSON.stringify(existingLeads));

            // Show success animation overlay
            successOverlay.classList.add('active');
            contactForm.reset();
            sessionStorage.removeItem('selected_services');
            sessionStorage.removeItem('budget_selected');
        });

        // Close success state
        const closeSuccessBtn = document.getElementById('success-close-btn');
        if (closeSuccessBtn) {
            closeSuccessBtn.addEventListener('click', () => {
                successOverlay.classList.remove('active');
            });
        }
    }
});
