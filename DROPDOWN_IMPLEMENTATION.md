# Dropdown Menu Implementation

## Overview
This implementation changes the dropdown menus from hover-based to click-based functionality across all pages. The dropdowns now stay open when clicked and close when:
- Clicking outside the dropdown
- Scrolling the page
- Pressing the Escape key
- Resizing the window

## Files Created/Modified

### New Files:
1. **`js/dropdown-menu.js`** - JavaScript functionality for click-based dropdowns
2. **`css/dropdown-override.css`** - CSS overrides to disable hover behavior and add click-based styles

### Modified Files:
All HTML files have been updated to include the new CSS and JavaScript files:
- `index.html`
- `about-us.html`
- `ai-powered-consulting.html`
- `engineering-services.html`
- `data-analytics.html`
- `diversity-talent-staffing.html`
- `corporate-training.html`
- `online-learning-solutions.html`
- `industry.html`
- `marln-company-profile.html`
- `technology-partners.html`
- `returnship.html`

## Features

### Click-Based Dropdowns
- Dropdowns open when clicking on menu items with children
- Only one dropdown can be open at a time
- Visual feedback shows which dropdown is active

### Auto-Close Behavior
- **Outside Click**: Closes when clicking anywhere outside the dropdown
- **Scroll**: Closes when scrolling the page (with 100ms delay)
- **Escape Key**: Closes when pressing the Escape key
- **Window Resize**: Closes when resizing the browser window

### Responsive Design
- Works on both desktop and mobile devices
- Mobile dropdowns use a different animation (height-based instead of transform)
- Maintains accessibility with proper keyboard navigation

### Visual Styling
- Green background color (#6aa84f) for dropdown menus
- Smooth transitions (0.3s ease-in-out)
- Dark theme support
- Hover effects for dropdown items
- Box shadows and rounded corners for modern appearance

## Technical Implementation

### JavaScript Features:
- Event delegation for better performance
- Prevents event bubbling to avoid conflicts
- Uses CSS classes for state management
- Handles multiple dropdown instances

### CSS Features:
- Uses `!important` declarations to override existing styles
- Maintains existing color scheme and branding
- Smooth animations and transitions
- Mobile-first responsive design

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Graceful degradation for older browsers

## Usage
The dropdown functionality is automatically initialized when the page loads. No additional configuration is required. Users can:

1. Click on "Services" or "Company" menu items to open dropdowns
2. Click on dropdown items to navigate to pages
3. Click outside or scroll to close dropdowns
4. Use Escape key to close active dropdowns

## Maintenance
To modify the dropdown behavior:
- Edit `js/dropdown-menu.js` for JavaScript functionality
- Edit `css/dropdown-override.css` for styling changes
- Both files are included in all HTML pages automatically
