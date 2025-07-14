// URL Router Utility
class URLRouter {
    constructor() {
        this.validCategories = ['games', 'apps', 'music', 'press'];
        this.defaultCategory = 'games';
        this.init();
    }

    init() {
        // Listen for browser back/forward navigation
        window.addEventListener('popstate', (event) => {
            const category = this.getCategoryFromURL();
            this.navigateToCategory(category, false); // false = don't update URL again
        });
    }

    // Get category from current URL hash
    getCategoryFromURL() {
        const hash = window.location.hash.slice(1); // Remove #
        
        // Check if the hash is a valid category
        if (this.validCategories.includes(hash)) {
            return hash;
        }
        
        // Return default category if invalid or empty
        return this.defaultCategory;
    }

    // Update URL with new category
    updateURL(category) {
        if (this.validCategories.includes(category)) {
            const newURL = `${window.location.pathname}#${category}`;
            window.history.pushState({ category }, '', newURL);
        }
    }

    // Navigate to a category (with or without URL update)
    navigateToCategory(category, updateURL = true) {
        if (!this.validCategories.includes(category)) {
            category = this.defaultCategory;
        }

        // Update URL if requested
        if (updateURL) {
            this.updateURL(category);
        }

        // Switch to the category using the content manager
        if (window.contentManager) {
            window.contentManager.switchToCategory(category);
        }
    }

    // Get the initial category from URL on page load
    getInitialCategory() {
        return this.getCategoryFromURL();
    }

    // Replace current URL without adding to history (useful for initial load)
    replaceURL(category) {
        if (this.validCategories.includes(category)) {
            const newURL = `${window.location.pathname}#${category}`;
            window.history.replaceState({ category }, '', newURL);
        }
    }
}

// Make URLRouter available globally
window.URLRouter = URLRouter;
