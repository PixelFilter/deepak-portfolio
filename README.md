# Deepak Chennakkadan - Personal Portfolio Website

A modern, interactive portfolio website showcasing creative technology, game development, and AI engineering. Built with a modular architecture for maintainability, scalability, and performance.

---

## 🚀 Project Overview

This website presents Deepak Chennakkadan’s professional journey, featuring an interactive timeline and direct category navigation. It is designed for a minimalist, futuristic aesthetic with glassmorphism effects and smooth transitions.

---

## ✨ Key Features

- **Interactive Timeline:** Year-based navigation with smooth scrolling, navigation buttons, and keyboard support.
- **Loop Toggle:** One-click control for auto-transitions, visually consistent with sound toggle, responsive and collision-aware.
- **URL Routing:** Direct links to portfolio categories (Games, Apps, Music, Press) with browser navigation support.
- **Responsive Design:** Optimized for desktop, tablet, and mobile devices.
- **Modern UI:** Glassmorphism, clean typography (Inter font), and subtle transitions.
- **SEO Optimized:** Meta tags, Open Graph, Twitter Cards, structured data, sitemap, robots.txt.
- **Favicon & PWA Support:** Comprehensive favicon setup and web app manifest for cross-device branding.

---

## 🏗️ Modular Structure & Organization

```
Deepak_Website/
├── index.html
├── README.md
├── assets/
│   ├── images/
│   └── favicons/
├── data/
│   └── portfolio-data.js
├── js/
│   ├── main.js
│   ├── app.js
│   ├── components/
│   └── utils/
├── css/
│   ├── main.css
│   ├── base/
│   ├── layout/
│   ├── components/
│   └── utils/
```

- **JavaScript:** Split into focused modules (app controller, UI builder, timeline manager, content manager, custom scrollbar, helpers).
- **CSS:** Modular files for base styles, layout, components, and utilities. Uses CSS variables for theming and responsive utilities.

---

## 🎨 CSS Architecture & Design Principles

- **Modular CSS:** Base, layout, components, and utility files for maintainability.
- **Glassmorphism:** Backdrop blur, glass backgrounds, and border effects.
- **Design Tokens:** Centralized CSS variables for colors, spacing, radii, and z-index layers.
- **Responsive Breakpoints:** Large, medium, small, extra small, and landscape mobile support.
- **BEM Naming:** Semantic, descriptive class names for clarity.
- **Performance:** Reduced file size, better caching, and efficient selectors.

---

## 🕒 Timeline Navigation & Loop Toggle

- **Timeline Navigation:** Previous/next buttons, keyboard navigation, ARIA labels, tooltips, and disabled states at boundaries.
- **Loop Toggle:** SVG icon (refresh/loop or pause), bottom left positioning, animated state changes, collision avoidance, and responsive hiding.

---

## 🔗 URL Routing & Category Navigation

- **Direct Linking:** URLs like `/#games`, `/#apps`, `/#music`, `/#press` for category navigation.
- **Browser Integration:** Supports back/forward navigation, hash-based routing, and graceful fallback.
- **Validation:** Only valid categories allowed; defaults to "games" if invalid.

---

## 📈 SEO & Favicon Setup

- **SEO:** Optimized meta tags, Open Graph, Twitter Cards, structured data (JSON-LD), sitemap.xml, robots.txt.
- **Analytics:** Google Analytics and Search Console integration recommended.
- **Favicons:** Full set for all platforms (ICO, PNG, Apple Touch, Android Chrome, Microsoft Tiles). Web app manifest for PWA support.
- **Design Tips:** Simple, recognizable logo, consistent branding, and color contrast.

---

## 🛠️ Usage Instructions

1. **Clone or Download:** Get the project files.
2. **Open `index.html`:** Launch in any modern browser (Chrome, Firefox, Safari, Edge).
3. **No Build Required:** Runs directly in the browser.
4. **Modify Content:** Edit modular JS/CSS files for features and styling.
5. **Add Projects:** Update `data/portfolio-data.js` for new timeline entries.

---

## 🌐 Browser Support

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android
- Requires WebGL, CSS Grid, and Flexbox support

---


## 👤 Author

**Deepak Chennakkadan**

*Built with passion for modern web design and creative technology.*
