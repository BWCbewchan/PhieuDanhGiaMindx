// PDF export functionality
document.getElementById('exportPdfBtn').addEventListener('click', async function() {
    const { jsPDF } = window.jspdf;
    
    try {
        // Create a new PDF document
        const pdf = new jsPDF('p', 'mm', 'a4');
        const container = document.querySelector('.container');
        
        // Get the canvas from html2canvas
        const canvas = await html2canvas(container, {
            scale: 2,
            useCORS: true,
            logging: false,
            allowTaint: true,
            backgroundColor: '#ffffff'
        });

        // Calculate dimensions
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = canvas.height * imgWidth / canvas.width;
        
        // Add the image to the PDF
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        
        // If the content is longer than one page, add new pages
        let heightLeft = imgHeight;
        let position = -pageHeight;
        
        while (heightLeft > pageHeight) {
            position = position - pageHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        // Get student name for the filename
        const studentName = document.querySelector('input[name="student_name"]').value || 'evaluation';
        const date = new Date().toISOString().split('T')[0];
        
        // Save the PDF
        pdf.save(`${studentName}-art-evaluation-${date}.pdf`);
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Có lỗi khi tạo PDF. Vui lòng thử lại sau.');
    }
}); 