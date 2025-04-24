document.addEventListener('DOMContentLoaded', function() {
    // Lấy các phần tử DOM
    const previewBtn = document.getElementById('previewBtn');
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    
    // Xử lý sự kiện cho các nút
    previewBtn.addEventListener('click', function() {
        showPreview();
    });
    
    exportPdfBtn.addEventListener('click', async function() {
        await generatePDF();
    });
    
    // Thêm nút tính điểm trung bình
    setupCalculateAverageButton();
    
    // Xử lý sự kiện radio buttons
    setupRadioButtonListeners();
    
    // Hàm thiết lập các sự kiện lắng nghe cho radio buttons
    function setupRadioButtonListeners() {
        // Lấy tất cả các radio buttons
        const radioButtons = document.querySelectorAll('input[type="radio"]');
        
        // Thêm sự kiện cho từng radio button
        radioButtons.forEach(radio => {
            radio.addEventListener('change', function() {
                // Tính điểm trung bình tự động khi có thay đổi
                calculateAverage();
            });
        });
    }
    
    // Hàm thiết lập nút tính điểm trung bình
    function setupCalculateAverageButton() {
        const calculateAverageBtn = document.createElement('button');
        calculateAverageBtn.textContent = 'Tính điểm trung bình';
        calculateAverageBtn.className = 'calculate-btn';
        
        const scoreValueElement = document.querySelector('.score-value');
        if (scoreValueElement) {
            scoreValueElement.parentNode.after(calculateAverageBtn);
            
            calculateAverageBtn.addEventListener('click', function() {
                calculateAverage();
            });
        }
    }
    
    // Hàm tính điểm trung bình
    function calculateAverage() {
        // Lấy tất cả các nhóm radio buttons theo tên
        const abilityGroups = ['ability1', 'ability2', 'ability3', 'ability4', 'ability5', 'ability6', 'ability7', 'ability8', 'ability9'];
        let totalScore = 0;
        let selectedCount = 0;
        
        // Lặp qua từng nhóm
        abilityGroups.forEach(groupName => {
            // Lấy radio button được chọn trong nhóm
            const selectedRadio = document.querySelector(`input[name="${groupName}"]:checked`);
            
            // Nếu có radio button được chọn, cộng điểm vào tổng
            if (selectedRadio) {
                totalScore += parseInt(selectedRadio.value);
                selectedCount++;
            }
        });
        
        const scoreValueElement = document.querySelector('.score-value');
        
        // Nếu có ít nhất một năng lực được đánh giá
        if (selectedCount > 0) {
            // Tính điểm trung bình và làm tròn đến 2 chữ số thập phân
            const averageScore = (totalScore / selectedCount).toFixed(2);
            
            // Hiển thị điểm trung bình
            scoreValueElement.textContent = averageScore;
            
            // Highlight mức đánh giá tương ứng
            highlightEvaluationLevel(averageScore);
        } else {
            alert('Vui lòng đánh giá ít nhất một năng lực trước khi tính điểm trung bình.');
        }
    }
    
    // Hàm highlight mức đánh giá tương ứng với điểm
    function highlightEvaluationLevel(score) {
        // Xóa tất cả highlight hiện tại
        const evaluationLevels = document.querySelectorAll('.level-section');
        evaluationLevels.forEach(function(level) {
            level.style.backgroundColor = '#f9f9f9';
        });
        
        // Highlight mức đánh giá tương ứng
        score = parseFloat(score);
        
        if (score >= 4 && score <= 5) {
            evaluationLevels[0].style.backgroundColor = '#e7f5e7'; // Mức xuất sắc
        } else if (score >= 3.5 && score < 4) {
            evaluationLevels[1].style.backgroundColor = '#e7f5e7'; // Mức tiềm năng
        } else if (score >= 2.5 && score < 3.5) {
            evaluationLevels[2].style.backgroundColor = '#e7f5e7'; // Mức trung bình
        } else if (score >= 1.5 && score < 2.5) {
            evaluationLevels[3].style.backgroundColor = '#e7f5e7'; // Mức cơ bản
        } else if (score >= 1 && score < 1.5) {
            evaluationLevels[4].style.backgroundColor = '#e7f5e7'; // Mức hạn chế
        }
    }
    
    // Hàm xem trước phiếu đánh giá
    function showPreview() {
        // Kiểm tra xem có ít nhất một năng lực được đánh giá không
        if (hasRatedAbilities()) {
            try {
                window.print();
            } catch (error) {
                console.error('Lỗi khi in phiếu:', error);
                alert('Có lỗi xảy ra khi in phiếu đánh giá. Vui lòng thử lại.');
            }
        } else {
            alert('Vui lòng đánh giá ít nhất một năng lực trong mục B. ĐÁNH GIÁ NĂNG LỰC trước khi xem trước phiếu.');
        }
    }

    // Hàm xuất file PDF
    async function generatePDF() {
        // Kiểm tra xem có ít nhất một năng lực được đánh giá không
        if (!hasRatedAbilities()) {
            alert('Vui lòng đánh giá ít nhất một năng lực trong mục B. ĐÁNH GIÁ NĂNG LỰC trước khi xuất PDF.');
            return;
        }

        try {
            // Ẩn các phần tử không cần thiết khi xuất PDF
            const actionsDiv = document.querySelector('.actions');
            const navigationButtons = document.querySelector('.course-selection');
            const calculateButton = document.querySelector('.calculate-btn');
            
            const originalActionDisplay = actionsDiv.style.display;
            const originalNavDisplay = navigationButtons.style.display;
            const originalCalcDisplay = calculateButton ? calculateButton.style.display : 'none';
            
            actionsDiv.style.display = 'none';
            navigationButtons.style.display = 'none';
            if (calculateButton) calculateButton.style.display = 'none';
            
            // Tạo bản sao của toàn bộ phiếu đánh giá
            const container = document.querySelector('.container');
            const containerClone = container.cloneNode(true);
            
            // Tạo container tạm để render
            const tempContainer = document.createElement('div');
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-9999px';
            tempContainer.style.top = '0';
            document.body.appendChild(tempContainer);
            tempContainer.appendChild(containerClone);
            
            // Đảm bảo các radio buttons được hiển thị đúng
            const checkedRadios = containerClone.querySelectorAll('input[type="radio"]:checked');
            checkedRadios.forEach(radio => {
                const span = radio.nextElementSibling;
                if (span) {
                    span.style.backgroundColor = '#e7f5e7';
                    span.style.color = '#e61e25';
                    span.style.fontWeight = 'bold';
                }
            });
            
            // Tối ưu độ phân giải và kích thước
            containerClone.style.width = '210mm';
            containerClone.style.padding = '15mm';
            containerClone.style.margin = '0';
            containerClone.style.boxShadow = 'none';
            
            // Cho phép hiển thị đầy đủ nội dung
            containerClone.style.overflow = 'visible';
            containerClone.style.height = 'auto';
            
            // Đảm bảo các section hiển thị đầy đủ
            const sections = containerClone.querySelectorAll('.section');
            sections.forEach(section => {
                section.style.pageBreakInside = 'avoid';
                section.style.marginBottom = '20px';
            });
            
            // Đợi để đảm bảo DOM đã cập nhật
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Cấu hình html2canvas với chất lượng cao hơn
            const canvas = await html2canvas(containerClone, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false,
                width: containerClone.offsetWidth,
                height: containerClone.offsetHeight,
                scrollX: 0,
                scrollY: 0,
                x: 0,
                y: 0,
                windowWidth: containerClone.scrollWidth + 100,
                windowHeight: containerClone.scrollHeight + 100
            });
            
            // Khởi tạo jsPDF với kích thước tùy chỉnh dựa trên nội dung
            const { jsPDF } = window.jspdf;
            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            // Tạo PDF với chiều cao động
            const pdf = new jsPDF('p', 'mm', [imgWidth, imgHeight]);
            
            // Thêm nội dung vào PDF
            pdf.addImage(
                canvas,
                'JPEG',
                0,
                0,
                imgWidth,
                imgHeight,
                '',
                'MEDIUM'
            );
            
            // Xóa container tạm
            document.body.removeChild(tempContainer);
            
            // Lấy tên học viên từ input
            const studentName = document.getElementById('hoTen').value || 'HocVien';
            
            // Tạo tên file
            const date = new Date();
            const timestamp = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}_${date.getHours()}-${date.getMinutes()}`;
            const fileName = `PhieuDanhGia_${studentName}_Coding_${timestamp}.pdf`;
            
            // Tải xuống PDF
            pdf.save(fileName);
            
            // Hiển thị lại các nút
            actionsDiv.style.display = originalActionDisplay;
            navigationButtons.style.display = originalNavDisplay;
            if (calculateButton) calculateButton.style.display = originalCalcDisplay;
            
            alert(`Phiếu đánh giá đã được tải xuống thành công!\n\nTên file: ${fileName}`);
        } catch (error) {
            console.error('Lỗi khi tạo PDF:', error);
            alert('Có lỗi xảy ra khi tạo file PDF. Vui lòng thử lại.');
        }
    }

    // Hàm kiểm tra xem có ít nhất một năng lực đã được đánh giá chưa
    function hasRatedAbilities() {
        const abilityGroups = ['ability1', 'ability2', 'ability3', 'ability4', 'ability5', 'ability6', 'ability7', 'ability8', 'ability9'];
        
        // Kiểm tra mỗi nhóm năng lực
        for (const groupName of abilityGroups) {
            const selectedRadio = document.querySelector(`input[name="${groupName}"]:checked`);
            if (selectedRadio) {
                return true; // Có ít nhất một năng lực đã được đánh giá
            }
        }
        
        return false; // Không có năng lực nào được đánh giá
    }
}); 