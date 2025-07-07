// Loop Toggle Position Manager
class LoopToggleManager {
    constructor() {
        this.loopToggle = null;
        this.timeline = null;
        this.isAdjusted = false;
        this.checkInterval = null;
        this.resizeObserver = null;
        this.init();
    }
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    setup() {
        this.loopToggle = document.getElementById('loop-toggle');
        this.timeline = document.querySelector('.year-timeline');
        if (!this.loopToggle || !this.timeline) {
            // Retry after a short delay if elements aren't ready yet
            setTimeout(() => this.setup(), 100);
            return;
        }
        // Start monitoring for intersections
        this.startMonitoring();
        // Add resize observer to handle window resizing
        this.setupResizeObserver();
    }
    startMonitoring() {
        // Check immediately
        this.checkIntersection();
        // Set up periodic checking
        this.checkInterval = setInterval(() => {
            this.checkIntersection();
        }, 250); // Check every 250ms
    }
    checkIntersection() {
        if (!this.loopToggle || !this.timeline) return;
        const loopToggleRect = this.loopToggle.getBoundingClientRect();
        const timelineRect = this.timeline.getBoundingClientRect();
        // Check if elements would intersect
        const isIntersecting = this.elementsIntersect(loopToggleRect, timelineRect);
        if (isIntersecting && !this.isAdjusted) {
            this.hideToggle();
        } else if (!isIntersecting && this.isAdjusted) {
            this.showToggle();
        }
    }
    elementsIntersect(rect1, rect2) {
        // Check if rectangles intersect
        return !(rect1.right < rect2.left || 
                 rect1.left > rect2.right || 
                 rect1.bottom < rect2.top || 
                 rect1.top > rect2.bottom);
    }
    hideToggle() {
        if (!this.loopToggle) return;
        // Hide loop toggle when intersecting with timeline
        this.loopToggle.style.visibility = 'hidden';
        this.isAdjusted = true;
    }
    showToggle() {
        if (!this.loopToggle) return;
        // Show loop toggle when not intersecting with timeline
        this.loopToggle.style.visibility = 'visible';
        this.isAdjusted = false;
    }
    setupResizeObserver() {
        if (window.ResizeObserver) {
            this.resizeObserver = new ResizeObserver(() => {
                this.checkIntersection();
            });
            if (this.timeline) {
                this.resizeObserver.observe(this.timeline);
            }
        }
    }
    destroy() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
    }
}

// Export for use in other modules
window.LoopToggleManager = LoopToggleManager;
