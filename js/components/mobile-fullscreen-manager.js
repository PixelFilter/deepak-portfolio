/**
 * Mobile Fullscreen Manager
 * Handles automatic fullscreen requests on mobile devices
 */

class MobileFullscreenManager {
    constructor() {
        this.isMobile = this.detectMobile();
        this.hasTriggeredFullscreen = false;
        this.init();
    }

    detectMobile() {
        // Check for mobile user agents and touch capability
        const userAgent = navigator.userAgent.toLowerCase();
        const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isSmallScreen = window.innerWidth <= 768;
        
        return isMobileUA || (isTouchDevice && isSmallScreen);
    }

    init() {
        if (!this.isMobile) return;

        // Wait for the page to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupFullscreenTriggers();
            });
        } else {
            this.setupFullscreenTriggers();
        }
    }

    setupFullscreenTriggers() {
        // Set up viewport meta tag for better mobile experience
        this.setupViewport();
        
        // Request fullscreen on first user interaction
        this.setupFirstInteractionFullscreen();
        
        // Listen for orientation changes
        this.setupOrientationHandling();
        
        // Hide address bar on scroll (fallback method)
        this.setupScrollHiding();
    }

    setupViewport() {
        // Ensure viewport is properly configured for mobile
        let viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute('content', 
                'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
            );
        }
    }

    setupFirstInteractionFullscreen() {
        const triggerFullscreen = () => {
            if (this.hasTriggeredFullscreen) return;
            this.hasTriggeredFullscreen = true;
            
            // Try different fullscreen methods
            this.requestFullscreen();
            
            // Remove listeners after first trigger
            document.removeEventListener('touchstart', triggerFullscreen);
            document.removeEventListener('click', triggerFullscreen);
        };

        // Listen for first touch or click
        document.addEventListener('touchstart', triggerFullscreen, { passive: true });
        document.addEventListener('click', triggerFullscreen, { passive: true });
    }

    async requestFullscreen() {
        try {
            const element = document.documentElement;
            
            // Try modern Fullscreen API
            if (element.requestFullscreen) {
                await element.requestFullscreen();
            } else if (element.webkitRequestFullscreen) {
                await element.webkitRequestFullscreen();
            } else if (element.mozRequestFullScreen) {
                await element.mozRequestFullScreen();
            } else if (element.msRequestFullscreen) {
                await element.msRequestFullscreen();
            }
            
            console.log('Fullscreen activated');
        } catch (error) {
            console.log('Fullscreen not available or denied:', error.message);
            // Fallback to address bar hiding
            this.hideAddressBar();
        }
    }

    hideAddressBar() {
        // Fallback method to hide address bar
        setTimeout(() => {
            window.scrollTo(0, 1);
        }, 100);
        
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 200);
    }

    setupOrientationHandling() {
        // Handle orientation changes
        const handleOrientationChange = () => {
            setTimeout(() => {
                if (document.fullscreenElement) {
                    // Already in fullscreen, just adjust
                    this.adjustForOrientation();
                } else {
                    // Try to re-enter fullscreen if needed
                    this.hideAddressBar();
                }
            }, 500);
        };

        // Listen for orientation changes
        if (screen.orientation) {
            screen.orientation.addEventListener('change', handleOrientationChange);
        } else {
            window.addEventListener('orientationchange', handleOrientationChange);
        }

        // Also listen for resize events
        window.addEventListener('resize', () => {
            setTimeout(() => {
                this.adjustForOrientation();
            }, 300);
        });
    }

    adjustForOrientation() {
        // Adjust viewport height for mobile browsers
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // Force a repaint
        document.body.style.height = `${window.innerHeight}px`;
        setTimeout(() => {
            document.body.style.height = '';
        }, 100);
    }

    setupScrollHiding() {
        // Hide address bar on scroll (works on some mobile browsers)
        let ticking = false;
        
        const hideOnScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    if (window.scrollY > 10) {
                        this.hideAddressBar();
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', hideOnScroll, { passive: true });
    }

    // Public method to manually trigger fullscreen
    enterFullscreen() {
        if (!this.hasTriggeredFullscreen) {
            this.hasTriggeredFullscreen = true;
            this.requestFullscreen();
        }
    }

    // Public method to exit fullscreen
    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }

    // Check if currently in fullscreen
    isFullscreen() {
        return !!(document.fullscreenElement || 
                 document.webkitFullscreenElement || 
                 document.mozFullScreenElement || 
                 document.msFullscreenElement);
    }
}

// Initialize the mobile fullscreen manager
window.mobileFullscreenManager = new MobileFullscreenManager();
