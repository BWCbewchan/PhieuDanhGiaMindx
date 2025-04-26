document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('previewModal');
    const previewBtn = document.getElementById('previewBtn');
    const closeBtn = document.querySelector('.close-button');
    const previewContent = document.getElementById('previewContent');

    if (previewBtn) {
        previewBtn.addEventListener('click', function() {
            const contentToPreview = document.querySelector('.container').cloneNode(true);
            
            // Remove buttons from preview
            const buttonsToRemove = contentToPreview.querySelectorAll('.actions, .nav-back');
            buttonsToRemove.forEach(btn => btn.remove());
            
            // Make all inputs readonly
            const inputs = contentToPreview.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                if (input.type === 'radio') {
                    input.disabled = true;
                } else {
                    input.setAttribute('readonly', true);
                }
            });
            
            previewContent.innerHTML = '';
            previewContent.appendChild(contentToPreview);
            modal.style.display = 'block';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});