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
            const routeInfo = this.parseCurrentURL();
            this.navigateToRoute(routeInfo, false); // false = don't update URL again
        });
    }

    // Parse current URL to extract category and project
    parseCurrentURL() {
        const hash = window.location.hash.slice(1); // Remove #
        const parts = hash.split('/');
        
        const category = parts[0] || this.defaultCategory;
        const projectSlug = parts[1] || null;
        
        return {
            category: this.validCategories.includes(category) ? category : this.defaultCategory,
            projectSlug
        };
    }

    // Get category from current URL hash (backward compatibility)
    getCategoryFromURL() {
        return this.parseCurrentURL().category;
    }

    // Update URL with category and optional project
    updateURL(category, projectSlug = null) {
        if (this.validCategories.includes(category)) {
            let newURL = `${window.location.pathname}#${category}`;
            if (projectSlug) {
                newURL += `/${projectSlug}`;
            }
            window.history.pushState({ category, projectSlug }, '', newURL);
        }
    }

    // Navigate to a route with category and optional project
    navigateToRoute(routeInfo, updateURL = true) {
        const { category, projectSlug } = routeInfo;
        
        // Update URL if requested
        if (updateURL) {
            this.updateURL(category, projectSlug);
        }

        // Switch to the category using the content manager
        if (window.contentManager) {
            window.contentManager.switchToCategory(category);
            
            // If project slug is provided, navigate to that project after category switch
            if (projectSlug) {
                setTimeout(() => {
                    this.navigateToProject(projectSlug);
                }, 200); // Small delay to ensure category switch completes
            }
        }
    }

    // Navigate to a category (with or without URL update) - backward compatibility
    navigateToCategory(category, updateURL = true) {
        this.navigateToRoute({ category, projectSlug: null }, updateURL);
    }

    // Navigate to a specific project within current category
    navigateToProject(projectSlug) {
        if (window.timelineManager) {
            window.timelineManager.navigateToProjectBySlug(projectSlug);
        }
    }

    // Navigate to a specific project with category
    navigateToProjectInCategory(category, projectSlug, updateURL = true) {
        this.navigateToRoute({ category, projectSlug }, updateURL);
    }

    // Get the initial category from URL on page load
    getInitialCategory() {
        return this.parseCurrentURL().category;
    }

    // Get the initial route info from URL on page load
    getInitialRoute() {
        return this.parseCurrentURL();
    }

    // Replace current URL without adding to history (useful for initial load)
    replaceURL(category, projectSlug = null) {
        if (this.validCategories.includes(category)) {
            let newURL = `${window.location.pathname}#${category}`;
            if (projectSlug) {
                newURL += `/${projectSlug}`;
            }
            window.history.replaceState({ category, projectSlug }, '', newURL);
        }
    }
}

// Make URLRouter available globally
window.URLRouter = URLRouter;
