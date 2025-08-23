// Dropdown Menu Functionality (Performance Optimized)
// Handles click-to-open dropdowns that close on outside click or scroll

document.addEventListener('DOMContentLoaded', function() {
    // Get all dropdown menu items
    const dropdownItems = document.querySelectorAll('.menu-item-has-children');
    let activeDropdown = null;
    let isDropdownOpen = false;

    // Function to close all dropdowns (optimized)
    function closeAllDropdowns() {
        requestAnimationFrame(() => {
            dropdownItems.forEach(item => {
                const subMenu = item.querySelector('.sub-menu');
                if (subMenu) {
                    // Use CSS classes instead of inline styles to prevent reflow
                    item.classList.remove('dropdown-active');
                }
            });
            activeDropdown = null;
            isDropdownOpen = false;
        });
    }

    // Function to open a specific dropdown (optimized)
    function openDropdown(item) {
        requestAnimationFrame(() => {
            const subMenu = item.querySelector('.sub-menu');
            if (subMenu) {
                // Close any other open dropdown first
                dropdownItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('dropdown-active');
                    }
                });
                
                // Open this dropdown using CSS class
                item.classList.add('dropdown-active');
                activeDropdown = item;
                isDropdownOpen = true;
            }
        });
    }

    // Function to toggle dropdown
    function toggleDropdown(item) {
        const isCurrentlyOpen = item.classList.contains('dropdown-active');
        
        if (isCurrentlyOpen) {
            closeAllDropdowns();
        } else {
            openDropdown(item);
        }
    }

    // Add click event listeners to dropdown triggers
    dropdownItems.forEach(item => {
        const trigger = item.querySelector('a');
        if (trigger) {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleDropdown(item);
            });
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (isDropdownOpen && activeDropdown && !activeDropdown.contains(e.target)) {
            closeAllDropdowns();
        }
    });

    // Close dropdown when scrolling (debounced)
    let scrollTimeout;
    document.addEventListener('scroll', function() {
        if (isDropdownOpen) {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                closeAllDropdowns();
            }, 100); // Small delay to prevent immediate closing
        }
    }, { passive: true });

    // Close dropdown on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isDropdownOpen) {
            closeAllDropdowns();
        }
    });

    // Handle window resize (debounced)
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (isDropdownOpen) {
                closeAllDropdowns();
            }
        }, 150);
    }, { passive: true });
});
