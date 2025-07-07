// Timeline Manager Component
class TimelineManager {
    constructor() {
        this.timelineItems = [];
        this.currentItemIndex = 0; // Start with the first item
        this.isScrolling = false;
        this.scrollTimer = null;
        this.lastScrollY = 0; // Track scroll direction
        this.isClickScrolling = false; // Track if scroll is from click
        this.keyboardListenerAdded = false; // Track if keyboard listener is added
        this.wheelDebounceTimer = null; // Timer for debouncing wheel events
        // Touch/swipe properties
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.minSwipeDistance = 50; // Minimum distance for a swipe
        this.maxVerticalSwipe = 100; // Maximum vertical movement to still count as horizontal swipe
        // Auto-transition properties
        this.autoTransitionTimer = null;
        this.autoTransitionDelay = 10000; // 10 seconds of inactivity before auto-transition
        this.isAutoTransitioning = false;
        this.autoTransitionEnabled = false; // Default to disabled, enabled after loading
        this.lastUserActivity = Date.now();
        this.init();
    }
    init() {
        // Delay initialization to ensure UI is built
        setTimeout(() => {
            this.refreshTimelineItems();
            this.setupScrollableBody();
            this.setupEventListeners();
            this.setupNavigationListeners();
            this.setInitialActiveItem();
            this.initialScrollToActiveItem();
            this.setupAutoTransition();
            this.initLoopToggle();
        }, 200); // Increased delay to ensure DOM is ready
    }
    refreshTimelineItems() {
        this.timelineItems = document.querySelectorAll('.timeline-dot');
        // Force remove active class from all items first
        this.timelineItems.forEach(item => {
            item.classList.remove('active');
        });
        // Reattach event listeners to new timeline items
        this.setupTimelineItemListeners();
        // Set up year label listeners after timeline is built
        this.setupYearLabelListeners();
        // Update navigation button states (but don't re-setup listeners)
        this.updateNavigationButtons();
    }
    setupScrollableBody() {
        // Only enable scrolling if loading is complete
        if (!document.querySelector('.loading') || document.querySelector('.loading').style.display === 'none') {
            document.body.style.overflow = 'auto';
            // Adjust scroll height based on number of games
            const totalGames = this.timelineItems.length;
            document.body.style.height = `${(totalGames * 100) + 100}vh`;
        }
    }
    enableScrolling() {
        document.body.style.overflow = 'auto';
        // Adjust scroll height based on number of games
        const totalGames = this.timelineItems.length;
        document.body.style.height = `${(totalGames * 100) + 100}vh`;
    }
    enableAutoTransition() {
        this.autoTransitionEnabled = true;
        // Update the loop toggle visual state to reflect the enabled state
        this.updateLoopToggleState();
        // Start the auto-transition timer now that it's enabled
        this.startAutoTransitionTimer();
    }
    setupEventListeners() {
        // Scroll event listener
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
        // Wheel event listener for smooth navigation-like scrolling
        window.addEventListener('wheel', (e) => {
            this.handleWheelNavigation(e);
        }, { passive: false });
        // Touch event listeners for swipe navigation on mobile
        window.addEventListener('touchstart', (e) => {
            this.handleTouchStart(e);
        }, { passive: true });
        window.addEventListener('touchend', (e) => {
            this.handleTouchEnd(e);
        }, { passive: true });
        // Resize event listener to check collision when window resizes
        window.addEventListener('resize', () => {
            // Remove the duplicate collision detection - handled by SoundToggleManager
        });
        // Set up timeline item listeners
        this.setupTimelineItemListeners();
        // Click event listeners for year labels
        this.setupYearLabelListeners();
        // Navigation button listeners
        this.setupNavigationListeners();
    }
    setupTimelineItemListeners() {
        // Click event listeners for timeline items (dots)
        this.timelineItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                // Don't allow clicking on already active dots
                if (!item.classList.contains('active')) {
                    this.handleItemClick(index);
                }
            });
        });
    }
    setupYearLabelListeners() {
        const yearLabels = document.querySelectorAll('.timeline-year-label');
        yearLabels.forEach((label, index) => {
            // Skip the first year label (index 0) - make it non-clickable
            if (index !== 0) {
                label.addEventListener('click', () => {
                    // Don't allow clicking on already active years
                    if (!label.classList.contains('active')) {
                        this.handleYearLabelClick(label.textContent);
                    }
                });
            }
        });
    }
    handleYearLabelClick(year) {
        // Reset auto-transition timer since user is actively clicking
        this.resetAutoTransitionTimer();
        // Find the first dot for this year
        const firstDotForYear = this.findFirstDotForYear(year);
        if (firstDotForYear !== -1) {
            this.handleItemClick(firstDotForYear);
        }
    }
    findFirstDotForYear(year) {
        // Find the first timeline dot that matches this year
        for (let i = 0; i < this.timelineItems.length; i++) {
            const dot = this.timelineItems[i];
            if (dot.getAttribute('data-year') === year) {
                return i;
            }
        }
        return -1; // Year not found
    }
    fadeOutCurrentContent(callback) {
        // Simple immediate callback - no blur animations
        callback();
    }
    animateClickTransition(callback) {
        const backgroundText = document.getElementById('backgroundText');
        const videoBackground = document.getElementById('video-background');
        let progress = 0;
        const duration = 300; // 300ms for smooth transition
        const startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            progress = Math.min(elapsed / duration, 1);
            // Apply progressive blur and fade similar to scroll effect
            this.applyClickTransitionEffect(progress);
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Transition complete, execute callback
                callback();
            }
        };
        // Start the animation
        requestAnimationFrame(animate);
    }
    applyClickTransitionEffect(progress) {
        const backgroundText = document.getElementById('backgroundText');
        const videoBackground = document.getElementById('video-background');
        const infoPanel = document.getElementById('infoPanel');
        // Use easing function for smoother transition
        const easedProgress = this.easeOutQuad(progress);
        // Calculate motion blur and opacity similar to scroll effect
        const motionBlur = easedProgress * 4; // Slightly more blur for click effect
        const textOpacity = 1 - (easedProgress * 1.0); // Complete fade to 0 opacity
        if (backgroundText) {
            backgroundText.style.filter = `blur(${motionBlur}px)`;
            backgroundText.style.opacity = `${textOpacity}`;
            const title = backgroundText.querySelector('.background-title');
            const description = backgroundText.querySelector('.background-description');
            if (title) {
                title.style.filter = `blur(${motionBlur * 0.8}px)`;
            }
            if (description) {
                description.style.filter = `blur(${motionBlur * 0.6}px)`;
            }
        }
        // Apply same effects to info panel
        if (infoPanel) {
            infoPanel.style.filter = `blur(${motionBlur}px)`;
            infoPanel.style.opacity = `${textOpacity}`;
        }
        // Apply video effects similar to scroll
        if (videoBackground) {
            const videoZoomScale = 1 + (easedProgress * 0.08); // Slightly more zoom for click
            const videoOpacity = 1 - (easedProgress * 0.3); // Partial fade for video
            videoBackground.style.transform = `scale(${videoZoomScale})`;
            videoBackground.style.opacity = `${videoOpacity}`;
            const iframe = videoBackground.querySelector('iframe');
            if (iframe) {
                const videoIframeZoomScale = 1.15 + (easedProgress * 0.08);
                iframe.style.transform = `scale(${videoIframeZoomScale})`;
                iframe.style.filter = `blur(${0.5 + (easedProgress * 0.5)}px) saturate(${0.9 + (easedProgress * 0.3)}) brightness(${0.8 + (easedProgress * 0.3)})`;
            }
        }
    }
    setInitialActiveItem() {
        if (this.timelineItems.length === 0) {
            console.warn('No timeline items found');
            return;
        }
        // Remove any existing active classes
        this.timelineItems.forEach(item => {
            item.classList.remove('active');
        });
        // Set the first item as active
        this.timelineItems[this.currentItemIndex].classList.add('active');
        this.updateYearLabels();
        this.updateNavigationButtons();
    }
    updateYearLabels() {
        // Remove active class from all year labels
        const yearLabels = document.querySelectorAll('.timeline-year-label');
        yearLabels.forEach(label => label.classList.remove('active'));
        // Find the active dot and get its year
        const activeDot = document.querySelector('.timeline-dot.active');
        if (activeDot) {
            const activeYear = activeDot.getAttribute('data-year');
            // Find and activate the corresponding year label
            yearLabels.forEach(label => {
                if (label.textContent === activeYear) {
                    label.classList.add('active');
                }
            });
        }
    }
    handleScroll() {
        if (this.timelineItems.length === 0) return;
        // Don't handle scroll during auto-transitions to prevent content swapping
        if (this.isAutoTransitioning) {
            return;
        }
        // Don't handle scroll during navigation to prevent interference
        if (this.isClickScrolling) {
            return;
        }
        // Reset auto-transition timer since user is scrolling
        this.resetAutoTransitionTimer();
        const scrollPercentage = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        const newItemIndex = Math.floor(scrollPercentage * this.timelineItems.length);
        const clampedIndex = Math.max(0, Math.min(newItemIndex, this.timelineItems.length - 1));
        // Determine scroll direction for better transition handling
        const scrollDirection = window.scrollY > this.lastScrollY ? 'down' : 'up';
        if (clampedIndex !== this.currentItemIndex) {
            // Item changed - update immediately without blur effects
            this.timelineItems[this.currentItemIndex].classList.remove('active');
            this.timelineItems[clampedIndex].classList.add('active');
            this.currentItemIndex = clampedIndex;
            this.updateYearLabels();
            this.updateNavigationButtons();
            this.scrollTimelineToActiveItem(clampedIndex);
            this.updateItemContent(clampedIndex);
        }
    }
    handleItemClick(index) {
        if (this.timelineItems.length === 0) return;
        // Reset auto-transition timer since user is actively clicking
        this.resetAutoTransitionTimer();
        // Create black overlay immediately to cover any flash
        this.createClickOverlay();
        this.timelineItems.forEach(item => item.classList.remove('active'));
        this.timelineItems[index].classList.add('active');
        this.currentItemIndex = index;
        this.updateYearLabels();
        this.updateNavigationButtons();
        // Set flag to prevent blur effects during click scroll
        this.isClickScrolling = true;
        // Immediately update content and scroll without transition animation
        this.scrollTimelineToActiveItem(index);
        this.updateItemContent(index, true); // Pass true for instant transition
        const scrollPosition = (index / (this.timelineItems.length - 1)) * (document.body.scrollHeight - window.innerHeight);
        window.scrollTo({
            top: scrollPosition,
            behavior: 'instant'
        });
        // Remove overlay after content has loaded
        setTimeout(() => {
            this.removeClickOverlay();
        }, 400);
        // Clear the click scrolling flag after instant scroll
        setTimeout(() => {
            this.isClickScrolling = false;
        }, 100); // Much shorter delay since scroll is instant
    }
    createClickOverlay() {
        // Remove existing overlay if it exists
        this.removeClickOverlay();
        const overlay = document.createElement('div');
        overlay.id = 'click-transition-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: #000;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.1s ease;
            pointer-events: none;
        `;
        document.body.appendChild(overlay);
        // Fade in the overlay immediately
        setTimeout(() => {
            overlay.style.opacity = '0.8';
        }, 5);
    }
    removeClickOverlay() {
        const overlay = document.getElementById('click-transition-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 100);
        }
    }
    scrollTimelineToActiveItem(activeIndex) {
        const timelineContent = document.querySelector('.timeline-content');
        const activeItem = this.timelineItems[activeIndex];
        if (timelineContent && activeItem) {
            const timelineRect = timelineContent.getBoundingClientRect();
            const activeItemRect = activeItem.getBoundingClientRect();
            const activeItemPosition = activeItemRect.left - timelineRect.left + timelineContent.scrollLeft;
            const timelineWidth = timelineContent.clientWidth;
            const activeItemWidth = activeItemRect.width;
            const desiredScrollPosition = activeItemPosition - (timelineWidth / 2) + (activeItemWidth / 2);
            timelineContent.scrollTo({
                left: desiredScrollPosition,
                behavior: 'smooth'
            });
        }
    }
    initialScrollToActiveItem() {
        setTimeout(() => {
            this.scrollTimelineToActiveItem(this.currentItemIndex);
            this.updateItemContent(this.currentItemIndex);
        }, 100);
    }
    setupAutoTransition() {
        // Set up activity detection (always active)
        this.setupActivityDetection();
        // Only start auto-transition timer if enabled
        if (this.autoTransitionEnabled) {
            this.startAutoTransitionTimer();
        }
    }
    setupActivityDetection() {
        // Track mouse movement, scrolling, and clicks
        const activityEvents = ['mousemove', 'scroll', 'click', 'keydown', 'touchstart', 'touchmove'];
        activityEvents.forEach(eventType => {
            document.addEventListener(eventType, () => {
                this.handleUserActivity();
            }, { passive: true });
        });
    }
    handleUserActivity() {
        // Don't reset timer if we're in the middle of an auto-transition
        if (this.isAutoTransitioning) {
            return;
        }
        this.lastUserActivity = Date.now();
        this.resetAutoTransitionTimer();
    }
    startAutoTransitionTimer() {
        if (!this.autoTransitionEnabled) {
            return;
        }
        // Clear any existing timer
        if (this.autoTransitionTimer) {
            clearTimeout(this.autoTransitionTimer);
        }
        this.autoTransitionTimer = setTimeout(() => {
            this.performAutoTransition();
        }, this.autoTransitionDelay);
    }
    resetAutoTransitionTimer() {
        // Clear existing timer and start a new one
        if (this.autoTransitionTimer) {
            clearTimeout(this.autoTransitionTimer);
        }
        this.startAutoTransitionTimer();
    }
    performAutoTransition() {
        // Don't auto-transition if user was recently active
        const timeSinceActivity = Date.now() - this.lastUserActivity;
        if (timeSinceActivity < this.autoTransitionDelay) {
            this.startAutoTransitionTimer();
            return;
        }
        // Don't auto-transition if info panel is visible
        const infoPanel = document.getElementById('infoPanel');
        if (infoPanel && infoPanel.classList.contains('visible')) {
            this.startAutoTransitionTimer(); // Check again later
            return;
        }
        // Set auto-transition flag
        this.isAutoTransitioning = true;
        // Check if we're at the last item of the current category
        const isAtLastItem = this.currentItemIndex + 1 >= this.timelineItems.length;
        if (isAtLastItem) {
            // We're at the last item - switch to next category
            this.switchToNextCategory();
        } else {
            // Normal transition within current category - use transitionToItem directly
            const nextIndex = this.currentItemIndex + 1;
            this.transitionToItem(nextIndex, true);
            // Reset auto-transition flag and restart timer after transition
            // Extended delay to ensure smooth scroll completes
            setTimeout(() => {
                this.isAutoTransitioning = false;
                this.lastUserActivity = Date.now();
                this.startAutoTransitionTimer();
            }, 1200); // 1.2 seconds to ensure scroll animation completes
        }
    }
    transitionToItem(index, isAutoTransition = false) {
        if (this.timelineItems.length === 0) return;
        // Set flag to prevent scroll effects during auto-transition
        if (isAutoTransition) {
            this.isClickScrolling = true; // Reuse this flag to prevent scroll effects
        }
        // Create overlay for smooth transition
        if (isAutoTransition) {
            this.createAutoTransitionOverlay();
        }
        // Update active states
        this.timelineItems.forEach(item => item.classList.remove('active'));
        this.timelineItems[index].classList.add('active');
        this.currentItemIndex = index;
        this.updateYearLabels();
        this.updateNavigationButtons();
        // Update content and scroll
        this.scrollTimelineToActiveItem(index);
        this.updateItemContent(index, isAutoTransition);
        // Smooth scroll to the new position
        const scrollPosition = (index / (this.timelineItems.length - 1)) * 
            (document.body.scrollHeight - window.innerHeight);
        window.scrollTo({
            top: scrollPosition,
            behavior: isAutoTransition ? 'smooth' : 'instant'
        });
        // For auto-transitions, clear the scroll flag and ensure clean state after transition
        if (isAutoTransition) {
            setTimeout(() => {
                this.isClickScrolling = false;
                this.removeAutoTransitionOverlay();
            }, 1000); // Wait for scroll animation to complete
        }
    }
    createAutoTransitionOverlay() {
        // Remove existing overlay if it exists
        this.removeAutoTransitionOverlay();
        const overlay = document.createElement('div');
        overlay.id = 'auto-transition-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(45deg, rgba(0,0,0,0.3), rgba(0,0,0,0.1));
            z-index: 9998;
            opacity: 0;
            transition: opacity 0.4s ease;
            pointer-events: none;
        `;
        document.body.appendChild(overlay);
        // Fade in the overlay
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 50);
    }
    removeAutoTransitionOverlay() {
        const overlay = document.getElementById('auto-transition-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 400);
        }
    }
    updateItemContent(itemIndex, isInstant = false) {
        const activeItem = this.timelineItems[itemIndex];
        if (activeItem) {
            // For auto-transitions, add a slight delay to ensure smooth transition
            const delay = isInstant ? 0 : 100;
            // Update background text with the game data
            setTimeout(() => {
                const gameData = {
                    title: activeItem.dataset.title,
                    description: activeItem.dataset.description,
                    company: activeItem.dataset.company,
                    role: activeItem.dataset.role,
                    trailerUrl: activeItem.dataset.trailerUrl,
                    videoStart: activeItem.dataset.videoStart,
                    videoEnd: activeItem.dataset.videoEnd,
                    zoomVideo: activeItem.dataset.zoomVideo === 'true',
                    buttonLabel: activeItem.dataset.buttonLabel,
                    buttonURL: activeItem.dataset.buttonURL,
                    infoPanelHeader: activeItem.dataset.infoPanelHeader,
                    infoPanelData: activeItem.dataset.infoPanelData
                };
                if (window.contentManager) {
                    // Create a temporary card element to use existing showBackgroundText method
                    const tempCard = document.createElement('div');
                    tempCard.dataset.title = gameData.title;
                    tempCard.dataset.description = gameData.description;
                    tempCard.dataset.company = gameData.company;
                    tempCard.dataset.role = gameData.role;
                    tempCard.dataset.trailerUrl = gameData.trailerUrl;
                    tempCard.dataset.videoStart = gameData.videoStart;
                    tempCard.dataset.videoEnd = gameData.videoEnd;
                    tempCard.dataset.zoomVideo = gameData.zoomVideo;
                    tempCard.dataset.buttonLabel = gameData.buttonLabel;
                    tempCard.dataset.buttonURL = gameData.buttonURL;
                    tempCard.dataset.infoPanelHeader = gameData.infoPanelHeader;
                    tempCard.dataset.infoPanelData = gameData.infoPanelData;
                    window.contentManager.showBackgroundText(tempCard, isInstant);
                }
            }, delay);
        }
        // Hide content panel since cards are not visible
        const contentPanel = document.getElementById('contentPanel');
        if (contentPanel) {
            contentPanel.classList.remove('visible');
            contentPanel.style.display = 'none';
        }
    }
    // Methods to pause and resume auto-transition
    pauseAutoTransition() {
        if (this.autoTransitionTimer) {
            clearTimeout(this.autoTransitionTimer);
            this.autoTransitionTimer = null;
        }
    }
    resumeAutoTransition() {
        if (this.autoTransitionEnabled && !this.autoTransitionTimer) {
            this.startAutoTransitionTimer();
        }
    }
    // Method to check if auto-transition is active
    isAutoTransitionActive() {
        return this.autoTransitionTimer !== null;
    }
    refreshForNewCategory() {
        // Reset current state
        this.currentItemIndex = 0;
        // Clear any existing timers
        if (this.autoTransitionTimer) {
            clearTimeout(this.autoTransitionTimer);
            this.autoTransitionTimer = null;
        }
        if (this.wheelDebounceTimer) {
            clearTimeout(this.wheelDebounceTimer);
            this.wheelDebounceTimer = null;
        }
        // Refresh timeline items with new data
        this.refreshTimelineItems();
        // Re-setup navigation listeners for new category with small delay to ensure DOM is ready
        setTimeout(() => {
            this.setupNavigationListeners();
        }, 50);
        // Update scroll body height for new number of items
        this.updateScrollBodyHeight();
        // Reset scroll position and active item
        this.resetToFirstItem();
        // Restart auto-transition
        this.setupAutoTransition();
        // Update loop toggle state to maintain consistency across category switches
        this.updateLoopToggleState();
    }
    updateScrollBodyHeight() {
        // Update scroll height based on number of timeline items
        const totalItems = this.timelineItems.length;
        document.body.style.height = `${(totalItems * 100) + 100}vh`;
    }
    resetToFirstItem() {
        // Reset scroll position to top
        window.scrollTo({ top: 0, behavior: 'instant' });
        // Set first item as active
        this.setInitialActiveItem();
        // Update content immediately
        this.updateItemContent(0, true);
        // Update timeline scroll position
        this.scrollTimelineToActiveItem(0);
    }
    switchToNextCategory() {
        // Get current active filter
        const currentFilter = window.portfolioData.filters.find(f => f.active);
        if (!currentFilter) return;
        // Define the cycle order: Games -> Apps -> Music -> Games
        const cycleOrder = ['games', 'apps', 'music'];
        const currentIndex = cycleOrder.indexOf(currentFilter.id);
        // Calculate next category index (loop back to 0 if at end)
        const nextIndex = (currentIndex + 1) % cycleOrder.length;
        const nextCategoryId = cycleOrder[nextIndex];
        // Switch to the next category
        if (window.contentManager) {
            window.contentManager.switchToCategory(nextCategoryId);
        }
        // Reset auto-transition flag and restart timer after category switch
        // Extended delay to ensure category switch completes
        setTimeout(() => {
            this.isAutoTransitioning = false;
            this.lastUserActivity = Date.now();
            this.startAutoTransitionTimer();
        }, 1500); // 1.5 seconds to ensure category switch completes
    }
    // Timeline Navigation Methods
    navigateNext() {
        if (this.currentItemIndex < this.timelineItems.length - 1) {
            // Reset auto-transition timer since user is actively navigating
            this.resetAutoTransitionTimer();
            const nextIndex = this.currentItemIndex + 1;
            this.handleNavigationClick(nextIndex);
        }
        // User navigation stops at category boundaries - no category switching
    }
    navigatePrevious() {
        if (this.currentItemIndex > 0) {
            // Reset auto-transition timer since user is actively navigating
            this.resetAutoTransitionTimer();
            const prevIndex = this.currentItemIndex - 1;
            this.handleNavigationClick(prevIndex);
        }
        // User navigation stops at category boundaries - no category switching
    }
    
    switchToNextCategory() {
        const filters = window.portfolioData.filters;
        const currentActiveIndex = filters.findIndex(filter => filter.active);
        const nextIndex = (currentActiveIndex + 1) % filters.length;
        
        if (nextIndex !== currentActiveIndex) {
            this.switchToCategory(filters[nextIndex].id);
        }
    }
    
    switchToPreviousCategory() {
        const filters = window.portfolioData.filters;
        const currentActiveIndex = filters.findIndex(filter => filter.active);
        const prevIndex = (currentActiveIndex - 1 + filters.length) % filters.length;
        
        if (prevIndex !== currentActiveIndex) {
            this.switchToCategory(filters[prevIndex].id);
        }
    }
    
    switchToCategory(filterId) {
        // Use the content manager to handle category switching
        if (window.contentManager) {
            window.contentManager.switchToCategory(filterId);
        }
    }
    // Special handler for navigation button clicks (no black overlay)
    handleNavigationClick(index) {
        if (this.timelineItems.length === 0) {
            return;
        }
        if (index === this.currentItemIndex) {
            return;
        }
        // Reset auto-transition timer since user is actively navigating
        this.resetAutoTransitionTimer();
        // Update active states immediately
        this.timelineItems.forEach(item => item.classList.remove('active'));
        this.timelineItems[index].classList.add('active');
        const oldIndex = this.currentItemIndex;
        this.currentItemIndex = index;
        this.updateYearLabels();
        this.updateNavigationButtons();
        // Set flag to prevent blur effects during navigation
        this.isClickScrolling = true;
        // Update content immediately without any overlays
        this.updateItemContent(index, true);
        this.scrollTimelineToActiveItem(index);
        const scrollPosition = (index / (this.timelineItems.length - 1)) * (document.body.scrollHeight - window.innerHeight);
        window.scrollTo({
            top: scrollPosition,
            behavior: 'instant'
        });
        // Clear the click scrolling flag after instant scroll
        setTimeout(() => {
            this.isClickScrolling = false;
        }, 200); // Increased delay to ensure scroll events settle
    }
    updateNavigationButtons() {
        const prevBtn = document.querySelector('.timeline-nav-btn.prev');
        const nextBtn = document.querySelector('.timeline-nav-btn.next');
        if (prevBtn) {
            if (this.currentItemIndex <= 0) {
                prevBtn.classList.add('disabled');
            } else {
                prevBtn.classList.remove('disabled');
            }
        }
        if (nextBtn) {
            if (this.currentItemIndex >= this.timelineItems.length - 1) {
                nextBtn.classList.add('disabled');
            } else {
                nextBtn.classList.remove('disabled');
            }
        }
    }
    setupNavigationListeners() {
        const prevBtn = document.querySelector('.timeline-nav-btn.prev');
        const nextBtn = document.querySelector('.timeline-nav-btn.next');
        // Remove existing listeners to prevent duplicates
        if (prevBtn) {
            // Clone the button to remove all event listeners
            const newPrevBtn = prevBtn.cloneNode(true);
            prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
            // Add single event listener
            newPrevBtn.addEventListener('click', () => {
                this.navigatePrevious();
            });
        }
        if (nextBtn) {
            // Clone the button to remove all event listeners  
            const newNextBtn = nextBtn.cloneNode(true);
            nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
            // Add single event listener
            newNextBtn.addEventListener('click', () => {
                this.navigateNext();
            });
        }
        // Add keyboard navigation only once
        if (!this.keyboardListenerAdded) {
            document.addEventListener('keydown', (e) => {
                // Only handle navigation if no input field is focused
                if (document.activeElement.tagName === 'INPUT' || 
                    document.activeElement.tagName === 'TEXTAREA') {
                    return;
                }
                switch(e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.navigatePrevious();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.navigateNext();
                        break;
                }
            });
            this.keyboardListenerAdded = true;
        }
    }
    
    // Loop Toggle Methods
    initLoopToggle() {
        const loopToggle = document.getElementById('loop-toggle');
        if (loopToggle) {
            // Set initial state based on autoTransitionEnabled
            this.updateLoopToggleState();
            // Add click event listener
            loopToggle.addEventListener('click', () => {
                this.toggleAutoTransition();
            });
        }
    }
    
    toggleAutoTransition() {
        this.autoTransitionEnabled = !this.autoTransitionEnabled;
        this.updateLoopToggleState();
        
        if (this.autoTransitionEnabled) {
            // Resume auto-transition
            this.resumeAutoTransition();
        } else {
            // Pause auto-transition
            this.pauseAutoTransition();
        }
    }
    
    updateLoopToggleState() {
        const loopToggle = document.getElementById('loop-toggle');
        if (loopToggle) {
            if (this.autoTransitionEnabled) {
                loopToggle.classList.add('enabled');
                loopToggle.classList.remove('disabled');
            } else {
                loopToggle.classList.remove('enabled');
                loopToggle.classList.add('disabled');
            }
        }
    }
    
    // Wheel Navigation Handler - mimics keyboard/button navigation
    handleWheelNavigation(e) {
        // Only handle if we're not already in a transition
        if (this.isClickScrolling || this.isAutoTransitioning) {
            return;
        }
        
        // Prevent default scroll behavior
        e.preventDefault();
        
        // Debounce wheel events to prevent rapid firing
        if (this.wheelDebounceTimer) {
            clearTimeout(this.wheelDebounceTimer);
        }
        
        this.wheelDebounceTimer = setTimeout(() => {
            // Determine scroll direction
            const isScrollingDown = e.deltaY > 0;
            
            if (isScrollingDown) {
                // Scroll down - go to next item
                this.navigateNext();
            } else {
                // Scroll up - go to previous item
                this.navigatePrevious();
            }
        }, 50); // 50ms debounce to prevent rapid transitions
    }

    // Touch Navigation Handlers - for mobile swipe navigation
    handleTouchStart(e) {
        // Only handle if we're not already in a transition
        if (this.isClickScrolling || this.isAutoTransitioning) {
            return;
        }
        
        // Store the initial touch position
        const touch = e.touches[0];
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
    }
    
    handleTouchEnd(e) {
        // Only handle if we're not already in a transition
        if (this.isClickScrolling || this.isAutoTransitioning) {
            return;
        }
        
        // Get the final touch position
        const touch = e.changedTouches[0];
        this.touchEndX = touch.clientX;
        this.touchEndY = touch.clientY;
        
        // Process the swipe
        this.handleSwipeGesture();
    }
    
    handleSwipeGesture() {
        const deltaX = this.touchEndX - this.touchStartX;
        const deltaY = this.touchEndY - this.touchStartY;
        
        // Calculate distances
        const horizontalDistance = Math.abs(deltaX);
        const verticalDistance = Math.abs(deltaY);
        
        // Check if this is a valid horizontal swipe
        if (horizontalDistance >= this.minSwipeDistance && 
            verticalDistance <= this.maxVerticalSwipe &&
            horizontalDistance > verticalDistance) {
            
            // Determine swipe direction and navigate
            if (deltaX > 0) {
                // Swipe right - go to previous item
                this.navigatePrevious();
            } else {
                // Swipe left - go to next item
                this.navigateNext();
            }
        }
    }

}
// Export for use in other modules
window.TimelineManager = TimelineManager;
