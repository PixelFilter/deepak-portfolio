// URL Router Utility
class URLRouter {
    constructor() {
        this.validCategories = ['games', 'apps', 'music', 'press'];
        this.validSections = ['about', 'resume', 'connect'];
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

    // Parse current URL to extract category, section, or project
    parseCurrentURL() {
        const hash = window.location.hash.slice(1); // Remove #
        const parts = hash.split('/').filter(Boolean);

        // If hash is empty, use default category
        if (parts.length === 0) {
            return {
                type: 'category',
                category: this.defaultCategory,
                projectSlug: null,
                section: null
            };
        }

        const firstPart = parts[0];
        const secondPart = parts[1] || null;

        // Check if first part is a valid section (about, resume, connect)
        if (this.validSections.includes(firstPart)) {
            return {
                type: 'section',
                section: firstPart,
                category: null,
                projectSlug: null
            };
        }

        // Otherwise, treat as category/project navigation
        const category = this.validCategories.includes(firstPart) ? firstPart : this.defaultCategory;
        const projectSlug = secondPart && secondPart.length > 0 ? secondPart : null;

        return {
            type: 'category',
            category,
            projectSlug,
            section: null
        };
    }

    // Get category from current URL hash (backward compatibility)
    getCategoryFromURL() {
        const routeInfo = this.parseCurrentURL();
        return routeInfo.type === 'category' ? routeInfo.category : this.defaultCategory;
    }

    // Update URL with category and optional project
    updateURL(category, projectSlug = null) {
        if (this.validCategories.includes(category)) {
            let newURL = `${window.location.pathname}#${category}`;
            if (projectSlug) {
                newURL += `/${projectSlug}`;
            }
            window.history.pushState({ type: 'category', category, projectSlug }, '', newURL);
        }
    }

    // Update URL for sections (about, resume, contact)
    updateSectionURL(section) {
        if (this.validSections.includes(section)) {
            const newURL = `${window.location.pathname}#${section}`;
            window.history.pushState({ type: 'section', section }, '', newURL);
        }
    }

    // Navigate to a route with category/section and optional project
    navigateToRoute(routeInfo, updateURL = true) {
        if (routeInfo.type === 'section') {
            // Handle section navigation (about, resume, contact)
            if (updateURL) {
                this.updateSectionURL(routeInfo.section);
            }
            this.navigateToSection(routeInfo.section);
        } else {
            // Handle category navigation
            const { category, projectSlug } = routeInfo;
            
            // Update URL if requested
            if (updateURL) {
                this.updateURL(category, projectSlug);
            }

            // Check if we're staying in the same category
            const currentCategory = this.getCategoryFromURL();
            const isSameCategory = currentCategory === category;

            // Switch to the category using the content manager
            if (window.contentManager) {
                // If we have a project slug and we're staying in the same category, preserve current item
                const preserveCurrentItem = projectSlug && isSameCategory;
                window.contentManager.switchToCategory(category, preserveCurrentItem);
                
                // If project slug is provided, navigate to that project after category switch
                if (projectSlug) {
                    const delay = preserveCurrentItem ? 50 : 200; // Shorter delay if not rebuilding
                    setTimeout(() => {
                        this.navigateToProject(projectSlug);
                    }, delay);
                }
            }
        }
    }

    // Navigate to a section (about, resume, contact)
    navigateToSection(section) {
        switch (section) {
            case 'about':
                if (window.aboutCardManager) {
                    window.aboutCardManager.show();
                }
                break;
            case 'resume':
                if (window.resumeViewer) {
                    window.resumeViewer.show();
                }
                break;
            case 'connect':
                if (window.contactCardManager) {
                    window.contactCardManager.show();
                }
                break;
        }
    }

    // Navigate to a section with URL update
    navigateToSectionWithURL(section) {
        this.navigateToRoute({ type: 'section', section }, true);
    }

    // Navigate to a category (with or without URL update) - backward compatibility
    navigateToCategory(category, updateURL = true) {
        this.navigateToRoute({ type: 'category', category, projectSlug: null }, updateURL);
    }

    // Navigate to a specific project within current category
    navigateToProject(projectSlug) {
        if (window.timelineManager) {
            window.timelineManager.navigateToProjectBySlug(projectSlug);
        }
    }

    // Navigate to a specific project with category
    navigateToProjectInCategory(category, projectSlug, updateURL = true) {
        this.navigateToRoute({ type: 'category', category, projectSlug }, updateURL);
    }

    // Get the initial category from URL on page load
    getInitialCategory() {
        const routeInfo = this.parseCurrentURL();
        return routeInfo.type === 'category' ? routeInfo.category : this.defaultCategory;
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
            window.history.replaceState({ type: 'category', category, projectSlug }, '', newURL);
        }
    }

    // Replace current URL for sections without adding to history
    replaceSectionURL(section) {
        if (this.validSections.includes(section)) {
            const newURL = `${window.location.pathname}#${section}`;
            window.history.replaceState({ type: 'section', section }, '', newURL);
        }
    }
}

// Make URLRouter available globally
window.URLRouter = URLRouter;
