// Favicon Fix - Prevents the animated favicon error
(function() {
    'use strict';
    
    // Favicon fix loading
    
    // Function to clean up problematic favicon links
    function cleanupFaviconLinks() {
        // Remove any existing animated favicon links
        const animatedFaviconLinks = document.querySelectorAll('link[href*="wp-content/themes/valmax/favicon/new-anim"]');
        if (animatedFaviconLinks.length > 0) {
            // Removing animated favicon links
            animatedFaviconLinks.forEach(link => link.remove());
        }
        
        // Remove any links with invalid favicon paths
        const invalidFaviconLinks = document.querySelectorAll('link[href*="wp-content"]');
        if (invalidFaviconLinks.length > 0) {
            // Removing invalid favicon links
            invalidFaviconLinks.forEach(link => {
                if (link.rel && link.rel.includes('icon')) {
                    link.remove();
                }
            });
        }
    }
    
    // Function to set a proper local favicon
    function setLocalFavicon() {
        // Check if we already have a valid favicon
        const existingFavicon = document.querySelector('link[rel*="icon"]');
        if (existingFavicon && existingFavicon.href && !existingFavicon.href.includes('wp-content')) {
            // Valid favicon already exists
            return;
        }
        
        // Set a static favicon using local images
        const faviconLink = document.createElement('link');
        faviconLink.rel = 'icon';
        faviconLink.href = 'images/cropped-Favicon-1-32x32.png';
        faviconLink.sizes = '32x32';
        faviconLink.type = 'image/png';
        
        // Add to head
        document.head.appendChild(faviconLink);
        // Local favicon set successfully
    }
    
    // Override the setInterval that was causing the error
    const originalSetInterval = window.setInterval;
    window.setInterval = function(callback, delay) {
        // Check if this is the favicon animation callback
        if (callback && typeof callback === 'function') {
            const callbackStr = callback.toString();
            if (callbackStr.includes('wp-content/themes/valmax/favicon/new-anim') || 
                callbackStr.includes('fav-1.png') || 
                callbackStr.includes('fav-2.png')) {
                // Favicon animation blocked to prevent errors
                return null; // Return null instead of a valid interval ID
            }
        }
        // For all other setInterval calls, use the original function
        return originalSetInterval.call(this, callback, delay);
    };
    
    // Override fetch to prevent favicon-related requests
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        if (typeof url === 'string' && url.includes('wp-content/themes/valmax/favicon')) {
            // Favicon fetch request blocked
            return Promise.reject(new Error('Favicon request blocked'));
        }
        return originalFetch.call(this, url, options);
    };
    
    // Clean up on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            cleanupFaviconLinks();
            setLocalFavicon();
        });
    } else {
        // DOM is already ready
        cleanupFaviconLinks();
        setLocalFavicon();
    }
    
    // Also clean up after a short delay to catch any dynamically added elements
    setTimeout(function() {
        cleanupFaviconLinks();
        setLocalFavicon();
    }, 100);
    
    // Clean up on page load
    window.addEventListener('load', function() {
        cleanupFaviconLinks();
        setLocalFavicon();
    });
    
    // Favicon fix applied - animated favicon errors prevented
})(); 