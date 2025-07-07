/**
 * Interactive About Card Manager
 * Handles the display, animation, and interaction of the about card
 */

class AboutCardManager {
    constructor() {
        this.isCardOpen = false;
        this.cardElement = null;
        this.overlayElement = null;
        
        this.init();
    }

    init() {
        // Only initialize if document is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.createAboutCard();
                this.bindEvents();
            });
        } else {
            this.createAboutCard();
            this.bindEvents();
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
                        <img src="${aboutData.photo}" alt="${aboutData.name}" class="about-photo">
                        <h2 class="about-name">${aboutData.name}</h2>
                        <p class="about-role">${aboutData.role}</p>
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
    }

    openCard() {
        if (this.isCardOpen || !this.overlayElement) return;

        this.isCardOpen = true;
        document.body.style.overflow = 'hidden';
        
        // Add active class for fade in
        this.overlayElement.classList.add('active');
        
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
}

// Initialize the about card manager
window.aboutCardManager = new AboutCardManager();
