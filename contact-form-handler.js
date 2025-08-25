// Contact Form Handler for Static Hosting
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="btn-text">Sending...</span>';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with your actual form handling)
            setTimeout(() => {
                // Hide form and show success message
                contactForm.style.display = 'none';
                successMessage.style.display = 'block';
                
                // Reset form
                contactForm.reset();
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Optional: Send to your backend service
                // You can integrate with AWS Lambda, Formspree, or other services here
                sendToBackend(name, email, message);
                
            }, 1500);
        });
    }
    
    // Function to send data to backend (customize this for your needs)
    function sendToBackend(name, email, message) {
        // Option 1: AWS Lambda + API Gateway
        // Option 2: Formspree (free tier available)
        // Option 3: EmailJS (free tier available)
        // Option 4: Custom backend service
        
        console.log('Form data to send:', { name, email, message });
        
        // Example: Send to Formspree (free service)
        // fetch('https://formspree.io/f/YOUR_FORM_ID', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ name, email, message })
        // })
        // .then(response => response.json())
        // .then(data => console.log('Success:', data))
        // .catch(error => console.error('Error:', error));
    }
    
    // Add error handling for missing images
    function handleMissingImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('error', function() {
                console.warn('Image failed to load:', this.src);
                // Optionally hide broken images or show placeholder
                // this.style.display = 'none';
            });
        });
    }
    
    // Initialize image error handling
    handleMissingImages();
    
    // Add promise error handling
    window.addEventListener('unhandledrejection', function(event) {
        console.warn('Unhandled promise rejection:', event.reason);
        // Prevent the default browser handling
        event.preventDefault();
    });
});

// Enhanced error handling for async operations
window.addEventListener('error', function(event) {
    console.warn('JavaScript error:', event.error);
});

// Handle missing SVG files gracefully
document.addEventListener('DOMContentLoaded', function() {
    const svgImages = document.querySelectorAll('img[src*=".svg"]');
    svgImages.forEach(img => {
        img.addEventListener('error', function() {
            console.warn('SVG failed to load:', this.src);
            // You can set a fallback image here if needed
            // this.src = 'images/fallback-icon.png';
        });
    });
});
