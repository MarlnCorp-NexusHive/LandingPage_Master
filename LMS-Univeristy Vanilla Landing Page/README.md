# MARLN University LMS - Vanilla HTML/CSS/JS Version

This is a vanilla HTML, CSS, and JavaScript version of the MARLN University LMS landing page, converted from the original React/Next.js application.

## Features

- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Dark/Light Theme**: Toggle between light and dark themes with persistent storage
- **Multilingual Support**: English and Arabic language support with RTL considerations
- **Interactive Components**: 
  - Mobile navigation menu
  - FAQ accordion
  - Contact and Terms modals
  - Cookie consent popup
- **Smooth Animations**: CSS transitions and JavaScript-powered scroll animations
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support
- **Modern CSS**: Custom CSS with CSS Grid, Flexbox, and modern properties
- **Vanilla JavaScript**: No external dependencies except for Iconify icons

## File Structure

```
vanilla-version/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All CSS styles (converted from Tailwind)
├── js/
│   └── app.js          # All JavaScript functionality
├── images/             # All images and assets
│   ├── *.svg          # Logo and flag images
│   ├── *.png          # Favicons and mockups
│   └── images/        # Feature images
└── README.md          # This file
```

## Getting Started

1. **Clone or download** this vanilla version
2. **Open `index.html`** in a web browser
3. **No build process required** - it's ready to use!

## Features Implemented

### Navigation
- Fixed header with backdrop blur
- Mobile hamburger menu
- Smooth scrolling to sections
- Language and theme toggles

### Hero Section
- Dynamic language switching
- Theme-aware logo
- Responsive image switching (Arabic/English)
- Call-to-action buttons

### Features Section
- Grid layout with feature cards
- Hover animations
- Icon integration

### Large Feature Sections
- Two-column layout on desktop
- Image hover effects
- Feature lists with icons

### FAQ Section
- Accordion functionality
- Smooth expand/collapse animations
- Keyboard navigation support

### Footer
- Multi-column layout
- Social links
- Office locations with flags
- Certifications

### Modals
- Contact form modal
- Terms of service modal
- Backdrop click to close
- Escape key to close

### Additional Features
- Cookie consent popup
- Scroll-triggered animations
- Header hide/show on scroll
- Form validation
- Local storage for preferences

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Dependencies

- **Iconify Icons**: Loaded via CDN for icon support
- **Google Fonts**: Inter and Syne fonts loaded via CDN

## Customization

### Colors
The color scheme is defined in CSS custom properties in `styles.css`. You can easily modify the color palette by updating the CSS variables.

### Content
All text content supports both English and Arabic through `data-en` and `data-ar` attributes. To add new content:

```html
<span data-en="English text" data-ar="النص العربي">English text</span>
```

### Styling
The CSS is organized into logical sections:
- Reset and base styles
- Typography
- Components (buttons, modals, etc.)
- Layout sections
- Responsive design
- Dark theme overrides

## Performance

- **No JavaScript frameworks** - faster initial load
- **Optimized CSS** - minimal unused styles
- **Lazy loading** - images load as needed
- **Efficient animations** - CSS transforms and opacity
- **Minimal dependencies** - only Iconify for icons

## Accessibility

- **ARIA labels** for interactive elements
- **Keyboard navigation** support
- **Screen reader** friendly
- **High contrast** support
- **Focus indicators** for keyboard users

## License

This vanilla version maintains the same license as the original React application.

## Support

For questions or issues with this vanilla version, please refer to the original project documentation or contact the development team.
