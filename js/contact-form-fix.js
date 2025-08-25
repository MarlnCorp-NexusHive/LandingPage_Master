// Contact Form 7 Fix - Disable CORS errors
// This script prevents Contact Form 7 from making requests to valmax.agency

(function() {
    'use strict';
    
    // Override wpcf7 configuration to prevent CORS errors
    if (typeof window.wpcf7 !== 'undefined') {
        // Disable the API calls
        window.wpcf7.api = {
            root: '',
            namespace: ''
        };
    }
    
    // Prevent any fetch requests to valmax.agency
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        if (typeof url === 'string' && url.includes('valmax.agency')) {
            return Promise.reject(new Error('Request blocked to prevent CORS errors'));
        }
        return originalFetch.apply(this, arguments);
    };
    
    // Disable Contact Form 7 initialization
    if (typeof window.wpcf7 !== 'undefined' && window.wpcf7.init) {
        const originalInit = window.wpcf7.init;
        window.wpcf7.init = function() {
            return false;
        };
    }
    
    // Contact Form 7 CORS fix applied
})();
