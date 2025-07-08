// UI Builder Component
class UIBuilder {
    constructor(data) {
        this.data = data;
        this.init();
        this.setupResizeHandler();
    }
    init() {
        this.buildHeader();
        this.buildFilters();
        this.buildTimeline();
        this.buildContentPanels();
        this.buildCustomScrollbar();
        this.buildBackgroundText();
    }
    setupResizeHandler() {
        // Add resize event listener to handle background text positioning
        const debouncedResize = Utils.debounce(() => {
            this.handleResize();
        }, 100);
        window.addEventListener('resize', debouncedResize);
        // Also add a throttled version for immediate feedback
        const throttledResize = Utils.throttle(() => {
            this.handleResizeImmediate();
        }, 16); // Use 16ms for 60fps smooth updates
        window.addEventListener('resize', throttledResize);
        // Initial check on load
        this.handleResizeImmediate();
    }
    handleResizeImmediate() {
        // Immediate resize handling for smooth transitions
        const backgroundText = document.getElementById('backgroundText');
        if (backgroundText) {
            // Add resizing class immediately for smooth transitions
            backgroundText.classList.add('resizing');
            // Force responsive layout update
            this.updateResponsiveLayout();
        }
    }
    updateResponsiveLayout() {
        const backgroundText = document.getElementById('backgroundText');
        if (backgroundText) {
            const isMobile = window.innerWidth <= 1024;
            // Force layout styles based on viewport
            if (isMobile) {
                backgroundText.style.width = '100vw';
                backgroundText.style.padding = '0 5vw';
                backgroundText.style.alignItems = 'center';
                backgroundText.style.textAlign = 'center';
                backgroundText.style.left = '0';
                backgroundText.style.right = '0';
                backgroundText.style.justifyContent = 'center';
                // Center all text elements
                const textElements = backgroundText.querySelectorAll('.background-title, .background-description, .background-role, .background-company');
                textElements.forEach(el => {
                    el.style.textAlign = 'center';
                });
            } else {
                // Reset to desktop styles
                backgroundText.style.width = '';
                backgroundText.style.padding = '';
                backgroundText.style.alignItems = '';
                backgroundText.style.textAlign = '';
                backgroundText.style.left = '';
                backgroundText.style.right = '';
                backgroundText.style.justifyContent = '';
                // Reset text alignment for desktop
                const textElements = backgroundText.querySelectorAll('.background-title, .background-description, .background-role, .background-company');
                textElements.forEach(el => {
                    el.style.textAlign = '';
                });
            }
        } else {
        }
    }
    handleResize() {
        // Force immediate layout recalculation for background text
        const backgroundText = document.getElementById('backgroundText');
        if (backgroundText) {
            // Force a reflow to ensure CSS transitions work smoothly
            backgroundText.offsetHeight;
            // Update responsive layout
            this.updateResponsiveLayout();
            // Remove the resizing class after the transition completes
            setTimeout(() => {
                backgroundText.classList.remove('resizing');
            }, 200);
        }
    }
    buildHeader() {
        // Update title
        const titleElement = document.querySelector('.title');
        if (titleElement) {
            titleElement.textContent = this.data.personal.name;
        }
        // Build navigation
        this.buildNavigation();
    }
    buildNavigation() {
        const navContainer = document.querySelector('.nav-menu');
        if (!navContainer) return;
        navContainer.innerHTML = '';
        
        if (this.data.navigation) {
            this.data.navigation.forEach(navItem => {
                const navBtn = document.createElement('a');
                navBtn.className = 'nav-btn';
                navBtn.href = navItem.url;
                navBtn.textContent = navItem.label;
                
                // Add target="_blank" for external links
                if (navItem.url.startsWith('http') || navItem.url.endsWith('.pdf')) {
                    navBtn.target = '_blank';
                }
                
                // Add click handler for modal/card items
                if (navItem.url === '#' || navItem.url === '#about') {
                    navBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        // Close mobile menu if open
                        this.closeMobileMenu();
                        
                        // Handle about button click
                        if (navItem.id === 'about') {
                            // Function to try showing the about card
                            const tryShowAboutCard = () => {
                                if (window.aboutCardManager) {
                                    window.aboutCardManager.show();
                                    return true;
                                }
                                return false;
                            };
                            
                            // Try immediately
                            if (!tryShowAboutCard()) {
                                // Try again after a short delay
                                setTimeout(() => {
                                    if (!tryShowAboutCard()) {
                                        // Try one more time after a longer delay
                                        setTimeout(() => {
                                            tryShowAboutCard();
                                        }, 500);
                                    }
                                }, 100);
                            }
                        }
                        
                        // Handle connect button click
                        if (navItem.id === 'connect') {
                            // Function to try showing the connect card
                            const tryShowConnectCard = () => {
                                if (window.contactCardManager) {
                                    window.contactCardManager.show();
                                    return true;
                                }
                                return false;
                            };
                            
                            // Try immediately
                            if (!tryShowConnectCard()) {
                                // Try again after a short delay
                                setTimeout(() => {
                                    if (!tryShowConnectCard()) {
                                        // Try one more time after a longer delay
                                        setTimeout(() => {
                                            tryShowConnectCard();
                                        }, 500);
                                    }
                                }, 100);
                            }
                        }
                    });
                } else {
                    // Close mobile menu when clicking functional links
                    navBtn.addEventListener('click', () => {
                        this.closeMobileMenu();
                    });
                }
                
                navContainer.appendChild(navBtn);
            });
        }
        
        // Set up mobile menu toggle
        this.setupMobileMenu();
    }
    
    setupMobileMenu() {
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', () => {
                navMenu.classList.toggle('mobile-open');
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.header-nav')) {
                    navMenu.classList.remove('mobile-open');
                }
            });
            
            // Close mobile menu when switching to desktop view
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768) {
                    navMenu.classList.remove('mobile-open');
                }
            });
        }
    }
    
    closeMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.classList.remove('mobile-open');
        }
    }
    buildFilters() {
        const filtersContainer = document.querySelector('.header-filters');
        if (!filtersContainer) return;
        filtersContainer.innerHTML = '';
        this.data.filters.forEach((filter, index) => {
            const button = document.createElement('button');
            button.className = `filter-btn ${filter.active ? 'active' : ''}`;
            button.setAttribute('data-filter', filter.id);
            button.textContent = filter.label;
            filtersContainer.appendChild(button);
            // Add separator after each button except the last one
            if (index < this.data.filters.length - 1) {
                const separator = document.createElement('span');
                separator.className = 'filter-separator';
                filtersContainer.appendChild(separator);
            }
        });
    }
    buildTimeline() {
        // Create timeline container if it doesn't exist
        let timelineContainer = document.querySelector('.year-timeline');
        if (!timelineContainer) {
            timelineContainer = document.createElement('div');
            timelineContainer.className = 'year-timeline';
            document.body.appendChild(timelineContainer);
        }
        timelineContainer.innerHTML = '';
        // Create navigation buttons
        const prevBtn = document.createElement('button');
        prevBtn.className = 'timeline-nav-btn prev';
        prevBtn.innerHTML = '<div class="custom-arrow custom-arrow-left"></div>';
        prevBtn.setAttribute('aria-label', 'Previous');
        prevBtn.title = 'Previous';
        const nextBtn = document.createElement('button');
        nextBtn.className = 'timeline-nav-btn next';
        nextBtn.innerHTML = '<div class="custom-arrow custom-arrow-right"></div>';
        nextBtn.setAttribute('aria-label', 'Next');
        nextBtn.title = 'Next';
        // Create timeline content container
        const timelineContent = document.createElement('div');
        timelineContent.className = 'timeline-content';
        // Add elements to timeline container
        timelineContainer.appendChild(prevBtn);
        timelineContainer.appendChild(timelineContent);
        timelineContainer.appendChild(nextBtn);
        // Get timeline data using helper method
        const timelineData = this.data.getTimelineData();
        // Sort timeline by year (descending)
        const sortedTimeline = [...timelineData].sort((a, b) => b.year - a.year);
        // Create timeline with dots for each game and year labels
        let gameIndex = 0;
        // Add future year (latest year + 1)
        const latestYear = Math.max(...timelineData.map(item => item.year));
        const futureYear = latestYear + 1;
        // Create future year label
        const futureYearItem = document.createElement('div');
        futureYearItem.className = 'timeline-year-label';
        futureYearItem.textContent = futureYear;
        timelineContent.appendChild(futureYearItem);
        // Process each year's content
        sortedTimeline.forEach((yearData, yearIndex) => {
            // Create a container for all dots in this year
            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'timeline-dots-group';
            // Create dots for each game in this year
            yearData.content.forEach((gameData, contentIndex) => {
                // Create dot for this game
                const dotItem = document.createElement('div');
                dotItem.className = `timeline-dot ${gameIndex === 0 ? 'active' : ''}`;
                dotItem.setAttribute('data-year', yearData.year);
                dotItem.setAttribute('data-game-index', contentIndex);
                dotItem.setAttribute('data-global-index', gameIndex);
                dotItem.innerHTML = '•';
                // Store game data for easy access
                dotItem.dataset.title = gameData.title;
                dotItem.dataset.description = gameData.description;
                dotItem.dataset.company = gameData.company || '';
                dotItem.dataset.role = gameData.role || '';
                dotItem.dataset.trailerUrl = gameData.trailerUrl || '';
                dotItem.dataset.videoStart = gameData.videoStart || '';
                dotItem.dataset.videoEnd = gameData.videoEnd || '';
                dotItem.dataset.zoomVideo = gameData.zoomVideo !== undefined ? gameData.zoomVideo : 'true';
                dotItem.dataset.contributions = JSON.stringify(gameData.contributions || []);
                dotItem.dataset.buttonLabel = gameData.buttonLabel || 'View Contributions';
                dotItem.dataset.buttonURL = gameData.buttonURL || '';
                dotItem.dataset.infoPanelHeader = gameData.infoPanelHeader || '';
                dotItem.dataset.infoPanelData = JSON.stringify(gameData.infoPanelData || []);
                dotItem.dataset.projectImage = gameData.projectImage || '';
                dotsContainer.appendChild(dotItem);
                gameIndex++;
            });
            timelineContent.appendChild(dotsContainer);
            // Add year label after all games for this year
            const yearItem = document.createElement('div');
            yearItem.className = 'timeline-year-label';
            yearItem.textContent = yearData.year;
            timelineContent.appendChild(yearItem);
        });
    }
    getTotalGameCount() {
        const timelineData = this.data.getTimelineData();
        return timelineData.reduce((total, yearData) => total + yearData.content.length, 0);
    }
    buildContentPanels() {
        // Create content panel container if it doesn't exist
        let contentPanel = document.getElementById('contentPanel');
        if (!contentPanel) {
            contentPanel = document.createElement('div');
            contentPanel.className = 'content-panel';
            contentPanel.id = 'contentPanel';
            document.body.appendChild(contentPanel);
        }
        contentPanel.innerHTML = '';
        // Get timeline data using helper method
        const timelineData = this.data.getTimelineData();
        // Sort timeline by year (descending)
        const sortedTimeline = [...timelineData].sort((a, b) => b.year - a.year);
        sortedTimeline.forEach((yearData, index) => {
            const yearContent = document.createElement('div');
            yearContent.className = `year-content ${index === 0 ? 'active' : ''}`;
            yearContent.id = `content-${yearData.year}`;
            // Content grid (no year header)
            const contentGrid = document.createElement('div');
            contentGrid.className = 'content-grid';
            yearData.content.forEach(item => {
                const card = this.createContentCard(item);
                contentGrid.appendChild(card);
            });
            yearContent.appendChild(contentGrid);
            contentPanel.appendChild(yearContent);
        });
    }
    createContentCard(item) {
        // Create invisible card that only stores data for background functionality
        const card = document.createElement('div');
        // Determine category type from active filter instead of item.type
        const activeFilter = this.data.filters.find(f => f.active);
        const categoryType = activeFilter ? activeFilter.id : 'other';
        card.className = `content-card ${categoryType}`;
        card.style.display = 'none'; // Hide the card completely
        // Store data for background text display and video
        card.dataset.title = item.title;
        card.dataset.description = item.description;
        card.dataset.company = item.company || '';
        card.dataset.role = item.role || '';
        card.dataset.trailerUrl = item.trailerUrl || '';
        card.dataset.videoStart = item.videoStart || '';
        card.dataset.videoEnd = item.videoEnd || '';
        card.dataset.zoomVideo = item.zoomVideo !== undefined ? item.zoomVideo : 'true';
        card.dataset.buttonLabel = item.buttonLabel || 'View Contributions';
        card.dataset.buttonURL = item.buttonURL || '';
        card.dataset.infoPanelHeader = item.infoPanelHeader || '';
        card.dataset.infoPanelData = JSON.stringify(item.infoPanelData || []);
        card.dataset.projectImage = item.projectImage || '';
        return card;
    }
    buildCustomScrollbar() {
        // Create custom scrollbar if it doesn't exist
        let scrollbar = document.getElementById('customScrollbar');
        if (!scrollbar) {
            scrollbar = document.createElement('div');
            scrollbar.id = 'customScrollbar';
            scrollbar.className = 'custom-scrollbar';
            const thumb = document.createElement('div');
            thumb.id = 'customScrollbarThumb';
            thumb.className = 'custom-scrollbar-thumb';
            scrollbar.appendChild(thumb);
            document.body.appendChild(scrollbar);
        }
    }
    buildBackgroundText() {
        // Create background text container if it doesn't exist
        let backgroundText = document.getElementById('backgroundText');
        if (!backgroundText) {
            backgroundText = document.createElement('div');
            backgroundText.id = 'backgroundText';
            backgroundText.className = 'background-text';
            const title = document.createElement('h1');
            title.className = 'background-title';
            title.textContent = '';
            const description = document.createElement('p');
            description.className = 'background-description';
            description.textContent = '';
            const role = document.createElement('p');
            role.className = 'background-role';
            role.textContent = '';
            const company = document.createElement('p');
            company.className = 'background-company';
            company.textContent = '';
            const contributionsBtn = document.createElement('button');
            contributionsBtn.className = 'contributions-btn';
            contributionsBtn.textContent = 'View Contributions'; // This will be updated dynamically
            contributionsBtn.style.display = 'none';
            backgroundText.appendChild(title);
            backgroundText.appendChild(description);
            backgroundText.appendChild(role);
            backgroundText.appendChild(company);
            backgroundText.appendChild(contributionsBtn); // Add button back to the stack
            document.body.appendChild(backgroundText);
        }
        
        // Create background project image if it doesn't exist
        let backgroundProjectImage = document.getElementById('backgroundProjectImage');
        if (!backgroundProjectImage) {
            backgroundProjectImage = document.createElement('img');
            backgroundProjectImage.id = 'backgroundProjectImage';
            backgroundProjectImage.className = 'background-project-image';
            backgroundProjectImage.style.display = 'none';
            backgroundProjectImage.alt = 'Project Image';
            document.body.appendChild(backgroundProjectImage);
        }
        // Create info panel if it doesn't exist
        let infoPanel = document.getElementById('infoPanel');
        if (!infoPanel) {
            infoPanel = document.createElement('div');
            infoPanel.id = 'infoPanel';
            infoPanel.className = 'info-panel';
            const closeBtn = document.createElement('button');
            closeBtn.className = 'info-panel-close';
            closeBtn.innerHTML = '×';
            
            // Primary click handler
            closeBtn.onclick = () => {
                this.closeInfoPanel(infoPanel);
            };
            
            // Backup touch event handlers for mobile
            closeBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
            }, { passive: false });
            
            closeBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeInfoPanel(infoPanel);
            }, { passive: false });
            
            // Backup click handler
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeInfoPanel(infoPanel);
            });
            const header = document.createElement('div');
            header.className = 'info-panel-header';
            header.textContent = '';
            const content = document.createElement('div');
            content.className = 'info-panel-content';
            const list = document.createElement('ul');
            list.className = 'info-panel-list';
            content.appendChild(list);
            infoPanel.appendChild(closeBtn);
            infoPanel.appendChild(header);
            infoPanel.appendChild(content);
            document.body.appendChild(infoPanel);
        }

    }
    
    closeInfoPanel(infoPanel) {
        // Add closing state to immediately stop animations
        infoPanel.classList.add('closing');
        infoPanel.classList.remove('visible');
        // After animation completes, clean up the closing state
        setTimeout(() => {
            if (infoPanel.classList.contains('closing')) {
                infoPanel.classList.remove('closing');
            }
        }, 300); // Match the CSS transition duration
        if (window.contentManager) {
            window.contentManager.showUIElements();
            window.contentManager.resumeAutoTransition();
            window.contentManager.updateNavigationButtons();
        }
    }
}
// Export for use in other modules
window.UIBuilder = UIBuilder;
