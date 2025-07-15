// Main Application Controller
class App {
    constructor() {
        this.data = window.portfolioData;
        this.uiBuilder = null;
        this.timelineManager = null;
        this.customScrollbar = null;
        this.contentManager = null;
        this.soundToggleManager = null;
        this.loopToggleManager = null;
        this.init();
    }
    init() {
        // Initialize URL router first
        this.urlRouter = new URLRouter();
        window.urlRouter = this.urlRouter;
        
        // Get initial route from URL (category/section and optional project)
        const initialRoute = this.urlRouter.getInitialRoute();
        
        // Set the initial category in the data before building UI (only for category routes)
        if (initialRoute.type === 'category' && window.portfolioData && window.portfolioData.setActiveFilter) {
            window.portfolioData.setActiveFilter(initialRoute.category);
        }
        
        // Build UI dynamically from data
        this.uiBuilder = new UIBuilder(this.data);
        // Disable scrolling during loading
        document.body.style.overflow = 'hidden';
        document.body.style.height = 'auto';
        
        // Initialize fancy intro effects
        this.fancyIntroEffects = new FancyIntroEffects();
        
        // Animate loading progress
        this.handleLoadingSequence();
        // Initialize video background
        this.videoBackground = new VideoBackground();
        // Initialize timeline manager
        this.timelineManager = new TimelineManager();
        // Make timeline manager available globally
        window.timelineManager = this.timelineManager;
        // Initialize custom scrollbar
        this.customScrollbar = new CustomScrollbar();
        // Initialize content manager
        this.contentManager = new ContentManager();
        // Initialize sound toggle manager
        this.soundToggleManager = new SoundToggleManager();
        // Initialize loop toggle manager
        this.loopToggleManager = new LoopToggleManager();
        // Make content manager available globally for timeline manager
        window.contentManager = this.contentManager;
        // Make app instance available globally for content manager
        window.app = this;
        
        // Update URL to reflect initial route (use replace to not add to history)
        // Add delay to ensure all components are initialized
        setTimeout(() => {
            if (initialRoute.type === 'section') {
                this.urlRouter.replaceSectionURL(initialRoute.section);
                // Navigate to the section after all components are loaded
                setTimeout(() => {
                    this.urlRouter.navigateToSection(initialRoute.section);
                }, 300);
            } else {
                this.urlRouter.replaceURL(initialRoute.category, initialRoute.projectSlug);
                
                // If there's a project slug, navigate to it after initialization
                if (initialRoute.projectSlug) {
                    setTimeout(() => {
                        this.urlRouter.navigateToProject(initialRoute.projectSlug);
                    }, 300);
                }
            }
        }, 100);
        
        // Flag to track if initialization is complete
        this.initializationComplete = false;
        this.nameAnimationComplete = false;
        this.userInteractionReceived = false;
    }
    handleLoadingSequence() {
        const loadingElement = document.querySelector('.loading');
        const progressBar = document.querySelector('.loading-bar');
        const loadingText = document.querySelector('.loading-text');
        const tapToContinue = document.querySelector('.tap-to-continue');
        
        // Simulate loading progress
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 15 + 5; // Random progress between 5-20%
            if (progress > 100) progress = 100;
            progressBar.style.width = progress + '%';
            
            if (progress >= 100) {
                clearInterval(progressInterval);
                // Mark initialization as complete
                this.initializationComplete = true;
                
                // Update loading text to show completion
                loadingText.textContent = 'initialization complete';
                
                // Check if we can proceed automatically
                this.checkAutoLoadConditions();
            }
        }, 100);
    }
    
    // Check if both name animation and initialization are complete
    checkAutoLoadConditions() {
        if (this.initializationComplete && this.nameAnimationComplete) {
            // Both conditions met, automatically proceed to main experience
            setTimeout(() => {
                this.proceedToMainExperience();
            }, 300); // Brief delay to let user see "initialization complete"
        }
    }
    
    // Method to be called when name animation completes
    onNameAnimationComplete() {
        this.nameAnimationComplete = true;
        this.checkAutoLoadConditions();
    }
    
    // Proceed to main experience without user interaction
    proceedToMainExperience() {
        const loadingElement = document.querySelector('.loading');
        
        // Hide loading screen and start main content
        loadingElement.style.opacity = '0';
        setTimeout(() => {
            loadingElement.style.display = 'none';
            this.onLoadingComplete();
        }, 500);
    }
    
    onLoadingComplete() {
        // Clean up fancy intro effects
        if (this.fancyIntroEffects) {
            this.fancyIntroEffects.destroy();
            this.fancyIntroEffects = null;
        }
        
        // Re-enable scrolling after loading is complete
        document.body.style.overflow = 'auto';
        document.body.style.height = '500vh';
        // Update timeline manager to enable scrolling
        if (this.timelineManager) {
            this.timelineManager.enableScrolling();
        }
        // Notify custom scrollbar that loading is complete
        if (this.customScrollbar) {
            this.customScrollbar.setLoadingComplete();
        }
        // Show header filters
        const headerFilters = document.querySelector('.header-filters');
        if (headerFilters) {
            headerFilters.classList.add('visible');
        }
        // Show content panel with delay
        setTimeout(() => {
            if (this.contentManager) {
                this.contentManager.showContentPanel();
                // Refresh card references after UI is fully built
                this.contentManager.refreshCardReferences();
            }
        }, 1000);
    }
    // Method to update data and rebuild UI
    updateData(newData) {
        this.data = { ...this.data, ...newData };
        this.uiBuilder = new UIBuilder(this.data);
        // Reinitialize managers with new data
        this.timelineManager = new TimelineManager();
        this.contentManager = new ContentManager();
    }
    // Method to add new content to a specific year
    addContent(year, content) {
        const yearData = this.data.timeline.find(item => item.year === year);
        if (yearData) {
            yearData.content.push(content);
            this.updateData(this.data);
        }
    }
    // Method to update personal information
    updatePersonalInfo(info) {
        this.data.personal = { ...this.data.personal, ...info };
        this.uiBuilder.buildHeader();
    }
}
// Export for use in other modules
window.App = App;
