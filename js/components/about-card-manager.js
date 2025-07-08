/**
 * Interactive About Card Manager
 * Handles the display, animation, and interaction of the about card
 */

class AboutCardManager {
    constructor() {
        this.isCardOpen = false;
        this.cardElement = null;
        this.overlayElement = null;
        this.resizeObserver = null;
        
        this.init();
    }

    init() {
        // Only initialize if document is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.createAboutCard();
                this.bindEvents();
                this.setupResizeHandling();
            });
        } else {
            this.createAboutCard();
            this.bindEvents();
            this.setupResizeHandling();
        }
    }

    createAboutCard() {
        // Get about data from portfolio data
        const aboutData = window.portfolioData?.about;
        const personalData = window.portfolioData?.personal;

        if (!aboutData) {
            console.error('About data not found in portfolio data');
            return;
        }

        // Generate about content from bio array
        const aboutContent = aboutData.bio.map(paragraph => 
            `<p>${paragraph}</p>`
        ).join('\n            ');

        // Create the overlay
        this.overlayElement = document.createElement('div');
        this.overlayElement.className = 'about-card-overlay';
        this.overlayElement.innerHTML = `
            <div class="about-card" id="about-card">
                <div class="about-card-inner">
                    <button class="about-card-close" aria-label="Close about card">
                        <span>&times;</span>
                    </button>
                    <div class="about-content">
                        <div class="about-header">
                            <img src="${aboutData.photo}" alt="${aboutData.name}" class="about-photo">
                            <h2 class="about-name">${aboutData.name}</h2>
                            <p class="about-role">${aboutData.role}</p>
                        </div>
                        <div class="about-text">
                            ${aboutContent}
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add to DOM
        document.body.appendChild(this.overlayElement);
        this.cardElement = this.overlayElement.querySelector('.about-card');
    }

    bindEvents() {
        // Overlay click to close
        this.overlayElement?.addEventListener('click', (e) => {
            if (e.target === this.overlayElement) {
                this.closeCard();
            }
        });

        // Close button clicks with mobile support
        const closeButton = this.overlayElement?.querySelector('.about-card-close');
        if (closeButton) {
            // Primary click handler
            closeButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeCard();
            });
            
            // Mobile touch event handlers
            closeButton.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
            }, { passive: false });
            
            closeButton.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeCard();
            }, { passive: false });
        }

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isCardOpen) {
                this.closeCard();
            }
        });

        // Listen for about navigation clicks
        document.addEventListener('click', (e) => {
            const aboutTrigger = e.target.closest('[data-nav="about"], .nav-item[href="#about"]');
            if (aboutTrigger) {
                e.preventDefault();
                this.openCard();
            }
        });

        // Handle focus trapping for accessibility
        document.addEventListener('keydown', (e) => {
            if (!this.isCardOpen) return;
            
            if (e.key === 'Tab') {
                this.handleTabNavigation(e);
            }
        });
    }

    handleTabNavigation(e) {
        if (!this.overlayElement) return;

        const focusableElements = this.overlayElement.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const focusableArray = Array.from(focusableElements);
        const firstElement = focusableArray[0];
        const lastElement = focusableArray[focusableArray.length - 1];

        if (e.shiftKey) {
            // Shift + Tab (backward navigation)
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab (forward navigation)
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }

    openCard() {
        if (this.isCardOpen || !this.overlayElement) return;

        this.isCardOpen = true;
        document.body.style.overflow = 'hidden';
        
        // Add active class for fade in
        this.overlayElement.classList.add('active');
        
        // Apply initial responsive styles immediately
        this.applyResponsiveStyles();
        
        // Start observing for resize changes
        if (this.resizeObserver && this.cardElement) {
            this.resizeObserver.observe(this.cardElement);
            this.resizeObserver.observe(document.documentElement);
        }
        
        // Focus management for accessibility
        const firstFocusable = this.overlayElement.querySelector('.about-card-close');
        if (firstFocusable) {
            setTimeout(() => firstFocusable.focus(), 100);
        }

        // Update navigation buttons when about card is opened
        this.updateNavigationButtons();

        // Track analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'about_card_opened', {
                event_category: 'engagement',
                event_label: 'about_popup'
            });
        }

        // Trigger custom event
        document.dispatchEvent(new CustomEvent('aboutCardOpen'));
    }

    closeCard() {
        if (!this.isCardOpen || !this.overlayElement) return;

        this.isCardOpen = false;
        document.body.style.overflow = '';
        
        // Stop observing for resize changes
        if (this.resizeObserver && this.cardElement) {
            this.resizeObserver.unobserve(this.cardElement);
            this.resizeObserver.unobserve(document.documentElement);
        }
        
        // Clean up any inline styles
        if (this.cardElement) {
            this.cardElement.style.removeProperty('width');
            this.cardElement.style.removeProperty('max-width');
            this.cardElement.style.removeProperty('height');
            this.cardElement.style.removeProperty('max-height');
            this.cardElement.style.removeProperty('min-height');
        }
        
        // Remove active class for fade out
        this.overlayElement.classList.remove('active');

        // Update navigation buttons when about card is closed
        this.updateNavigationButtons();

        // Track analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'about_card_closed', {
                event_category: 'engagement',
                event_label: 'about_popup'
            });
        }

        // Trigger custom event
        document.dispatchEvent(new CustomEvent('aboutCardClose'));
    }

    // Public method to open card programmatically
    show() {
        this.openCard();
    }

    // Public method to close card programmatically
    hide() {
        this.closeCard();
    }

    // Public method to check if card is open
    isOpen() {
        return this.isCardOpen;
    }

    updateNavigationButtons() {
        // Update navigation buttons when about card state changes
        if (window.timelineManager && window.timelineManager.updateNavigationButtons) {
            window.timelineManager.updateNavigationButtons();
        }
    }

    setupResizeHandling() {
        // Immediate resize handler for real-time updates
        const handleResizeImmediate = () => {
            if (this.isCardOpen && this.cardElement) {
                this.updateCardDimensions();
            }
        };

        // Debounced resize handler for final cleanup
        let resizeTimeout;
        const handleResizeDebounced = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (this.isCardOpen && this.cardElement) {
                    this.finalizeResize();
                }
            }, 150);
        };

        // Add both immediate and debounced handlers
        window.addEventListener('resize', handleResizeImmediate);
        window.addEventListener('resize', handleResizeDebounced);

        // Set up ResizeObserver for viewport changes
        if (window.ResizeObserver) {
            this.resizeObserver = new ResizeObserver((entries) => {
                if (this.isCardOpen) {
                    // Trigger immediate update on any size change
                    requestAnimationFrame(() => {
                        this.updateCardDimensions();
                    });
                }
            });
        }

        // Also listen to orientationchange for mobile devices
        window.addEventListener('orientationchange', () => {
            if (this.isCardOpen) {
                setTimeout(() => {
                    this.updateCardDimensions();
                }, 100); // Small delay for orientation change to complete
            }
        });
    }

    updateCardDimensions() {
        if (!this.cardElement || !this.overlayElement) return;

        // Add resizing class for smooth transitions
        this.cardElement.classList.add('resizing');
        this.overlayElement.classList.add('resizing');
        
        // Force layout recalculation
        this.cardElement.offsetHeight;
        
        // Update viewport-based sizing immediately
        this.applyResponsiveStyles();
    }

    applyResponsiveStyles() {
        if (!this.cardElement) return;

        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight,
            isPortrait: window.innerHeight > window.innerWidth
        };

        // Apply dynamic styling based on current viewport
        const cardStyle = this.cardElement.style;
        
        // Reset any inline styles first
        cardStyle.removeProperty('width');
        cardStyle.removeProperty('max-width');
        cardStyle.removeProperty('height');
        cardStyle.removeProperty('max-height');
        cardStyle.removeProperty('min-height');

        // Force a style recalculation
        this.cardElement.offsetHeight;

        // Apply responsive rules programmatically for immediate effect
        if (viewport.width <= 480) {
            cardStyle.setProperty('width', '95vw', 'important');
            cardStyle.setProperty('max-width', '400px', 'important');
            cardStyle.setProperty('max-height', '75vh', 'important');
            cardStyle.setProperty('min-height', '320px', 'important');
        } else if (viewport.width <= 768) {
            cardStyle.setProperty('width', '90vw', 'important');
            cardStyle.setProperty('max-width', '500px', 'important');
            cardStyle.setProperty('max-height', viewport.isPortrait ? '80vh' : '85vh', 'important');
            cardStyle.setProperty('min-height', viewport.isPortrait ? '400px' : '350px', 'important');
        } else if (viewport.width <= 1200) {
            cardStyle.setProperty('width', '650px', 'important');
            cardStyle.setProperty('max-width', '85vw', 'important');
            cardStyle.setProperty('max-height', viewport.isPortrait ? '75vh' : '70vh', 'important');
        } else if (viewport.width >= 1400) {
            cardStyle.setProperty('width', '900px', 'important');
            cardStyle.setProperty('max-height', '70vh', 'important');
        } else {
            cardStyle.setProperty('width', '800px', 'important');
            cardStyle.setProperty('max-width', '90vw', 'important');
            cardStyle.setProperty('max-height', viewport.isPortrait ? '85vh' : '75vh', 'important');
        }

        // Force another layout recalculation to apply changes immediately
        this.cardElement.offsetHeight;
    }

    finalizeResize() {
        if (!this.cardElement || !this.overlayElement) return;
        
        // Remove resizing classes after transition
        this.cardElement.classList.remove('resizing');
        this.overlayElement.classList.remove('resizing');
    }
}

// Initialize the about card manager
window.aboutCardManager = new AboutCardManager();
