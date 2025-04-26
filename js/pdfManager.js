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

        // --- Lấy nhận xét ---
        const textarea = document.querySelector('.evaluation-content textarea');
        const nhanXet = textarea ? textarea.value : '';

        // Ẩn box nhận xét trong clone để không bị html2canvas chụp lại
        const evalBox = contentClone.querySelector('.evaluation-box');
        if (evalBox) evalBox.style.display = 'none';

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
            format: [pdfWidth, pdfHeight + 180] // tăng chiều cao để đủ chỗ cho nhận xét
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

        // --- Vẽ box nhận xét ---
        const margin = 30;
        const boxTop = pdfHeight + 20;
        const boxHeight = 140;
        const boxWidth = pdfWidth - margin * 2;

        // Header
        pdf.setFillColor(255, 0, 0);
        pdf.rect(margin, boxTop, boxWidth, 32, 'F');
        pdf.setTextColor(255,255,255);
        pdf.setFont('Times','bold');
        pdf.setFontSize(16);
        pdf.text('ĐÁNH GIÁ CHUNG', margin + 15, boxTop + 22);

        // Content box
        pdf.setDrawColor(255,0,0);
        pdf.setLineWidth(1);
        pdf.rect(margin, boxTop + 32, boxWidth, boxHeight, 'D');
        pdf.setFont('Times','normal');
        pdf.setFontSize(13);
        pdf.setTextColor(51,51,51);
        const textX = margin + 15;
        const textY = boxTop + 32 + 25;
        const maxWidth = boxWidth - 30;
        pdf.text(pdf.splitTextToSize(nhanXet, maxWidth), textX, textY, {maxWidth: maxWidth, lineHeightFactor:1.5});

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