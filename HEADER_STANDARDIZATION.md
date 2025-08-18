# Header Standardization Documentation

## Overview
This document tracks the standardization of header and dropdown menu styling across all HTML pages to match the main page (`index.html`).

## Identified Variations

### Contact Link Variations
- **Main page**: Uses `href="index.html#contact"` for contact links
- **Other pages**: Some use `href="#contact"` which doesn't work properly

### Dropdown Menu Color Variations
- **Main page**: Uses `#9EE86F` (light green) for dropdown background
- **Other pages**: Used `#6aa84f` (darker green) for dropdown background

## Standardized Structure

### Contact Links
All contact links should use:
```html
<a href="index.html#contact" class="contact-scroll-btn">Contact us</a>
```

### Dropdown Menu Colors
All dropdown menus should use:
```css
.header--menu__list > li > .sub-menu { background-color: #9EE86F !important; }
```

## Implementation Status

### Contact Link Standardization
- ✅ `about-us.html` - Updated contact links in main navigation and burger menus
- ✅ `ai-powered-consulting.html` - Updated contact links in main navigation and burger menus
- ⏳ `engineering-services.html` - Pending
- ⏳ `data-analytics.html` - Pending

- ⏳ `marln-company-profile.html` - Pending
- ⏳ `corporate-social-responsibility.html` - Pending
- ⏳ `technology-partners.html` - Pending
- ⏳ `industry.html` - Pending

### Dropdown Color Standardization
- ✅ `index.html` - Reference (uses #9EE86F)
- ✅ `about-us.html` - Already using correct color
- ✅ `ai-powered-consulting.html` - Updated to #9EE86F
- ✅ `engineering-services.html` - Updated to #9EE86F
- ✅ `data-analytics.html` - Updated to #9EE86F

- ✅ `marln-company-profile.html` - Updated to #9EE86F
- ✅ `corporate-social-responsibility.html` - Updated to #9EE86F
- ✅ `technology-partners.html` - Updated to #9EE86F
- ✅ `industry.html` - Updated to #9EE86F

## CSS Rules Applied

### Contact Link Updates
```css
/* Main navigation contact link */
<a href="index.html#contact" class="contact-scroll-btn">Contact us</a>

/* Desktop burger menu contact link */
<a href="index.html#contact">Contact us</a>

/* Mobile burger menu contact link */
<a href="index.html#contact">Contact us</a>
```

### Dropdown Color Updates
```css
/* Standardized dropdown background color */
.header--menu__list > li > .sub-menu { background-color: #9EE86F !important; }
```

## Next Steps
1. Complete contact link standardization for remaining pages
2. Verify all dropdown colors are consistent across all pages
3. Test navigation functionality across all pages
