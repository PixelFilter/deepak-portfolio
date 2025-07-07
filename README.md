# Deepak Chennakkadan - Personal Website

A modern, interactive personal website featuring a dynamic 3D fluid orb animation and timeline interface.

## Project Structure

```
Deepak_Website/
├── index.html          # Main HTML file
├── styles.css          # All CSS styles and responsive design
├── script.js           # JavaScript application logic
├── README.md          # Project documentation
└── assets/
    └── images/
        └── game-posters/
            ├── forza-horizon-5.png
            ├── forza-motorsport-7.png
            └── forza-motorsport.png
```

## Features

- **Interactive Timeline**: Year-based navigation with smooth scrolling
- **Responsive Design**: Optimized for all device sizes
- **Modern UI**: Clean, minimalist interface with glassmorphism effects
- **Smooth Animations**: Fluid transitions and interactions

## Technical Details

### Dependencies
- Inter Font - Typography

### Classes and Architecture
- Lighting system with multiple light sources
- Fluid animation algorithm
- Responsive camera positioning

#### `TimelineManager`
Handles timeline interactions:
- Scroll-based year navigation
- Click interactions for year items
- Smooth scrolling animations
- Timeline horizontal scrolling

#### `App`
Main application controller:
- Initializes all components
- Manages loading states
- Coordinates between different modules

## Animation System

The fluid orb uses a complex multi-layered animation system:

1. **Magnetic Fields**: Multiple sine/cosine wave combinations
2. **Dramatic Spikes**: Mathematically enhanced deformation points
3. **Flow Waves**: Layered wave patterns for fluid motion
4. **Organic Perturbations**: High-frequency noise for natural movement

## Responsive Design

The website adapts to various screen sizes:
- **Desktop**: Full-featured experience with larger elements
- **Tablet**: Optimized spacing and touch-friendly interactions
- **Mobile**: Compact timeline and adjusted orb sizing
- **Landscape**: Special handling for landscape mobile orientation

## Browser Support

- Modern browsers with WebGL support
- Chrome, Firefox, Safari, Edge
- Mobile browsers on iOS and Android

## Getting Started

1. Clone or download the project
2. Open `index.html` in a web browser
3. No build process required - runs directly in the browser

## Development

To modify the project:

1. **Styling**: Edit `styles.css` for visual changes
2. **Timeline**: Adjust `TimelineManager` class for interaction changes
3. **Content**: Update HTML structure in `index.html`

## Performance Considerations

- Optimized animation loop and responsive design
- Responsive camera positioning to maintain performance

## License

Personal project - All rights reserved
- **Responsive Design**: Fully responsive layout that adapts to all screen sizes
- **Interactive**: Subtle mouse interaction effects
- **Clean Typography**: Modern Inter font for the title

## Technologies Used

- **CSS3**: Gradient backgrounds and responsive design
- **JavaScript**: Animation and interaction logic

## Getting Started

Simply open `index.html` in any modern web browser. No build process or dependencies required.

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Design Philosophy

The website embodies a minimalist, futuristic aesthetic with:
- Monochromatic color scheme (greys and whites)
- Clean, geometric shapes
- Subtle animations
- Focus on the 3D orb as the central element

## Author

**Deepak Chennakkadan**

---

*Built with passion for modern web design and 3D graphics*
