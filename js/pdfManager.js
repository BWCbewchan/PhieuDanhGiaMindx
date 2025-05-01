window.jsPDF = window.jspdf.jsPDF;

// Load Vietnamese font
async function loadVietnameseFont() {
    const fontResponse = await fetch('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
    const fontCSS = await fontResponse.text();
    const fontUrl = fontCSS.match(/url\((.*?)\)/)[1];
    const font = await fetch(fontUrl);
    const fontData = await font.arrayBuffer();
    return fontData;
}

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

        // Generate canvas for main content
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

        // Create evaluation text canvas
        const evalDiv = document.createElement('div');
        evalDiv.style.width = '535px'; // pdfWidth - 2*margin
        evalDiv.style.padding = '20px';
        evalDiv.style.fontFamily = 'Arial, sans-serif';
        evalDiv.style.fontSize = '13px';
        evalDiv.style.lineHeight = '1.5';
        evalDiv.style.color = '#333333';
        evalDiv.style.backgroundColor = '#ffffff';
        evalDiv.innerHTML = `
            <div style="background-color: #ff0000; color: white; padding: 10px; font-weight: bold; font-size: 16px; text-align: center; margin-bottom: 10px;">
                ĐÁNH GIÁ CHUNG
            </div>
            <div style="border: 1px solid #ff0000; padding: 15px; min-height: 100px;">
                ${nhanXet.replace(/\\n/g, '<br>')}
            </div>
        `;
        document.body.appendChild(evalDiv);

        // Generate canvas for evaluation
        const evalCanvas = await html2canvas(evalDiv, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff'
        });

        // Remove evaluation div
        document.body.removeChild(evalDiv);

        // Create PDF with content dimensions
        const pdfWidth = 595; // Standard PDF width
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [pdfWidth, pdfHeight + evalCanvas.height + 40], // Add space for evaluation
            putOnlyUsedFonts: true,
            compress: true
        });

        // Add main content image to PDF
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

        // Add evaluation image to PDF
        pdf.addImage(
            evalCanvas.toDataURL('image/jpeg', 1.0),
            'JPEG',
            30, // margin
            pdfHeight + 20,
            pdfWidth - 60, // width minus margins
            evalCanvas.height * (pdfWidth - 60) / evalCanvas.width,
            undefined,
            'FAST'
        );

        // Save PDF with Vietnamese filename
        const filename = `phieu_danh_gia_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.pdf`;
        pdf.save(filename);

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