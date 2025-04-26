window.jsPDF = window.jspdf.jsPDF;

async function generatePDF() {
    try {
        // Show loading overlay
        const loadingOverlay = document.getElementById('loadingOverlay');
        loadingOverlay.style.display = 'flex';

        // Get container and clone content
        const container = document.querySelector('.container');
        const contentClone = container.cloneNode(true);

        // Remove action buttons
        contentClone.querySelectorAll('.actions, .nav-back').forEach(el => el.remove());

        // Create temporary container
        const tempDiv = document.createElement('div');
        tempDiv.appendChild(contentClone);
        document.body.appendChild(tempDiv);

        // Generate canvas
        const canvas = await html2canvas(contentClone, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            height: contentClone.scrollHeight,
            windowHeight: contentClone.scrollHeight
        });

        // Remove temporary container
        document.body.removeChild(tempDiv);

        // Create PDF with content dimensions
        const pdfWidth = 595; // Standard PDF width
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [pdfWidth, pdfHeight]
        });

        // Add image to PDF
        pdf.addImage(
            canvas.toDataURL('image/jpeg', 1.0),
            'JPEG',
            0,
            0,
            pdfWidth,
            pdfHeight,
            undefined,
            'FAST'
        );

        // Save PDF
        pdf.save(`phieu_danh_gia_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.pdf`);

    } catch (error) {
        console.error('PDF Generation Error:', error);
        alert('Có lỗi khi tạo PDF. Vui lòng thử lại!');
    } finally {
        loadingOverlay.style.display = 'none';
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('#exportPdfBtn, #exportPdfBtn4').forEach(btn => {
        if (btn) btn.addEventListener('click', generatePDF);
    });
});