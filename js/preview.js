// Modal and button elements
const modal = document.getElementById('previewModal');
const previewContent = document.getElementById('previewContent');
const closeButton = document.querySelector('.close-button');

// Preview functionality
async function showPreview() {
    // Show loading indicator
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    } else {
        // Create a temporary loading indicator if one doesn't exist
        const tempLoading = document.createElement('div');
        tempLoading.style.position = 'fixed';
        tempLoading.style.top = '50%';
        tempLoading.style.left = '50%';
        tempLoading.style.transform = 'translate(-50%, -50%)';
        tempLoading.style.background = 'rgba(0,0,0,0.7)';
        tempLoading.style.color = 'white';
        tempLoading.style.padding = '20px';
        tempLoading.style.borderRadius = '5px';
        tempLoading.style.zIndex = '9999';
        tempLoading.textContent = 'Đang tạo bản xem trước...';
        document.body.appendChild(tempLoading);
        
        setTimeout(() => {
            document.body.removeChild(tempLoading);
        }, 3000);
    }

    try {
        const container = document.querySelector('.container');
        if (!container) {
            throw new Error('Container not found');
        }

        // Create a clone of the container for preview
        const clone = container.cloneNode(true);
        
        // Remove action buttons from preview
        const actions = clone.querySelector('.actions');
        if (actions) {
            actions.remove();
        }

        // Clear previous content
        previewContent.innerHTML = '';
        
        // Use html2canvas for a more accurate preview
        if (window.html2canvas) {
            try {
                const canvas = await html2canvas(container, {
                    scale: 1.5,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff'
                });
                
                // Adjust canvas to fit preview window
                canvas.style.width = '100%';
                canvas.style.height = 'auto';
                
                previewContent.appendChild(canvas);
            } catch (canvasError) {
                console.error('Error creating canvas preview:', canvasError);
                // Fallback to DOM clone if html2canvas fails
                previewContent.appendChild(clone);
            }
        } else {
            // Fallback if html2canvas is not available
            previewContent.appendChild(clone);
        }
        
        // Show modal
        modal.style.display = 'block';
    } catch (error) {
        console.error('Preview error:', error);
        alert('Có lỗi khi tạo bản xem trước. Vui lòng thử lại.');
    } finally {
        // Hide loading indicator
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }
}

// Close modal when clicking close button
if (closeButton) {
    closeButton.onclick = function() {
        modal.style.display = 'none';
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Close modal when pressing ESC key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modal && modal.style.display === 'block') {
        modal.style.display = 'none';
    }
});

// Add event listeners to preview buttons
document.addEventListener('DOMContentLoaded', function() {
    const previewButtons = [
        document.getElementById('previewBtn'),
        document.getElementById('previewBtn4')
    ];

    previewButtons.forEach(button => {
        if (button) {
            button.addEventListener('click', showPreview);
        }
    });
}); 