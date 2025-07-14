# URL Routing Implementation

## Overview
Added URL routing capability to allow direct linking to specific portfolio categories. Users can now share links that point directly to a specific category (Games, Apps, Music, Press).

## Features

### 1. URL Structure
- Base URL: `https://deepakc.dev/`
- Category URLs: 
  - `https://deepakc.dev/#games`
  - `https://deepakc.dev/#apps` 
  - `https://deepakc.dev/#music`
  - `https://deepakc.dev/#press`

### 2. URL Behavior
- **Page Load**: Reads URL hash to determine initial category
- **Category Switch**: Updates URL when user switches categories via filter buttons
- **Auto-Transitions**: Updates URL when auto-transitions switch categories
- **Browser Navigation**: Supports browser back/forward buttons
- **Invalid URLs**: Defaults to "games" category for invalid or missing hashes

### 3. Implementation Details

#### URLRouter Class (`js/utils/url-router.js`)
- Manages URL state and browser history
- Handles popstate events for browser navigation
- Provides methods for URL updates and category navigation

#### Integration Points
- **App Initialization**: Sets initial category from URL before UI build
- **Content Manager**: Filter buttons use URL router for navigation
- **Timeline Manager**: Category switching methods use URL router
- **Auto-Transitions**: Category cycling updates URLs

### 4. Technical Features
- Uses `window.history.pushState()` for seamless URL updates
- Uses `window.history.replaceState()` for initial page load (no history entry)
- Supports browser back/forward navigation via `popstate` events
- Graceful fallback when URL router is unavailable

### 5. Usage Examples
```javascript
// Navigate to a category (updates URL and switches content)
window.urlRouter.navigateToCategory('apps');

// Get current category from URL
const category = window.urlRouter.getCategoryFromURL();

// Update URL without navigation (internal use)
window.urlRouter.updateURL('music');
```

### 6. Validation
- Only allows valid category IDs: `games`, `apps`, `music`, `press`
- Invalid categories default to `games`
- URL validation prevents broken states

This implementation enables shareable URLs while maintaining all existing functionality including auto-transitions, keyboard navigation, and mobile responsiveness.
