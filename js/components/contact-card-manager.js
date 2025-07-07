/**
 * Interactive Contact Card Manager
 * Handles the display, animation, and interaction of the contact card
 */

class ContactCardManager {
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
                this.createContactCard();
                this.bindEvents();
            });
        } else {
            this.createContactCard();
            this.bindEvents();
        }
    }

    createContactCard() {
        // Get connect data from portfolio data
        const connectData = window.portfolioData?.connect

        // Create the overlay
        this.overlayElement = document.createElement('div');
        this.overlayElement.className = 'contact-card-overlay';
        this.overlayElement.innerHTML = `
            <div class="contact-card" id="contact-card">
                <div class="contact-card-inner">
                    <button class="contact-card-close" aria-label="Close contact card">
                        <span>&times;</span>
                    </button>
                    <img src="${connectData.photo}" alt="Profile photo" class="contact-photo">
                    <h2 class="contact-name">${connectData.name}</h2>
                    <p class="contact-role">${connectData.role}</p>
                    <div class="social-links">
                        <a href="${connectData.social.linkedin}" target="_blank" rel="noopener noreferrer" class="social-link linkedin" aria-label="LinkedIn">
                            <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                        </a>
                        <a href="${connectData.social.instagram}" target="_blank" rel="noopener noreferrer" class="social-link instagram" aria-label="Instagram">
                            <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                        </a>
                        <a href="mailto:${connectData.social.email}" class="social-link email" aria-label="Email">
                            <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.overlayElement);
        this.cardElement = document.getElementById('contact-card');
    }

    bindEvents() {
        // Click outside to close
        this.overlayElement.addEventListener('click', (e) => {
            if (e.target === this.overlayElement) {
                this.closeCard();
            }
        });

        // Close button clicks with mobile support
        const closeButton = this.overlayElement.querySelector('.contact-card-close');
        
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

        // Ensure social links are tappable on mobile
        const socialLinks = this.overlayElement.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            // Add touch event handlers for mobile reliability
            link.addEventListener('touchstart', (e) => {
                e.stopPropagation();
                // Add visual feedback
                link.style.transform = 'scale(0.95)';
            }, { passive: false });
            
            link.addEventListener('touchend', (e) => {
                e.stopPropagation();
                // Reset visual feedback
                link.style.transform = '';
                // Don't preventDefault here to allow the link to navigate
            }, { passive: false });
            
            link.addEventListener('touchcancel', (e) => {
                e.stopPropagation();
                // Reset visual feedback
                link.style.transform = '';
            }, { passive: false });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.isCardOpen) {
                if (e.key === 'Escape') {
                    this.closeCard();
                }
            }
        });
    }

    openCard() {
        if (this.isCardOpen) return;
        
        this.isCardOpen = true;
        this.overlayElement.classList.add('active');
        
        // Focus trap for accessibility
        this.cardElement.setAttribute('tabindex', '0');
        this.cardElement.focus();
        
        // Update navigation buttons when contact card is opened
        this.updateNavigationButtons();
        
        // Trigger custom event
        document.dispatchEvent(new CustomEvent('contactCardOpen'));
    }

    closeCard() {
        if (!this.isCardOpen) return;
        
        this.isCardOpen = false;
        this.overlayElement.classList.remove('active');
        
        // Update navigation buttons when contact card is closed
        this.updateNavigationButtons();
        
        // Trigger custom event
        document.dispatchEvent(new CustomEvent('contactCardClose'));
    }

    // Public API
    show() {
        this.openCard();
    }

    hide() {
        this.closeCard();
    }

    toggle() {
        if (this.isCardOpen) {
            this.closeCard();
        } else {
            this.openCard();
        }
    }

    isOpen() {
        return this.isCardOpen;
    }

    updateNavigationButtons() {
        // Update navigation buttons when contact card state changes
        if (window.timelineManager && window.timelineManager.updateNavigationButtons) {
            window.timelineManager.updateNavigationButtons();
        }
    }

    updateContactInfo(info) {
        const nameElement = this.overlayElement.querySelector('.contact-name');
        const roleElement = this.overlayElement.querySelector('.contact-role');
        const photoElement = this.overlayElement.querySelector('.contact-photo');
        const linkedinLink = this.overlayElement.querySelector('.social-link.linkedin');
        const instagramLink = this.overlayElement.querySelector('.social-link.instagram');
        const emailLink = this.overlayElement.querySelector('.social-link.email');

        if (info.name && nameElement) nameElement.textContent = info.name;
        if (info.role && roleElement) roleElement.textContent = info.role;
        if (info.photo && photoElement) photoElement.src = info.photo;
        if (info.linkedin && linkedinLink) linkedinLink.href = info.linkedin;
        if (info.instagram && instagramLink) instagramLink.href = info.instagram;
        if (info.email && emailLink) emailLink.href = `mailto:${info.email}`;
    }
}

// Initialize the contact card manager
let contactCardManager;

// Initialize function
function initializeContactCardManager() {
    if (!contactCardManager) {
        contactCardManager = new ContactCardManager();
        window.contactCardManager = contactCardManager;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeContactCardManager();
    });
} else {
    initializeContactCardManager();
}

// Export for use in other modules
window.ContactCardManager = ContactCardManager;
