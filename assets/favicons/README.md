# Favicon Setup Guide

## Overview
This folder contains the favicon configuration for the portfolio website. The HTML file has been updated with all the necessary favicon links.

## Required Favicon Files

You need to create the following favicon files from your logo/brand image:

### Standard Favicons
- `favicon.ico` - 16x16, 32x32, 48x48 (multi-size ICO file)
- `favicon-16x16.png` - 16x16 pixels
- `favicon-32x32.png` - 32x32 pixels
- `favicon-48x48.png` - 48x48 pixels
- `favicon-96x96.png` - 96x96 pixels
- `favicon-192x192.png` - 192x192 pixels
- `favicon-512x512.png` - 512x512 pixels

### Apple Touch Icons
- `apple-touch-icon-57x57.png` - 57x57 pixels
- `apple-touch-icon-60x60.png` - 60x60 pixels
- `apple-touch-icon-72x72.png` - 72x72 pixels
- `apple-touch-icon-76x76.png` - 76x76 pixels
- `apple-touch-icon-114x114.png` - 114x114 pixels
- `apple-touch-icon-120x120.png` - 120x120 pixels
- `apple-touch-icon-144x144.png` - 144x144 pixels
- `apple-touch-icon-152x152.png` - 152x152 pixels
- `apple-touch-icon-180x180.png` - 180x180 pixels

### Android Chrome Icons
- `android-chrome-192x192.png` - 192x192 pixels
- `android-chrome-512x512.png` - 512x512 pixels

### Microsoft Tiles
- `mstile-70x70.png` - 70x70 pixels
- `mstile-144x144.png` - 144x144 pixels
- `mstile-150x150.png` - 150x150 pixels
- `mstile-310x150.png` - 310x150 pixels
- `mstile-310x310.png` - 310x310 pixels

## How to Generate Favicons

### Option 1: Online Favicon Generators (Recommended)
1. **RealFaviconGenerator** (https://realfavicongenerator.net/)
   - Upload your logo/brand image (minimum 260x260 pixels)
   - Configure settings for different platforms
   - Download the generated favicon package
   - Extract all files to this folder

2. **Favicon.io** (https://favicon.io/)
   - Upload your image or create text-based favicon
   - Download the generated files
   - Extract to this folder

### Option 2: Manual Creation
1. Start with a high-resolution version of your logo (at least 512x512 pixels)
2. Use image editing software like Photoshop, GIMP, or online tools
3. Create each size manually, ensuring the logo remains clear at small sizes
4. Save as PNG files (except favicon.ico which should be ICO format)

## Design Tips
- Use a simple, recognizable design that works at small sizes
- Ensure good contrast against common background colors
- Consider using your initials "DC" or a simplified version of your logo
- Test how it looks at 16x16 pixels (the smallest size)
- Use consistent colors that match your brand

## Current Configuration
- Theme color: #2d89ef (blue)
- Background color: #1a1a1a (dark)
- All favicon links are already added to index.html
- Web app manifest is configured for PWA support

## Next Steps
1. Create or obtain your favicon source image
2. Generate all required sizes using one of the methods above
3. Place all files in this folder
4. Test the favicon by opening your website in different browsers and devices
