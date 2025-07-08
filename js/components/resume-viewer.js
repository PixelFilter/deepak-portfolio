/**
 * Resume PDF Viewer Modal Manager
 * Handles the display and interaction of the resume PDF viewer modal
 */

class ResumeViewer {
    constructor() {
        this.isViewerOpen = false;
        this.viewerElement = null;
        this.overlayElement = null;
        this.resumeUrl = null;
        
        this.init();
    }

    init() {
        // Only initialize if document is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupResumeUrl();
                this.createResumeViewer();
                this.bindEvents();
            });
        } else {
            this.setupResumeUrl();
            this.createResumeViewer();
            this.bindEvents();
        }
    }

    setupResumeUrl() {
        // Get resume URL from portfolio data
        const resumeFile = window.portfolioData?.personal?.resumeFile;
        
        if (resumeFile) {
            // Convert Google Drive view link to embedded preview link
            if (resumeFile.includes('drive.google.com')) {
                const fileId = this.extractGoogleDriveFileId(resumeFile);
                if (fileId) {
                    // Check if we're on mobile to hide Google Drive's toolbar
                    const isMobile = window.innerWidth <= 768;
                    if (isMobile) {
                        // Use embedded URL that hides the toolbar on mobile
                        this.resumeUrl = `https://drive.google.com/file/d/${fileId}/preview?usp=embed_facebook&chrome=false&toolbar=false`;
                    } else {
                        this.resumeUrl = `https://drive.google.com/file/d/${fileId}/preview`;
                    }
                }
            } else {
                this.resumeUrl = resumeFile;
            }
        }
    }

    extractGoogleDriveFileId(url) {
        const match = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
        return match ? match[1] : null;
    }

    createResumeViewer() {
        if (!this.resumeUrl) {
            console.error('Resume URL not found in portfolio data');
            return;
        }

        // Create the overlay
        this.overlayElement = document.createElement('div');
        this.overlayElement.className = 'resume-viewer-overlay';
        this.overlayElement.innerHTML = `
            <div class="resume-viewer" id="resume-viewer">
                <div class="resume-viewer-inner">
                    <div class="resume-viewer-header">
                        <h2 class="resume-viewer-title">Resume</h2>
                        <div class="resume-viewer-controls">
                            <button class="resume-viewer-external" aria-label="Open resume in new tab" title="Open in new tab">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                    <polyline points="15,3 21,3 21,9"></polyline>
                                    <line x1="10" y1="14" x2="21" y2="3"></line>
                                </svg>
                            </button>
                            <button class="resume-viewer-close" aria-label="Close resume viewer">
                                <span>&times;</span>
                            </button>
                        </div>
                    </div>
                    <div class="resume-viewer-content">
                        <div class="resume-loading">
                            <div class="loading-spinner"></div>
                            <p>Loading resume...</p>
                        </div>
                        <iframe 
                            src="${this.resumeUrl}" 
                            class="resume-iframe"
                            frameborder="0"
                            allowfullscreen
                            title="Resume PDF Viewer"
                            style="display: none;">
                        </iframe>
                        <div class="resume-error" style="display: none;">
                            <p>Unable to load resume preview.</p>
                            <button class="resume-error-external">Open in new tab instead</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add to DOM
        document.body.appendChild(this.overlayElement);
        this.viewerElement = this.overlayElement.querySelector('.resume-viewer');
        
        // Set up iframe loading handlers
        this.setupIframeHandlers();
    }

    setupIframeHandlers() {
        const iframe = this.overlayElement.querySelector('.resume-iframe');
        const loadingElement = this.overlayElement.querySelector('.resume-loading');
        const errorElement = this.overlayElement.querySelector('.resume-error');

        if (iframe) {
            iframe.addEventListener('load', () => {
                // Check if the iframe actually loaded content
                try {
                    // For same-origin content, we could check the content
                    // For cross-origin (like Google Drive), we just assume it loaded
                    loadingElement.style.display = 'none';
                    iframe.style.display = 'block';
                } catch (e) {
                    // Cross-origin restriction, but iframe loaded
                    loadingElement.style.display = 'none';
                    iframe.style.display = 'block';
                }
            });

            iframe.addEventListener('error', () => {
                loadingElement.style.display = 'none';
                errorElement.style.display = 'flex';
            });

            // Fallback timeout for loading
            setTimeout(() => {
                if (loadingElement.style.display !== 'none') {
                    loadingElement.style.display = 'none';
                    iframe.style.display = 'block';
                }
            }, 8000); // Increased timeout for slower connections
        }
    }

    bindEvents() {
        // Overlay click to close
        this.overlayElement?.addEventListener('click', (e) => {
            if (e.target === this.overlayElement) {
                this.closeViewer();
            }
        });

        // Close button clicks
        const closeButton = this.overlayElement?.querySelector('.resume-viewer-close');
        if (closeButton) {
            closeButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeViewer();
            });
            
            // Mobile touch support
            closeButton.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
            }, { passive: false });
            
            closeButton.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeViewer();
            }, { passive: false });
        }

        // External link button
        const externalButton = this.overlayElement?.querySelector('.resume-viewer-external');
        if (externalButton) {
            externalButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openInNewTab();
            });
        }

        // Error fallback external button
        const errorExternalButton = this.overlayElement?.querySelector('.resume-error-external');
        if (errorExternalButton) {
            errorExternalButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openInNewTab();
            });
        }

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isViewerOpen) {
                this.closeViewer();
            }
        });

        // Listen for resume navigation clicks
        document.addEventListener('click', (e) => {
            const resumeTrigger = e.target.closest('[data-nav="resume"], .nav-btn');
            if (resumeTrigger) {
                // Check if this is the resume button
                const isResumeButton = resumeTrigger.textContent.includes('RESUME') || 
                                     resumeTrigger.href?.includes('drive.google.com') ||
                                     resumeTrigger.getAttribute('href')?.includes('drive.google.com');
                
                if (isResumeButton) {
                    e.preventDefault();
                    this.openViewer();
                }
            }
        });

        // Handle focus trapping for accessibility
        document.addEventListener('keydown', (e) => {
            if (!this.isViewerOpen) return;
            
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

    openViewer() {
        if (this.isViewerOpen || !this.overlayElement) return;

        this.isViewerOpen = true;
        document.body.style.overflow = 'hidden';
        
        // Add active class for fade in
        this.overlayElement.classList.add('active');
        
        // Focus management for accessibility
        const firstFocusable = this.overlayElement.querySelector('.resume-viewer-external');
        if (firstFocusable) {
            setTimeout(() => firstFocusable.focus(), 100);
        }

        // Reset iframe and loading states
        const iframe = this.overlayElement.querySelector('.resume-iframe');
        const loadingElement = this.overlayElement.querySelector('.resume-loading');
        const errorElement = this.overlayElement.querySelector('.resume-error');
        
        if (iframe && loadingElement && errorElement) {
            iframe.style.display = 'none';
            loadingElement.style.display = 'flex';
            errorElement.style.display = 'none';
            
            // Update URL based on current screen size before reloading
            this.setupResumeUrl();
            iframe.src = this.resumeUrl;
        }

        // Track analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'resume_viewer_opened', {
                event_category: 'engagement',
                event_label: 'resume_modal'
            });
        }

        // Trigger custom event
        document.dispatchEvent(new CustomEvent('resumeViewerOpen'));
    }

    closeViewer() {
        if (!this.isViewerOpen || !this.overlayElement) return;

        this.isViewerOpen = false;
        document.body.style.overflow = '';
        
        // Remove active class for fade out
        this.overlayElement.classList.remove('active');

        // Track analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'resume_viewer_closed', {
                event_category: 'engagement',
                event_label: 'resume_modal'
            });
        }

        // Trigger custom event
        document.dispatchEvent(new CustomEvent('resumeViewerClose'));
    }

    openInNewTab() {
        const originalUrl = window.portfolioData?.personal?.resumeFile;
        if (originalUrl) {
            window.open(originalUrl, '_blank', 'noopener,noreferrer');
            
            // Track analytics if available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'resume_external_open', {
                    event_category: 'engagement',
                    event_label: 'resume_new_tab'
                });
            }
        }
    }

    // Public method to show the viewer
    show() {
        this.openViewer();
    }

    // Public method to hide the viewer
    hide() {
        this.closeViewer();
    }
}

// Initialize the resume viewer when the script loads
if (typeof window !== 'undefined') {
    window.resumeViewer = new ResumeViewer();
}
