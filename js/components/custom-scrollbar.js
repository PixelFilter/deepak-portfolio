// Custom Scrollbar Component
class CustomScrollbar {
    constructor() {
        this.scrollbar = document.getElementById('customScrollbar');
        this.thumb = document.getElementById('customScrollbarThumb');
        this.isDragging = false;
        this.dragStartY = 0;
        this.scrollStartY = 0;
        this.hideTimeout = null;
        this.isLoadingComplete = false;
        this.hasMouseMoved = false;
        this.init();
    }
    init() {
        this.setupEventListeners();
        this.updateScrollbar();
    }
    setLoadingComplete() {
        this.isLoadingComplete = true;
        // Check if mouse has already moved during loading
        if (this.hasMouseMoved) {
            this.showScrollbar();
        }
    }
    setupEventListeners() {
        // Update scrollbar on window scroll
        window.addEventListener('scroll', () => {
            this.updateScrollbar();
            // Only show scrollbar if loading is complete and mouse has moved
            if (this.isLoadingComplete && this.hasMouseMoved) {
                this.showScrollbar();
            }
        });
        // Thumb drag events
        this.thumb.addEventListener('mousedown', (e) => {
            this.startDrag(e);
        });
        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.drag(e);
            }
        });
        document.addEventListener('mouseup', () => {
            this.stopDrag();
        });
        // Scrollbar track click
        this.scrollbar.addEventListener('click', (e) => {
            if (e.target === this.scrollbar) {
                this.jumpToPosition(e);
            }
        });
        // Show/hide scrollbar on mouse movement (only after loading is complete)
        document.addEventListener('mousemove', () => {
            this.hasMouseMoved = true;
            if (this.isLoadingComplete) {
                this.showScrollbar();
            }
        });
        // Touch events for mobile
        this.thumb.addEventListener('touchstart', (e) => {
            this.startDrag(e.touches[0]);
        });
        document.addEventListener('touchmove', (e) => {
            if (this.isDragging) {
                e.preventDefault();
                this.drag(e.touches[0]);
            }
        });
        document.addEventListener('touchend', () => {
            this.stopDrag();
        });
    }
    updateScrollbar() {
        const scrollHeight = document.body.scrollHeight - window.innerHeight;
        const scrollTop = window.scrollY;
        const scrollbarHeight = this.scrollbar.clientHeight;
        // Calculate thumb height (minimum 20px)
        const thumbHeight = Math.max(20, (window.innerHeight / document.body.scrollHeight) * scrollbarHeight);
        // Calculate thumb position
        const thumbPosition = (scrollTop / scrollHeight) * (scrollbarHeight - thumbHeight);
        // Update thumb
        this.thumb.style.height = thumbHeight + 'px';
        this.thumb.style.top = thumbPosition + 'px';
    }
    showScrollbar() {
        // Only show scrollbar if loading is complete and mouse has moved
        if (!this.isLoadingComplete || !this.hasMouseMoved) {
            return;
        }
        this.scrollbar.classList.add('visible');
        // Clear existing timeout
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
        }
        // Hide after 2 seconds of inactivity
        this.hideTimeout = setTimeout(() => {
            if (!this.isDragging) {
                this.scrollbar.classList.remove('visible');
            }
        }, 2000);
    }
    startDrag(e) {
        this.isDragging = true;
        this.dragStartY = e.clientY;
        this.scrollStartY = window.scrollY;
        // Clear hide timeout while dragging
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
        }
        // Add dragging class for visual feedback
        this.thumb.style.background = 'rgba(0, 0, 0, 0.9)';
        document.body.style.userSelect = 'none';
    }
    drag(e) {
        if (!this.isDragging) return;
        const deltaY = e.clientY - this.dragStartY;
        const scrollbarHeight = this.scrollbar.clientHeight;
        const thumbHeight = this.thumb.clientHeight;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        // Calculate new scroll position
        const scrollRatio = deltaY / (scrollbarHeight - thumbHeight);
        const newScrollY = this.scrollStartY + (scrollRatio * maxScroll);
        // Clamp scroll position
        const clampedScrollY = Math.max(0, Math.min(newScrollY, maxScroll));
        window.scrollTo(0, clampedScrollY);
    }
    stopDrag() {
        this.isDragging = false;
        this.thumb.style.background = 'rgba(0, 0, 0, 0.6)';
        document.body.style.userSelect = '';
        // Start hide timer again
        this.showScrollbar();
    }
    jumpToPosition(e) {
        const rect = this.scrollbar.getBoundingClientRect();
        const clickY = e.clientY - rect.top;
        const scrollbarHeight = this.scrollbar.clientHeight;
        const thumbHeight = this.thumb.clientHeight;
        // Calculate target scroll position
        const scrollRatio = (clickY - thumbHeight / 2) / (scrollbarHeight - thumbHeight);
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const targetScroll = Math.max(0, Math.min(scrollRatio * maxScroll, maxScroll));
        window.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
        });
    }
}
// Export for use in other modules
window.CustomScrollbar = CustomScrollbar;
