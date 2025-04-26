document.addEventListener('DOMContentLoaded', function() {
    initializeFormInteractions();
    
    // Load saved form data on page load
    loadFormData();
    
    // Add event listeners to all form elements for auto-save
    setupAutoSave();
});

/**
 * Initialize form interactions like checkboxes
 */
function initializeFormInteractions() {
    // Handle checkbox clicks
    document.querySelectorAll('.checkbox').forEach(checkbox => {
        checkbox.addEventListener('click', function() {
            // Remove checked class from other checkboxes in the same section
            const section = this.closest('.section');
            if (section) {
                section.querySelectorAll('.checkbox').forEach(cb => {
                    cb.classList.remove('checked');
                });
            }
            this.classList.add('checked');
            
            // Save form data after checking
            saveFormData();
        });
    });

    // Handle chart checkboxes
    document.querySelectorAll('.chart-checkbox').forEach(checkbox => {
        checkbox.addEventListener('click', function() {
            // Remove checked class from other chart checkboxes
            document.querySelectorAll('.chart-checkbox').forEach(cb => {
                cb.classList.remove('checked');
            });
            this.classList.add('checked');
            
            // Save form data after checking
            saveFormData();
        });
    });

    // Preview button functionality - now handled by preview.js
    const previewBtn = document.getElementById('previewBtn');
    const previewModal = document.getElementById('previewModal');
    const closeButton = document.querySelector('.close-button');
    
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            previewModal.style.display = 'none';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === previewModal) {
            previewModal.style.display = 'none';
        }
    });
}

/**
 * Setup auto-save for form inputs
 */
function setupAutoSave() {
    const formInputs = document.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            saveFormData();
        });
        
        // Also save on blur (when leaving the field)
        input.addEventListener('blur', function() {
            saveFormData();
        });
    });
}

/**
 * Save form data to localStorage
 */
function saveFormData() {
    try {
        const formData = {
            student_name: document.querySelector('input[name="student_name"]')?.value || '',
            age: document.querySelector('input[name="age"]')?.value || '',
            experience_date: document.querySelector('input[name="experience_date"]')?.value || '',
            teacher_name: document.querySelector('input[name="teacher_name"]')?.value || '',
            location: document.querySelector('input[name="location"]')?.value || '',
            subject: document.querySelector('input[name="subject"]')?.value || '',
            evaluation: document.querySelector('textarea')?.value || '',
            checkboxes: Array.from(document.querySelectorAll('.checkbox.checked')).map(cb => {
                const section = cb.closest('.section');
                const criteriaText = cb.previousElementSibling?.textContent || '';
                return { 
                    section: section?.querySelector('.section-header')?.textContent || '', 
                    criteria: criteriaText 
                };
            }),
            chartCheckbox: document.querySelector('.chart-checkbox.checked') ? 
                Array.from(document.querySelectorAll('.chart-checkbox')).indexOf(document.querySelector('.chart-checkbox.checked')) : -1
        };
        
        localStorage.setItem('artEvaluationForm', JSON.stringify(formData));
    } catch (error) {
        console.error('Error saving form data:', error);
    }
}

/**
 * Load saved form data from localStorage
 */
function loadFormData() {
    try {
        const savedData = localStorage.getItem('artEvaluationForm');
        if (!savedData) return;
        
        const formData = JSON.parse(savedData);
        
        // Restore text inputs and textarea
        if (document.querySelector('input[name="student_name"]')) {
            document.querySelector('input[name="student_name"]').value = formData.student_name || '';
        }
        
        if (document.querySelector('input[name="age"]')) {
            document.querySelector('input[name="age"]').value = formData.age || '';
        }
        
        if (document.querySelector('input[name="experience_date"]')) {
            document.querySelector('input[name="experience_date"]').value = formData.experience_date || '';
        }
        
        if (document.querySelector('input[name="teacher_name"]')) {
            document.querySelector('input[name="teacher_name"]').value = formData.teacher_name || '';
        }
        
        if (document.querySelector('input[name="location"]')) {
            document.querySelector('input[name="location"]').value = formData.location || '';
        }
        
        if (document.querySelector('input[name="subject"]')) {
            document.querySelector('input[name="subject"]').value = formData.subject || '';
        }
        
        if (document.querySelector('textarea')) {
            document.querySelector('textarea').value = formData.evaluation || '';
        }
        
        // Restore checkboxes
        if (formData.checkboxes && Array.isArray(formData.checkboxes)) {
            formData.checkboxes.forEach(cb => {
                if (!cb.section || !cb.criteria) return;
                
                const section = Array.from(document.querySelectorAll('.section-header'))
                    .find(header => header.textContent === cb.section)
                    ?.closest('.section');
                    
                if (section) {
                    const checkbox = Array.from(section.querySelectorAll('.criteria-row'))
                        .find(row => row.querySelector('.criteria-text')?.textContent === cb.criteria)
                        ?.querySelector('.checkbox');
                        
                    if (checkbox) {
                        checkbox.classList.add('checked');
                    }
                }
            });
        }
        
        // Restore chart checkbox
        if (formData.chartCheckbox >= 0) {
            const chartCheckboxes = document.querySelectorAll('.chart-checkbox');
            if (chartCheckboxes[formData.chartCheckbox]) {
                chartCheckboxes[formData.chartCheckbox].classList.add('checked');
            }
        }
    } catch (error) {
        console.error('Error loading form data:', error);
    }
} 