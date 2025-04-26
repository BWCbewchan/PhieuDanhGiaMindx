/**
 * PDF Utilities for improved PDF generation and export
 */
const PDFUtils = {
    /**
     * Improves image quality for PDF export
     * @param {HTMLElement} element - The element to process
     */
    prepareElementForExport(element) {
        if (!element) return;
        
        // Find all images and set them to load completely
        const images = element.querySelectorAll('img');
        images.forEach(img => {
            // Ensure image is completely loaded
            if (!img.complete) {
                img.src = img.src;
            }
            
            // Remove any max-width/max-height that might limit image quality
            img.style.maxWidth = 'none';
            img.style.maxHeight = 'none';
        });
        
        // Fix any input displays for PDF
        const inputs = element.querySelectorAll('input[type="text"], input[type="date"]');
        inputs.forEach(input => {
            // Add a visible border to empty inputs
            if (!input.value.trim()) {
                input.style.border = '1px solid #ccc';
            }
        });
        
        // Ensure checkbox states are visible
        const checkboxes = element.querySelectorAll('.checkbox, .chart-checkbox');
        checkboxes.forEach(checkbox => {
            if (checkbox.classList.contains('checked')) {
                checkbox.style.backgroundColor = '#4CAF50';
                checkbox.style.borderColor = '#4CAF50';
            } else {
                checkbox.style.border = '2px solid #ccc';
            }
        });
        
        // Ensure radio buttons are visible
        const radioButtons = element.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(radio => {
            if (radio.checked) {
                const label = radio.nextElementSibling;
                if (label) {
                    label.style.backgroundColor = '#4CAF50';
                    label.style.borderColor = '#4CAF50';
                }
            }
        });
    },
    
    /**
     * Optimize settings for html2canvas
     * @returns {Object} - Optimized settings
     */
    getOptimizedCanvasSettings() {
        return {
            scale: 2, // Higher scale for better quality
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
            letterRendering: true,
            imageTimeout: 0,
            removeContainer: true, // Helps with performance
            foreignObjectRendering: false, // More reliable in most browsers
        };
    },
    
    /**
     * Creates a filename for the PDF based on form data
     * @param {string} formType - Type of form
     * @returns {string} - Generated filename
     */
    generatePdfFilename(formType = '') {
        const studentName = document.querySelector('input[id="hoTen"]')?.value || 
                          document.querySelector('input[name="student_name"]')?.value || 
                          'evaluation';
        const sanitizedName = studentName.trim().replace(/[^\w\s-]/g, '') || 'evaluation';
        const date = new Date().toISOString().split('T')[0];
        
        return `${sanitizedName}-${formType}-${date}.pdf`;
    },
    
    /**
     * Shows a success message after PDF generation
     * @param {string} filename - Name of the generated file
     */
    showSuccessMessage(filename) {
        const message = document.createElement('div');
        message.style.position = 'fixed';
        message.style.bottom = '20px';
        message.style.right = '20px';
        message.style.backgroundColor = '#4CAF50';
        message.style.color = 'white';
        message.style.padding = '10px 20px';
        message.style.borderRadius = '4px';
        message.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        message.style.zIndex = '10000';
        message.textContent = `PDF đã được tạo thành công: ${filename}`;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.opacity = '0';
            message.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                document.body.removeChild(message);
            }, 500);
        }, 3000);
    }
};

// Export utils if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PDFUtils;
} 