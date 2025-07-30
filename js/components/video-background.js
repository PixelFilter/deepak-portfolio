// Video Background Component
class VideoBackground {
    constructor() {
        this.currentVideo = null;
        this.currentVideoUrl = null; // Track current video URL to prevent duplicates
        this.videoContainer = null;
        this.isVisible = false;
        this.player = null;
        this.timeChecker = null;
        this.zoomVideo = true; // Default to zoom enabled
        this.isMuted = true; // Default to muted for mobile autoplay compatibility
        this.userMutePreference = true; // Persist user mute/unmute preference
        this.init();
    }
    init() {
        this.createVideoContainer();
        this.setupEventListeners();
        this.initSoundToggle();
        this.autoplayAttempted = false; // Track if we've tried autoplay after user interaction
    }
    createVideoContainer() {
        // Create video container if it doesn't exist
        if (!this.videoContainer) {
            this.videoContainer = document.createElement('div');
            this.videoContainer.id = 'video-background';
            this.videoContainer.className = 'video-background';
            document.body.appendChild(this.videoContainer);
        }
    }
    setupEventListeners() {
        // Listen for content changes
        document.addEventListener('contentChanged', (event) => {
            if (event.detail && event.detail.trailerUrl) {
                this.showVideo(event.detail.trailerUrl, event.detail.videoStart, event.detail.videoEnd, event.detail.zoomVideo, event.detail.isInstant, event.detail.category, event.detail.mobileVideoAlign, event.detail.alignmentOffset);
            } else {
                this.hideVideo();
            }
        });
        // Listen for window resize to adjust video size
        window.addEventListener('resize', () => {
            this.adjustVideoSize();
            this.applyMobileVideoAlignment();
        });
    }
    // Utility function to detect mobile devices reliably
    isMobileDevice() {
        return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    showVideo(trailerUrl, videoStart, videoEnd, zoomVideo = true, isInstant = false, category = null, mobileVideoAlign = 'center', alignmentOffset = '0') {
        if (!trailerUrl) {
            this.hideVideo();
            return;
        }
        
        // Set mute state based on category and device
        // For mobile devices, start muted even for press videos to enable autoplay, then unmute
        const isMobile = this.isMobileDevice();
        // Use user's mute preference for all videos
        const shouldBeMuted = this.userMutePreference;
        
        if (this.isMuted !== shouldBeMuted) {
            this.isMuted = shouldBeMuted;
            this.updateSoundToggleUI();
        }
        
        // Store the desired final mute state for press videos on mobile
        this.targetMuteState = category === 'press' ? false : true;
        
        // Create a unique identifier for this video configuration
        const videoId = `${trailerUrl}_${videoStart || 'none'}_${videoEnd || 'none'}`;
        // Skip if the same video is already loaded
        if (this.currentVideoUrl === videoId && this.isVisible) {
            return;
        }
        // Store the new video configuration
        this.currentVideoUrl = videoId;
        this.zoomVideo = zoomVideo;
        this.currentMobileVideoAlign = mobileVideoAlign;
        this.currentAlignmentOffset = alignmentOffset;
        // Reset autoplayAttempted for each new video
        this.autoplayAttempted = false;
        // If instant transition is requested, use subtle fade instead of black overlay
        if (isInstant && this.videoContainer.innerHTML !== '') {
            // Use a subtle fade transition instead of black overlay
            this.videoContainer.style.opacity = '0.3';
            // Clear existing video immediately and load new one
            setTimeout(() => {
                this.videoContainer.innerHTML = '';
                this.loadNewVideo(trailerUrl, videoStart, videoEnd);
                // Restore opacity after new video loads
                setTimeout(() => {
                    this.videoContainer.style.opacity = '1';
                }, 100);
            }, 50);
        } else if (this.videoContainer.innerHTML === '') {
            // No existing video, load directly
            this.loadNewVideo(trailerUrl, videoStart, videoEnd);
        } else {
            // Fade out current video if one exists (for scroll transitions)
            this.videoContainer.style.opacity = '0';
            setTimeout(() => {
                // Clear existing video after fade out
                this.videoContainer.innerHTML = '';
                this.loadNewVideo(trailerUrl, videoStart, videoEnd);
            }, 200);
        }
    }
    loadNewVideo(trailerUrl, videoStart, videoEnd) {
        // Build YouTube URL with timing parameters
        let videoSrc = trailerUrl;
        const urlParams = new URLSearchParams();
        // Add standard parameters
        urlParams.append('autoplay', '1');
        urlParams.append('mute', this.getMuteState());
        urlParams.append('controls', '0');
        urlParams.append('showinfo', '0');
        urlParams.append('rel', '0');
        urlParams.append('iv_load_policy', '3');
        urlParams.append('modestbranding', '1');
        urlParams.append('playsinline', '1');
        urlParams.append('fs', '0');
        urlParams.append('disablekb', '1');
        urlParams.append('cc_load_policy', '0');
        urlParams.append('hl', 'en');
        urlParams.append('color', 'white');
        urlParams.append('theme', 'dark');
        // Additional mobile-friendly parameters
        urlParams.append('widget_referrer', window.location.origin);
        // Add timing parameters if provided
        // Fix for YouTube stutter: if videoStart is 0, set it to 1 to avoid initial frame issues
        if (videoStart !== undefined) {
            const adjustedStart = videoStart === 0 ? 1 : videoStart;
            urlParams.append('start', adjustedStart);
        }
        if (videoEnd !== undefined) {
            urlParams.append('end', videoEnd);
        }
        // For looping with specific time range, we'll use JavaScript
        if (videoStart !== undefined && videoEnd !== undefined) {
            urlParams.append('enablejsapi', '1');
        } else {
            // Standard loop for full video
            urlParams.append('loop', '1');
            // Extract video ID for playlist parameter
            const videoId = trailerUrl.split('/').pop();
            urlParams.append('playlist', videoId);
        }
        videoSrc += '?' + urlParams.toString();
        // Create iframe for YouTube video
        const iframe = document.createElement('iframe');
        iframe.src = videoSrc;
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullscreen = false;
        iframe.frameBorder = '0';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.objectFit = 'cover';
        iframe.style.pointerEvents = 'none';
        iframe.style.position = 'absolute';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.id = 'youtube-player';
        iframe.title = 'Background Video';
        iframe.loading = 'lazy';
        // Additional attributes to prevent recommended videos
        iframe.setAttribute('webkitallowfullscreen', 'false');
        iframe.setAttribute('mozallowfullscreen', 'false');
        iframe.setAttribute('allowfullscreen', 'false');
        
        // Add error handling for autoplay failures on mobile
        iframe.addEventListener('load', () => {
            const isMobile = this.isMobileDevice();
            if (isMobile) {
                this.setupMobileAutoplayFallback();

                // Add a small delay then check if video is playing
                setTimeout(() => {
                    if (this.player && typeof this.player.getPlayerState === 'function') {
                        const state = this.player.getPlayerState();
                        // If video is not playing (-1 = unstarted, 2 = paused)
                        if (state === -1 || state === 2) {
                            this.player.mute();
                            this.player.playVideo();
                        }
                    }
                }, 1000);
            }
        });

        // On mobile, listen for user gesture to unmute press videos
        if (this.isMobileDevice() && this.targetMuteState === false) {
            const unmuteOnGesture = () => {
                if (this.player && typeof this.player.unMute === 'function') {
                    try {
                        this.player.unMute();
                        this.isMuted = false;
                        this.updateSoundToggleUI();
                    } catch (error) {
                        console.log('Failed to unmute after gesture:', error);
                    }
                }
                // Remove listeners after first gesture
                ['touchstart', 'touchend', 'click', 'keydown'].forEach(event => {
                    document.removeEventListener(event, unmuteOnGesture, true);
                });
            };
            ['touchstart', 'touchend', 'click', 'keydown'].forEach(event => {
                document.addEventListener(event, unmuteOnGesture, true);
            });
        }
        
        this.videoContainer.appendChild(iframe);
        this.currentVideo = iframe;
        // If we have timing parameters, set up custom looping
        if (videoStart !== undefined && videoEnd !== undefined) {
            this.setupCustomLoop(videoStart, videoEnd);
        }
        // Ensure video covers full background
        this.adjustVideoSize();
        // Apply mobile video alignment
        this.applyMobileVideoAlignment();
        // Show video with fade-in effect
        setTimeout(() => {
            this.videoContainer.classList.add('visible');
            this.videoContainer.style.opacity = '';
            this.isVisible = true;
            
            // Delay to ensure smooth loading
            setTimeout(() => {
                this.videoContainer.classList.add('loaded');
            }, 100);
        }, 50);
    }
    hideVideo() {
        if (this.videoContainer) {
            this.videoContainer.classList.remove('visible', 'loaded');
            this.isVisible = false;
            this.currentVideoUrl = null; // Reset current video URL
            // Clean up player and timers
            if (this.timeChecker) {
                clearInterval(this.timeChecker);
                this.timeChecker = null;
            }
            if (this.player) {
                this.player.destroy();
                this.player = null;
            }
            // Clear video after fade out
            setTimeout(() => {
                this.videoContainer.innerHTML = '';
                this.currentVideo = null;
            }, 500);
        }
    }
    // Method to change video opacity for orb interaction
    setOpacity(opacity) {
        if (this.videoContainer) {
            this.videoContainer.style.opacity = opacity;
        }
    }
    // Method to apply blur effect
    setBlur(blurAmount) {
        if (this.videoContainer) {
            this.videoContainer.style.filter = `blur(${blurAmount}px)`;
        }
    }
    // Method to adjust video size to cover full background
    adjustVideoSize() {
        if (this.currentVideo) {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const aspectRatio = 16 / 9; // YouTube standard aspect ratio
            // Calculate dimensions to cover viewport
            let videoWidth, videoHeight;
            // Use zoom factor based on the zoomVideo flag
            // If zoomVideo is true, use 1.3 to crop out YouTube text overlays
            // If zoomVideo is false, use 1.0 for full video display
            const zoomFactor = this.zoomVideo ? 1.3 : 1.0;
            if (viewportWidth / viewportHeight > aspectRatio) {
                // Viewport is wider than video aspect ratio
                videoWidth = (viewportWidth + 100) * zoomFactor;
                videoHeight = ((viewportWidth + 100) / aspectRatio) * zoomFactor;
            } else {
                // Viewport is taller than video aspect ratio
                videoHeight = (viewportHeight + 100) * zoomFactor;
                videoWidth = ((viewportHeight + 100) * aspectRatio) * zoomFactor;
            }
            // Apply dimensions and positioning based on mobile alignment
            this.currentVideo.style.width = `${videoWidth}px`;
            this.currentVideo.style.height = `${videoHeight}px`;
            
            // Apply positioning based on mobile alignment for mobile devices
            const isMobile = window.innerWidth <= 1024;
            if (isMobile && this.currentMobileVideoAlign) {
                this.currentVideo.style.top = `${(viewportHeight - videoHeight) / 2}px`;
                
                // Get the alignment offset as a percentage (default 0)
                const offsetPercent = parseFloat(this.currentAlignmentOffset || '0');
                
                switch (this.currentMobileVideoAlign) {
                    case 'left':
                        // Position from left edge with offset percentage
                        const leftOffset = (viewportWidth * offsetPercent) / 100;
                        this.currentVideo.style.left = `${leftOffset}px`;
                        this.currentVideo.style.right = 'auto';
                        break;
                    case 'right':
                        // Position from right edge with offset percentage
                        const rightOffset = (viewportWidth * offsetPercent) / 100;
                        this.currentVideo.style.right = `${rightOffset}px`;
                        this.currentVideo.style.left = 'auto';
                        break;
                    case 'center':
                    default:
                        // Center with optional offset (offset moves from center point)
                        const centerOffset = (viewportWidth * offsetPercent) / 100;
                        this.currentVideo.style.left = `${(viewportWidth - videoWidth) / 2 + centerOffset}px`;
                        this.currentVideo.style.right = 'auto';
                        break;
                }
            } else {
                // Default desktop centering
                this.currentVideo.style.left = `${(viewportWidth - videoWidth) / 2}px`;
                this.currentVideo.style.top = `${(viewportHeight - videoHeight) / 2}px`;
                this.currentVideo.style.right = 'auto';
            }
        }
    }
    
    // Method to apply mobile video alignment
    applyMobileVideoAlignment() {
        if (!this.currentVideo || !this.currentMobileVideoAlign) {
            return;
        }
        
        // Only apply mobile alignment on mobile/tablet devices
        const isMobile = window.innerWidth <= 1024;
        if (!isMobile) {
            return;
        }
        
        // Remove any existing alignment classes
        this.videoContainer.classList.remove('mobile-align-left', 'mobile-align-center', 'mobile-align-right');
        
        // Apply the new alignment class (now mainly for transform-origin)
        switch (this.currentMobileVideoAlign) {
            case 'left':
                this.videoContainer.classList.add('mobile-align-left');
                break;
            case 'right':
                this.videoContainer.classList.add('mobile-align-right');
                break;
            case 'center':
            default:
                this.videoContainer.classList.add('mobile-align-center');
                break;
        }
    }
    
    // Method to setup custom looping for time segments
    setupCustomLoop(startTime, endTime) {
        // Load YouTube API if not already loaded
        if (!window.YT) {
            const script = document.createElement('script');
            script.src = 'https://www.youtube.com/iframe_api';
            document.head.appendChild(script);
            window.onYouTubeIframeAPIReady = () => {
                this.initializePlayer(startTime, endTime);
            };
        } else {
            this.initializePlayer(startTime, endTime);
        }
    }
    // Initialize YouTube player with custom controls
    initializePlayer(startTime, endTime) {
        if (this.player) {
            this.player.destroy();
        }
        
        // Fix for YouTube stutter: if startTime is 0, set it to 1 to avoid initial frame issues
        const adjustedStartTime = startTime === 0 ? 1 : startTime;
        
        this.player = new YT.Player('youtube-player', {
            events: {
                onReady: (event) => {
                    event.target.seekTo(adjustedStartTime);
                    // Apply current mute state
                    if (this.isMuted) {
                        event.target.mute();
                    } else {
                        event.target.unMute();
                    }
                    
                    // Try to play video
                    try {
                        event.target.playVideo();
                    } catch (error) {
                        console.log('Autoplay failed in onReady:', error);
                    }
                },
                onStateChange: (event) => {
                    // Check if video has reached end time
                    if (event.data === YT.PlayerState.PLAYING) {
                        this.checkVideoTime(event.target, adjustedStartTime, endTime);
                    }
                }
            }
        });
    }
    // Check video time and loop if necessary
    checkVideoTime(player, startTime, endTime) {
        if (this.timeChecker) {
            clearInterval(this.timeChecker);
        }
        this.timeChecker = setInterval(() => {
            if (player.getCurrentTime && player.getCurrentTime() >= (endTime - 0.5)) {
                // Restart video 0.5 seconds before end to prevent recommended videos
                player.seekTo(startTime);
                player.playVideo();
            }
        }, 500); // Check every 500ms for more precise timing
    }
    createBlackOverlay() {
        // Remove existing overlay if it exists
        this.removeBlackOverlay();
        const overlay = document.createElement('div');
        overlay.id = 'video-transition-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: #000;
            z-index: 999;
            opacity: 0;
            transition: opacity 0.15s ease;
            pointer-events: none;
        `;
        document.body.appendChild(overlay);
        // Fade in the overlay
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);
    }
    removeBlackOverlay() {
        const overlay = document.getElementById('video-transition-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 150);
        }
    }
    initSoundToggle() {
        const soundToggle = document.getElementById('sound-toggle');
        if (soundToggle) {
            // Set initial state (disabled/muted)
            soundToggle.classList.add('disabled');
            soundToggle.classList.remove('enabled');
            // Add click event listener
            soundToggle.addEventListener('click', () => {
                this.toggleSound();
            });
        }
    }
    toggleSound() {
        const soundToggle = document.getElementById('sound-toggle');
        this.isMuted = !this.isMuted;
        this.userMutePreference = this.isMuted; // Persist user preference
        this.updateSoundToggleUI();
        
        // Update current video if playing
        if (this.currentVideo && this.player) {
            if (this.isMuted) {
                this.player.mute();
            } else {
                this.player.unMute();
            }
        }
    }
    
    updateSoundToggleUI() {
        const soundToggle = document.getElementById('sound-toggle');
        if (soundToggle) {
            if (this.isMuted) {
                soundToggle.classList.add('disabled');
                soundToggle.classList.remove('enabled');
            } else {
                soundToggle.classList.remove('disabled');
                soundToggle.classList.add('enabled');
            }
        }
    }
    // Method to get current mute state for new videos
    getMuteState() {
        return this.isMuted ? '1' : '0';
    }
    
    // Setup mobile autoplay fallback for when autoplay is blocked
    setupMobileAutoplayFallback() {
        // Only set up once per session
        if (this.autoplayAttempted) {
            return;
        }
        
        const interactionEvents = ['touchstart', 'touchend', 'click', 'keydown'];
        
        const enableAutoplayOnInteraction = () => {
            this.autoplayAttempted = true;
            
            // Try to play any current video
            if (this.currentVideo && this.player) {
                try {
                    // Always start muted to ensure autoplay works
                    this.player.mute();
                    this.player.playVideo();
                    
                    // For press videos, unmute after user interaction
                    if (this.targetMuteState === false) {
                        setTimeout(() => {
                            try {
                                this.player.unMute();
                                this.isMuted = false;
                                this.updateSoundToggleUI();
                            } catch (error) {
                                console.log('Failed to unmute after autoplay:', error);
                            }
                        }, 500);
                    }
                } catch (error) {
                    console.log('Autoplay with interaction failed:', error);
                }
            }
            
            // Remove listeners after first successful interaction
            interactionEvents.forEach(event => {
                document.removeEventListener(event, enableAutoplayOnInteraction, true);
            });
        };
        
        // Add listeners for user interactions
        interactionEvents.forEach(event => {
            document.addEventListener(event, enableAutoplayOnInteraction, true);
        });
    }
}
// Export for use in other modules
window.VideoBackground = VideoBackground;
