document.addEventListener('DOMContentLoaded', function() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    // Hide loading overlay if it's visible
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }

    // Get all navigation buttons
    const navigationButtons = document.querySelectorAll('.course-selection a');

    // Add click event listeners to navigation buttons
    navigationButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Don't show loading overlay for navigation
            // Just let the default navigation happen
            return true;
        });
    });
}); 