// Content Manager Component
class ContentManager {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.contentCards = document.querySelectorAll('.content-card');
        this.activeFilter = 'all';
        this.init();
    }
    init() {
        this.setupFilterListeners();
        this.setupCardInteractions();
        this.setupInfoPanelClickOutside();
        this.setupResizeListener();
    }
    // Method to refresh card references after UI is built
    refreshCardReferences() {
        this.contentCards = document.querySelectorAll('.content-card');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.setupCardInteractions();
        this.setupFilterListeners();
    }
    setupFilterListeners() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                this.setActiveFilter(filter);
                this.switchToCategory(filter);
            });
        });
    }
    setupCardInteractions() {
        this.contentCards.forEach(card => {
            card.addEventListener('click', () => {
                this.showBackgroundText(card);
                this.handleCardClick(card);
            });
        });
        // Don't show first card's text by default - let timeline manager handle initial content
        // This prevents double video loading on page load
        // if (this.contentCards.length > 0) {
        //     this.showBackgroundText(this.contentCards[0]);
        // }
    }
    setActiveFilter(filter) {
        this.activeFilter = filter;
        // Update button states
        this.filterButtons.forEach(button => {
            button.classList.remove('active');
            if (button.dataset.filter === filter) {
                button.classList.add('active');
            }
        });
    }
    filterContent(filter) {
        this.contentCards.forEach(card => {
            const cardType = card.classList.contains('games') ? 'games' :
                           card.classList.contains('work') ? 'work' : 'other';
            if (filter === 'all' || cardType === filter) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease';
            } else {
                card.style.display = 'none';
            }
        });
    }
    handleCardClick(card) {
        // Add click effect
        card.style.transform = 'translateY(-4px) scale(0.98)';
        setTimeout(() => {
            card.style.transform = 'translateY(-2px) scale(1)';
        }, 150);
        // You can add modal functionality here later
    }
    showContentPanel() {
        const contentPanel = document.getElementById('contentPanel');
        if (contentPanel) {
            contentPanel.classList.add('visible');
        }
    }
    hideContentPanel() {
        const contentPanel = document.getElementById('contentPanel');
        if (contentPanel) {
            contentPanel.classList.remove('visible');
        }
    }
    showBackgroundText(card, isInstant = false) {
        const backgroundText = document.getElementById('backgroundText');
        const backgroundProjectImage = document.getElementById('backgroundProjectImage');
        const title = backgroundText?.querySelector('.background-title');
        const description = backgroundText?.querySelector('.background-description');
        const company = backgroundText?.querySelector('.background-company');
        const role = backgroundText?.querySelector('.background-role');
        const contributionsBtn = backgroundText?.querySelector('.contributions-btn'); // Button is back in the stack
        // Info panel elements
        const infoPanel = document.getElementById('infoPanel');
        const infoPanelHeader = infoPanel?.querySelector('.info-panel-header');
        const infoPanelList = infoPanel?.querySelector('.info-panel-list');
        
        // Handle project image
        if (backgroundProjectImage) {
            const projectImage = card.dataset.projectImage || '';
            if (projectImage) {
                // Check if we're on mobile (screen width <= 1024px)
                const isMobile = window.innerWidth <= 1024;
                
                if (isMobile) {
                    // On mobile, append image to background text container
                    if (backgroundProjectImage.parentNode !== backgroundText) {
                        backgroundText.appendChild(backgroundProjectImage);
                    }
                } else {
                    // On desktop, keep image in body
                    if (backgroundProjectImage.parentNode !== document.body) {
                        document.body.appendChild(backgroundProjectImage);
                    }
                }
                
                // Check if the image source has changed to avoid unnecessary updates
                if (backgroundProjectImage.src !== new URL(projectImage, window.location.origin).href) {
                    // Preload the image before showing it
                    const img = new Image();
                    img.onload = () => {
                        backgroundProjectImage.src = projectImage;
                        backgroundProjectImage.style.display = 'block';
                        backgroundProjectImage.classList.add('visible');
                        // Remove no-image class when image is visible
                        if (backgroundText) {
                            backgroundText.classList.remove('no-project-image');
                        }
                    };
                    img.onerror = () => {
                        console.warn('Failed to load project image:', projectImage);
                        backgroundProjectImage.classList.remove('visible');
                        backgroundProjectImage.style.display = 'none';
                        // Add no-image class when image fails to load
                        if (backgroundText) {
                            backgroundText.classList.add('no-project-image');
                        }
                    };
                    img.src = projectImage;
                } else {
                    // Image is already loaded, just show it
                    backgroundProjectImage.style.display = 'block';
                    backgroundProjectImage.classList.add('visible');
                    // Remove no-image class when image is visible
                    if (backgroundText) {
                        backgroundText.classList.remove('no-project-image');
                    }
                }
            } else {
                // No project image - hide completely
                backgroundProjectImage.classList.remove('visible');
                backgroundProjectImage.style.display = 'none';
                backgroundProjectImage.src = ''; // Clear the src to avoid unnecessary loading
                
                // Add class to background text for responsive centering
                if (backgroundText) {
                    backgroundText.classList.add('no-project-image');
                }
                
                // In responsive mode, remove from DOM to prevent layout interference
                const isMobile = window.innerWidth <= 1024;
                if (isMobile && backgroundProjectImage.parentNode) {
                    backgroundProjectImage.remove();
                    // Re-append to body to keep it available for future use
                    document.body.appendChild(backgroundProjectImage);
                }
            }
        }
        if (backgroundText && title && description) {
            // Apply a subtle zoom effect during content change only if not instant
            if (!isInstant) {
                backgroundText.classList.add('transitioning');
            }
            title.innerHTML = card.dataset.title.replace(/\n/g, '<br>') || '';
            description.textContent = card.dataset.description || '';
            // Only set company and role if elements exist
            if (company) {
                company.textContent = card.dataset.company || '';
            }
            if (role) {
                role.textContent = card.dataset.role || '';
            }
            // Handle contributions button
            if (contributionsBtn) {
                const buttonLabel = card.dataset.buttonLabel || 'View Contributions';
                const buttonURL = card.dataset.buttonURL || '';
                const infoPanelHeaderText = card.dataset.infoPanelHeader;
                const infoPanelData = card.dataset.infoPanelData;
                // Check if there's info panel data to show
                let hasInfoPanelData = false;
                if (infoPanelHeaderText && infoPanelData) {
                    try {
                        const infoPanelItems = JSON.parse(infoPanelData);
                        hasInfoPanelData = infoPanelItems.length > 0;
                    } catch (e) {
                        console.warn('Failed to parse info panel data:', e);
                    }
                }
                if (hasInfoPanelData) {
                    // Show button that opens info panel
                    contributionsBtn.textContent = buttonLabel;
                    contributionsBtn.style.display = 'inline-block';
                    contributionsBtn.onclick = () => {
                        this.toggleInfoPanel(card);
                    };
                } else if (buttonURL) {
                    // Show button that redirects to URL
                    contributionsBtn.textContent = buttonLabel;
                    contributionsBtn.style.display = 'inline-block';
                    contributionsBtn.onclick = () => {
                        window.open(buttonURL, '_blank');
                    };
                } else {
                    // Hide button if no info panel data and no URL
                    contributionsBtn.style.display = 'none';
                }
            }
            backgroundText.classList.add('visible');
            // Handle info panel - hide by default, will be shown when button is clicked
            if (infoPanel && infoPanelHeader && infoPanelList) {
                const infoPanelHeaderText = card.dataset.infoPanelHeader;
                const infoPanelData = card.dataset.infoPanelData;
                if (infoPanelHeaderText && infoPanelData) {
                    // Parse info panel data
                    let infoPanelItems = [];
                    try {
                        infoPanelItems = JSON.parse(infoPanelData);
                    } catch (e) {
                        console.warn('Failed to parse info panel data:', e);
                    }
                    if (infoPanelItems.length > 0) {
                        // Update header and content but keep hidden
                        infoPanelHeader.textContent = infoPanelHeaderText;
                        // Clear existing items
                        infoPanelList.innerHTML = '';
                        // Add new items
                        infoPanelItems.forEach(item => {
                            const li = document.createElement('li');
                            li.className = 'info-panel-item';
                            li.textContent = item;
                            infoPanelList.appendChild(li);
                        });
                        // Keep info panel hidden by default
                        infoPanel.classList.remove('visible');
                    } else {
                        // Hide info panel if no data
                        infoPanel.classList.remove('visible');
                    }
                } else {
                    // Hide info panel if no header or data
                    infoPanel.classList.remove('visible');
                }
            }
            // Remove transition effect after animation only if it was added
            if (!isInstant) {
                setTimeout(() => {
                    backgroundText.classList.remove('transitioning');
                }, 600);
            }
            // Trigger video background change
            const trailerUrl = card.dataset.trailerUrl;
            const videoStart = card.dataset.videoStart;
            const videoEnd = card.dataset.videoEnd;
            const zoomVideo = card.dataset.zoomVideo === 'true';
            document.dispatchEvent(new CustomEvent('contentChanged', {
                detail: {
                    title: card.dataset.title,
                    description: card.dataset.description,
                    company: card.dataset.company,
                    role: card.dataset.role,
                    trailerUrl: trailerUrl,
                    videoStart: videoStart,
                    videoEnd: videoEnd,
                    zoomVideo: zoomVideo,
                    isInstant: isInstant
                }
            }));
        } else {
            console.warn('Background text elements not found:', {
                backgroundText: !!backgroundText,
                title: !!title,
                description: !!description,
                company: !!company,
                role: !!role,
                contributionsBtn: !!contributionsBtn
            });
        }
    }
    hideBackgroundText() {
        const backgroundText = document.getElementById('backgroundText');
        if (backgroundText) {
            backgroundText.classList.remove('visible');
        }
        const backgroundProjectImage = document.getElementById('backgroundProjectImage');
        if (backgroundProjectImage) {
            backgroundProjectImage.classList.remove('visible');
            setTimeout(() => {
                if (!backgroundProjectImage.classList.contains('visible')) {
                    backgroundProjectImage.style.display = 'none';
                }
            }, 500); // Wait for fade transition
        }
        const infoPanel = document.getElementById('infoPanel');
        if (infoPanel) {
            infoPanel.classList.remove('visible');
        }
    }
    toggleInfoPanel(card) {
        const infoPanel = document.getElementById('infoPanel');
        if (infoPanel) {
            if (infoPanel.classList.contains('visible')) {
                // Add closing state to immediately stop animations
                infoPanel.classList.add('closing');
                infoPanel.classList.remove('visible');
                // After animation completes, fully hide the panel
                setTimeout(() => {
                    if (infoPanel.classList.contains('closing')) {
                        infoPanel.classList.remove('closing');
                    }
                }, 300);
                this.showUIElements();
                this.resumeAutoTransition();
                // Update navigation buttons when info panel is closed
                this.updateNavigationButtons();
            } else {
                // Clear any previous states when showing
                infoPanel.classList.remove('closing');
                infoPanel.style.removeProperty('visibility');
                infoPanel.classList.add('visible');
                this.hideUIElements();
                this.pauseAutoTransition();
                // Update navigation buttons when info panel is opened
                this.updateNavigationButtons();
            }
        }
    }
    setupInfoPanelClickOutside() {
        // Close on click outside
        document.addEventListener('click', (event) => {
            const infoPanel = document.getElementById('infoPanel');
            const contributionsBtn = document.querySelector('.contributions-btn');
            if (infoPanel && infoPanel.classList.contains('visible')) {
                // Check if click was outside the info panel and not on the contributions button
                if (!infoPanel.contains(event.target) && 
                    !contributionsBtn?.contains(event.target)) {
                    // Add closing state to immediately stop animations
                    infoPanel.classList.add('closing');
                    infoPanel.classList.remove('visible');
                    // After animation completes, clean up the closing state
                    setTimeout(() => {
                        if (infoPanel.classList.contains('closing')) {
                            infoPanel.classList.remove('closing');
                        }
                    }, 300);
                    this.showUIElements();
                    this.resumeAutoTransition();
                    // Update navigation buttons when info panel is closed
                    this.updateNavigationButtons();
                }
            }
        });
        // Close on escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                const infoPanel = document.getElementById('infoPanel');
                if (infoPanel && infoPanel.classList.contains('visible')) {
                    // Add closing state to immediately stop animations
                    infoPanel.classList.add('closing');
                    infoPanel.classList.remove('visible');
                    // After animation completes, clean up the closing state
                    setTimeout(() => {
                        if (infoPanel.classList.contains('closing')) {
                            infoPanel.classList.remove('closing');
                        }
                    }, 300);
                    this.showUIElements();
                    this.resumeAutoTransition();
                    // Update navigation buttons when info panel is closed
                    this.updateNavigationButtons();
                }
            }
        });
    }
    hideUIElements() {
        // Disable main page scrolling
        document.body.style.overflow = 'hidden';
        
        // Disable touch actions to prevent swipe navigation on mobile
        document.body.style.touchAction = 'none';
        
        // Hide background text elements
        const backgroundText = document.getElementById('backgroundText');
        if (backgroundText) {
            backgroundText.classList.add('hidden-for-info-panel');
        }
        
        // Hide background project image
        const backgroundProjectImage = document.getElementById('backgroundProjectImage');
        if (backgroundProjectImage) {
            backgroundProjectImage.classList.add('hidden-for-info-panel');
        }
        
        // Hide timeline panel
        const timelinePanel = document.querySelector('.year-timeline');
        if (timelinePanel) {
            timelinePanel.classList.add('hidden-for-info-panel');
        }
        // Hide main scrollbar
        const customScrollbar = document.getElementById('customScrollbar');
        if (customScrollbar) {
            customScrollbar.classList.add('hidden-for-info-panel');
        }
        // Hide filter panel
        const filterPanel = document.querySelector('.header-filters');
        if (filterPanel) {
            filterPanel.classList.add('hidden-for-info-panel');
        }
        // Keep resume button visible - it's part of the header
        // const resumeBtn = document.querySelector('.resume-btn');
        // if (resumeBtn) {
        //     resumeBtn.classList.add('hidden-for-info-panel');
        // }
        // Keep title visible - don't hide it
        // const title = document.querySelector('.title');
        // if (title) {
        //     title.classList.add('hidden-for-info-panel');
        // }
    }
    showUIElements() {
        // Re-enable main page scrolling
        document.body.style.overflow = '';
        
        // Re-enable touch actions
        document.body.style.touchAction = '';
        
        // Show background text elements
        const backgroundText = document.getElementById('backgroundText');
        if (backgroundText) {
            backgroundText.classList.remove('hidden-for-info-panel');
        }
        
        // Show background project image
        const backgroundProjectImage = document.getElementById('backgroundProjectImage');
        if (backgroundProjectImage) {
            backgroundProjectImage.classList.remove('hidden-for-info-panel');
        }
        
        // Show timeline panel
        const timelinePanel = document.querySelector('.year-timeline');
        if (timelinePanel) {
            timelinePanel.classList.remove('hidden-for-info-panel');
        }
        // Show main scrollbar
        const customScrollbar = document.getElementById('customScrollbar');
        if (customScrollbar) {
            customScrollbar.classList.remove('hidden-for_info-panel');
        }
        // Show filter panel
        const filterPanel = document.querySelector('.header-filters');
        if (filterPanel) {
            filterPanel.classList.remove('hidden-for-info-panel');
        }
        // Resume button is always visible - it's part of the header
        // const resumeBtn = document.querySelector('.resume-btn');
        // if (resumeBtn) {
        //     resumeBtn.classList.remove('hidden-for-info-panel');
        // }
        // Title is always visible - no need to show/hide
        // const title = document.querySelector('.title');
        // if (title) {
        //     title.classList.remove('hidden-for_info-panel');
        // }
    }
    pauseAutoTransition() {
        if (window.timelineManager && window.timelineManager.pauseAutoTransition) {
            window.timelineManager.pauseAutoTransition();
        }
    }
    resumeAutoTransition() {
        if (window.timelineManager && window.timelineManager.resumeAutoTransition) {
            window.timelineManager.resumeAutoTransition();
        }
    }
    
    updateNavigationButtons() {
        // Update navigation buttons when info panel state changes
        if (window.timelineManager && window.timelineManager.updateNavigationButtons) {
            window.timelineManager.updateNavigationButtons();
        }
    }
    switchToCategory(filterId) {
        // Update the active filter in the data
        if (window.portfolioData && window.portfolioData.setActiveFilter) {
            window.portfolioData.setActiveFilter(filterId);
        }
        
        // Reset background text state for new category
        const backgroundText = document.getElementById('backgroundText');
        if (backgroundText) {
            backgroundText.classList.remove('no-project-image');
        }
        
        // Update the filter buttons UI
        this.setActiveFilter(filterId);
        // Rebuild the timeline and content for the new category
        this.rebuildTimelineForCategory();
        // Reset timeline manager to use new data - add small delay for DOM updates
        setTimeout(() => {
            if (window.timelineManager) {
                window.timelineManager.refreshForNewCategory();
            }
        }, 100);
    }
    rebuildTimelineForCategory() {
        // Get the new timeline data
        const timelineData = window.portfolioData.getTimelineData();
        // Rebuild the timeline UI
        if (window.app && window.app.uiBuilder) {
            window.app.uiBuilder.buildTimeline();
            window.app.uiBuilder.buildContentPanels();
        }
    }
    setupResizeListener() {
        // Handle window resize to reposition project image
        window.addEventListener('resize', () => {
            const backgroundProjectImage = document.getElementById('backgroundProjectImage');
            const backgroundText = document.getElementById('backgroundText');
            
            if (backgroundProjectImage && backgroundText) {
                const isMobile = window.innerWidth <= 1024;
                const hasVisibleImage = backgroundProjectImage.classList.contains('visible');
                
                if (isMobile) {
                    // Move to background text container if has visible image
                    if (hasVisibleImage && backgroundProjectImage.parentNode !== backgroundText) {
                        backgroundText.appendChild(backgroundProjectImage);
                    }
                    // Ensure proper class management for centering
                    if (!hasVisibleImage) {
                        backgroundText.classList.add('no-project-image');
                    } else {
                        backgroundText.classList.remove('no-project-image');
                    }
                } else {
                    // Move to body on desktop
                    if (backgroundProjectImage.parentNode !== document.body) {
                        document.body.appendChild(backgroundProjectImage);
                    }
                    // Remove mobile-specific class on desktop
                    backgroundText.classList.remove('no-project-image');
                }
            }
        });
    }
}
// Export for use in other modules
window.ContentManager = ContentManager;
