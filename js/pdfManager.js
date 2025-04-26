// PDF Manager Module
const PDFManager = {
    init() {
        this.setupEventListeners();
    },

    setupEventListeners() {
        // Preview buttons for all forms
        const previewButtons = document.querySelectorAll('[id^="previewBtn"]');
        previewButtons.forEach(btn => {
            btn.addEventListener('click', () => this.handlePreview());
        });

        // Export buttons for all forms
        const exportButtons = document.querySelectorAll('[id^="exportPdfBtn"]');
        exportButtons.forEach(btn => {
            btn.addEventListener('click', () => this.handleExport());
        });

        // Close button in preview modal
        const closeButton = document.querySelector('.close-button');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.closePreview());
        }

        // Cancel preview button
        const cancelPreview = document.getElementById('cancelPreview');
        if (cancelPreview) {
            cancelPreview.addEventListener('click', () => this.closePreview());
        }

        // Confirm export from preview
        const confirmExport = document.getElementById('confirmExport');
        if (confirmExport) {
            confirmExport.addEventListener('click', () => this.handleExport());
        }
    },

    async handlePreview() {
        const previewModal = document.getElementById('previewModal');
        const previewContent = document.getElementById('previewContent');
        
        // Create loading overlay if it doesn't exist
        this.showLoading();

        try {
            const container = document.querySelector('.container');
            if (!container) throw new Error('Container not found');

            // Use optimized settings from PDFUtils
            const canvas = await html2canvas(container, PDFUtils.getOptimizedCanvasSettings());

            if (previewContent) {
                previewContent.innerHTML = '';
                previewContent.appendChild(canvas);
            }

            if (previewModal) {
                previewModal.style.display = 'block';
            }

        } catch (error) {
            console.error('Preview generation error:', error);
            alert('Có lỗi khi tạo bản xem trước. Vui lòng thử lại.');
        } finally {
            this.hideLoading();
        }
    },

    async handleExport() {
        // Show loading overlay
        this.showLoading();

        try {
            const { jsPDF } = window.jspdf;
            const container = document.querySelector('.container');
            if (!container) throw new Error('Container not found');

            // Get the actual dimensions of the container
            const containerWidth = container.offsetWidth;
            const containerHeight = container.offsetHeight;
            
            // Calculate the best scale factor for quality
            const scale = 2; // Higher scale for better quality

            // Clone the container to avoid modifying the original
            const clonedContainer = container.cloneNode(true);
            const tempDiv = document.createElement('div');
            tempDiv.style.position = 'absolute';
            tempDiv.style.left = '-9999px';
            tempDiv.appendChild(clonedContainer);
            document.body.appendChild(tempDiv);
            
            // Prepare elements for export
            PDFUtils.prepareElementForExport(clonedContainer);

            // Create canvas with higher quality
            const canvas = await html2canvas(clonedContainer, {
                ...PDFUtils.getOptimizedCanvasSettings(),
                width: containerWidth,
                height: containerHeight,
                scrollX: 0,
                scrollY: 0
            });
            
            // Remove the temp div
            document.body.removeChild(tempDiv);

            // Calculate PDF dimensions based on the canvas (at scale=2)
            const pdfWidth = canvas.width / scale;
            const pdfHeight = canvas.height / scale;

            // Create PDF with proper dimensions
            const pdf = new jsPDF({
                orientation: pdfHeight > pdfWidth ? 'portrait' : 'landscape',
                unit: 'pt',
                format: [pdfWidth, pdfHeight]
            });

            // Add the image to fill the entire PDF
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

            // Get form type for filename
            const formType = this.getFormType();
            const filename = PDFUtils.generatePdfFilename(formType);

            // Save the PDF with Vietnamese characters in filename
            pdf.save(filename);
            this.closePreview();
            
            // Show success message
            PDFUtils.showSuccessMessage(filename);

        } catch (error) {
            console.error('PDF generation error:', error);
            alert('Có lỗi khi tạo PDF. Vui lòng thử lại.');
        } finally {
            this.hideLoading();
        }
    },

    getFormType() {
        if (document.querySelector('.container')?.id === 'robotics4Form') {
            return 'robotics4';
        } else if (document.querySelector('title')?.textContent.includes('Coding')) {
            return 'coding';
        } else if (document.querySelector('title')?.textContent.includes('Digital Art')) {
            return 'art';
        } else {
            return 'roboticsK12';
        }
    },

    closePreview() {
        const previewModal = document.getElementById('previewModal');
        if (previewModal) {
            previewModal.style.display = 'none';
        }
    },
    
    showLoading() {
        let loadingOverlay = document.getElementById('loadingOverlay');
        
        // Create loading overlay if it doesn't exist
        if (!loadingOverlay) {
            loadingOverlay = document.createElement('div');
            loadingOverlay.id = 'loadingOverlay';
            loadingOverlay.className = 'loading-overlay';
            
            const loadingContent = document.createElement('div');
            loadingContent.className = 'loading-content';
            
            const spinner = document.createElement('div');
            spinner.className = 'spinner';
            
            const loadingText = document.createElement('div');
            loadingText.textContent = 'Đang xử lý...';
            
            loadingContent.appendChild(spinner);
            loadingContent.appendChild(loadingText);
            loadingOverlay.appendChild(loadingContent);
            
            document.body.appendChild(loadingOverlay);
        }
        
        loadingOverlay.style.display = 'flex';
    },
    
    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => PDFManager.init()); 