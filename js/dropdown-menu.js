// Dropdown Menu Functionality
// Handles click-to-open dropdowns that close on outside click or scroll

document.addEventListener('DOMContentLoaded', function() {
    // Get all dropdown menu items
    const dropdownItems = document.querySelectorAll('.menu-item-has-children');
    let activeDropdown = null;
    let isDropdownOpen = false;

    // Function to close all dropdowns
    function closeAllDropdowns() {
        dropdownItems.forEach(item => {
            const subMenu = item.querySelector('.sub-menu');
            if (subMenu) {
                subMenu.style.transform = 'translateX(-50%) translateY(-101%)';
                subMenu.style.visibility = 'hidden';
                subMenu.style.opacity = '0';
                item.classList.remove('dropdown-active');
            }
        });
        activeDropdown = null;
        isDropdownOpen = false;
    }

    // Function to open a specific dropdown
    function openDropdown(item) {
        const subMenu = item.querySelector('.sub-menu');
        if (subMenu) {
            // Close any other open dropdown first
            closeAllDropdowns();
            
            // Open this dropdown
            subMenu.style.transform = 'translateX(-50%) translateY(0)';
            subMenu.style.visibility = 'visible';
            subMenu.style.opacity = '1';
            item.classList.add('dropdown-active');
            activeDropdown = item;
            isDropdownOpen = true;
        }
    }

    // Function to toggle dropdown
    function toggleDropdown(item) {
        const subMenu = item.querySelector('.sub-menu');
        if (subMenu) {
            const isCurrentlyOpen = item.classList.contains('dropdown-active');
            
            if (isCurrentlyOpen) {
                closeAllDropdowns();
            } else {
                openDropdown(item);
            }
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

    // Close dropdown when scrolling
    let scrollTimeout;
    document.addEventListener('scroll', function() {
        if (isDropdownOpen) {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                closeAllDropdowns();
            }, 100); // Small delay to prevent immediate closing
        }
    });

    // Close dropdown on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isDropdownOpen) {
            closeAllDropdowns();
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (isDropdownOpen) {
            closeAllDropdowns();
        }
    });
});
