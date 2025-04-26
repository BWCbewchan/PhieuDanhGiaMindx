document.addEventListener('DOMContentLoaded', function() {
    // Lấy các phần tử DOM
    const previewBtn = document.getElementById('previewBtn');
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    const previewBtn4 = document.getElementById('previewBtn4');
    const exportPdfBtn4 = document.getElementById('exportPdfBtn4');
    const modal = document.getElementById('previewModal');
    const closeBtn = document.querySelector('.close');
    const confirmExport = document.getElementById('confirmExport');
    const cancelPreview = document.getElementById('cancelPreview');
    const previewContent = document.getElementById('previewContent');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    // Course switching functionality
    const roboticsK12Btn = document.getElementById('roboticsK12Btn');
    const robotics4Btn = document.getElementById('robotics4Btn');
    const roboticsK12Form = document.getElementById('roboticsK12Form');
    const robotics4Form = document.getElementById('robotics4Form');

    roboticsK12Btn.addEventListener('click', function() {
        roboticsK12Form.style.display = 'block';
        robotics4Form.style.display = 'none';
        roboticsK12Btn.classList.add('active');
        robotics4Btn.classList.remove('active');
    });

    robotics4Btn.addEventListener('click', function() {
        window.location.href = 'robotics4.html';
    });
    
    // Xử lý sự kiện cho form Robotics K12
    previewBtn.addEventListener('click', function() {
        showPreview('roboticsK12Form');
    });
    
    exportPdfBtn.addEventListener('click', async function() {
        await generatePDF('roboticsK12Form');
    });
    
    // Xử lý sự kiện cho form Robotics 4+
    previewBtn4.addEventListener('click', function() {
        showPreview('robotics4Form');
    });
    
    exportPdfBtn4.addEventListener('click', async function() {
        await generatePDF('robotics4Form');
    });
    
    // Xử lý sự kiện đóng modal
    closeBtn.addEventListener('click', closeModal);
    cancelPreview.addEventListener('click', closeModal);
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Xử lý sự kiện xuất PDF từ modal
    confirmExport.addEventListener('click', async function() {
        closeModal();
        const currentForm = document.querySelector('.container[style*="block"]').id;
        await generatePDF(currentForm);
    });

    // Thêm event listener cho radio buttons đánh giá
    document.querySelectorAll('input[type="radio"]').forEach(function(radio) {
        radio.addEventListener('change', function() {
            if (this.name === 'average_rating') {
                highlightEvaluationLevel(this.value);
            }
        });
    });
    
    // Xử lý các ô check trong form Robotics 4+
    if (document.getElementById('robotics4Form')) {
        setupRobotics4CheckBoxes();
    }
    
    // Hàm thiết lập xử lý cho các ô check trong form Robotics 4+
    function setupRobotics4CheckBoxes() {
        const abilityRows = document.querySelectorAll('#robotics4Form .ability-row');
        
        abilityRows.forEach(row => {
            const checkBox = row.querySelector('.ability-check');
            
            if (checkBox) {
                // Thêm khả năng click
                checkBox.style.cursor = 'pointer';
                
                // Xử lý sự kiện click
                checkBox.addEventListener('click', function() {
                    // Xóa check hiện tại trong cùng ability section
                    const section = row.closest('.ability-section');
                    const checkBoxes = section.querySelectorAll('.ability-check');
                    
                    checkBoxes.forEach(box => {
                        box.innerHTML = '';
                        box.style.backgroundColor = '';
                    });
                    
                    // Đánh dấu ô được chọn
                    this.innerHTML = '✓';
                    this.style.backgroundColor = '#e7f5e7';
                });
            }
        });
        
        // Tính điểm trung bình tự động
        const calculateAverageBtn = document.createElement('button');
        calculateAverageBtn.textContent = 'Tính điểm trung bình';
        calculateAverageBtn.style.marginTop = '10px';
        calculateAverageBtn.style.display = 'block';
        
        const scoreValueElement = document.querySelector('#robotics4Form .score-value');
        if (scoreValueElement) {
            scoreValueElement.parentNode.after(calculateAverageBtn);
            
            calculateAverageBtn.addEventListener('click', function() {
                const sections = document.querySelectorAll('#robotics4Form .ability-section');
                let totalScore = 0;
                let sectionCount = 0;
                
                sections.forEach(section => {
                    const checkedBox = section.querySelector('.ability-check:not(:empty)');
                    if (checkedBox) {
                        const scoreElement = checkedBox.closest('.ability-row').querySelector('.ability-level');
                        if (scoreElement) {
                            totalScore += parseFloat(scoreElement.textContent);
                            sectionCount++;
                        }
                    }
                });
                
                if (sectionCount > 0) {
                    const averageScore = (totalScore / sectionCount).toFixed(2);
                    scoreValueElement.textContent = averageScore;
                    
                    // Highlight the corresponding evaluation level
                    highlightEvaluationLevel4(averageScore);
                } else {
                    alert('Vui lòng đánh giá ít nhất một năng lực trước khi tính điểm trung bình.');
                }
            });
        }
    }
    
    // Hàm highlight mức đánh giá tương ứng với điểm cho form Robotics 4+
    function highlightEvaluationLevel4(score) {
        // Xóa tất cả highlight hiện tại
        const evaluationLevels = document.querySelectorAll('#robotics4Form .level-section');
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
            evaluationLevels[4].style.backgroundColor = '#e7f5e7'; // Mức đang hoàn thiện
        }
    }
    
    // Hàm hiển thị/ẩn loading với progress
    function toggleLoading(show, progress = '') {
        loadingOverlay.classList.toggle('active', show);
        const progressEl = loadingOverlay.querySelector('.loading-progress');
        if (progressEl) {
            progressEl.textContent = progress;
        }
    }
    
    // Thêm hàm xử lý radio buttons trước khi tạo PDF
    function prepareRadioButtonsForPDF(element) {
        const radioButtons = element.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(radio => {
            if (radio.checked) {
                const span = radio.nextElementSibling;
                span.style.backgroundColor = '#e61e25';
                span.style.color = 'white';
                span.style.borderColor = '#e61e25';
            }
        });
    }
    
    // Hàm tạo PDF
    async function generatePDF(formId) {
        try {
            toggleLoading(true, 'Đang chuẩn bị nội dung...');

            // Ẩn các nút và clone nội dung
            const form = document.getElementById(formId);
            const actionsDiv = form.querySelector('.actions');
            const originalDisplay = actionsDiv.style.display;
            actionsDiv.style.display = 'none';

            // Clone element gốc
            const element = form.cloneNode(true);
            
            // Chuẩn bị radio buttons cho PDF
            prepareRadioButtonsForPDF(element);
            
            // Thêm class PDF container
            element.classList.add('pdf-container');
            
            // Tạo container tạm thời để render PDF
            const tempContainer = document.createElement('div');
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-9999px';
            tempContainer.style.top = '0';
            tempContainer.appendChild(element);
            document.body.appendChild(tempContainer);

            // Đợi để đảm bảo DOM đã cập nhật và CSS đã được áp dụng
            await new Promise(resolve => setTimeout(resolve, 1000));
            toggleLoading(true, 'Đang tạo PDF...');

            // Cấu hình html2canvas với chất lượng cao
            const options = {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                imageTimeout: 15000,
                logging: false,
                removeContainer: true,
                letterRendering: true,
                scrollX: 0,
                scrollY: 0,
                windowWidth: element.offsetWidth,
                windowHeight: element.offsetHeight,
                onclone: (clonedDoc) => {
                    const clonedElement = clonedDoc.querySelector('.pdf-container');
                    prepareRadioButtonsForPDF(clonedElement);
                }
            };

            toggleLoading(true, 'Đang tạo hình ảnh...');
            const canvas = await html2canvas(element, options);

            toggleLoading(true, 'Đang tạo file PDF...');
            const { jsPDF } = window.jspdf;
            
            // Tạo PDF với khổ A4
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            // Tính toán tỷ lệ để vừa với khổ A4
            const imgWidth = 210; // A4 width
            const pageHeight = 297; // A4 height
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            let heightLeft = imgHeight;
            let position = 0;
            let page = 1;

            // Xử lý từng trang với margin phù hợp
            while (heightLeft >= 0) {
                // Thêm trang mới nếu không phải trang đầu
                if (page > 1) {
                    pdf.addPage();
                }

                // Thêm nội dung vào trang với margin
                pdf.addImage(
                    canvas, 
                    'JPEG', 
                    0,                  // x
                    position,          // y
                    imgWidth,         // width
                    imgHeight,        // height
                    '',              // alias
                    'FAST',         // compression
                    0               // rotation
                );
                
                heightLeft -= pageHeight;
                position -= pageHeight;
                
                if (heightLeft > 0) {
                    page++;
                    toggleLoading(true, `Đang xử lý trang ${page}...`);
                }
            }

            // Tạo tên file
            const fileName = generateFileName(formId);
            
            // Tải xuống PDF
            pdf.save(fileName);

            // Xóa container tạm
            document.body.removeChild(tempContainer);
            
            // Hiển thị lại các nút
            actionsDiv.style.display = originalDisplay;

            toggleLoading(false);
            alert(`Phiếu nhận xét đã được tải xuống thành công!\n\nTên file: ${fileName}`);

        } catch (error) {
            console.error('Lỗi khi tạo PDF:', error);
            alert('Có lỗi xảy ra khi tạo file PDF. Vui lòng thử lại.');
            toggleLoading(false);
        }
    }
    
    // Hàm tạo tên file với timestamp
    function generateFileName(formId) {
        const form = document.getElementById(formId);
        const studentName = form.querySelector('input[name="hoTen"]')?.value || 'HocVien';
        const courseType = formId === 'robotics4Form' ? 'Robotics4' : 'RoboticsK12';
        const date = new Date();
        const timestamp = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}_${date.getHours()}-${date.getMinutes()}`;
        return `PhieuNhanXet_${studentName}_${courseType}_${timestamp}.pdf`;
    }
    
    let currentScale = 0.8;
    const MIN_SCALE = 0.5;
    const MAX_SCALE = 1.5;
    const SCALE_STEP = 0.1;

    // Hàm hiển thị preview
    async function showPreview(formId) {
        try {
            toggleLoading(true, 'Đang chuẩn bị xem trước...');
            
            // Clone nội dung form
            const originalContent = document.getElementById(formId);
            const clonedContent = originalContent.cloneNode(true);
            
            // Ẩn các nút trong bản preview
            const actionsInClone = clonedContent.querySelector('.actions');
            if (actionsInClone) {
                actionsInClone.style.display = 'none';
            }
            
            // Hiển thị trong modal
            const previewContent = document.getElementById('previewContent');
            previewContent.innerHTML = '';
            previewContent.appendChild(clonedContent);
            
            // Reset scale
            currentScale = 0.8;
            updatePreviewScale();
            
            // Hiển thị modal
            modal.style.display = 'block';
            
            toggleLoading(false);
        } catch (error) {
            console.error('Lỗi khi tạo preview:', error);
            alert('Có lỗi xảy ra khi tạo preview. Vui lòng thử lại.');
            toggleLoading(false);
        }
    }

    // Cập nhật scale cho preview
    function updatePreviewScale() {
        const previewContent = document.getElementById('previewContent');
        const scaleDisplay = document.querySelector('.preview-scale');
        
        previewContent.style.transform = `scale(${currentScale})`;
        scaleDisplay.textContent = `${Math.round(currentScale * 100)}%`;
    }

    // Xử lý zoom in
    document.getElementById('zoomIn').addEventListener('click', () => {
        if (currentScale < MAX_SCALE) {
            currentScale += SCALE_STEP;
            updatePreviewScale();
        }
    });

    // Xử lý zoom out
    document.getElementById('zoomOut').addEventListener('click', () => {
        if (currentScale > MIN_SCALE) {
            currentScale -= SCALE_STEP;
            updatePreviewScale();
        }
    });

    // Xử lý fit screen
    document.getElementById('fitScreen').addEventListener('click', () => {
        const modalBody = document.querySelector('.modal-body');
        const previewContent = document.getElementById('previewContent');
        
        const containerWidth = modalBody.clientWidth - 40; // Trừ padding
        const containerHeight = modalBody.clientHeight - 40;
        
        const contentWidth = previewContent.scrollWidth;
        const contentHeight = previewContent.scrollHeight;
        
        const scaleX = containerWidth / contentWidth;
        const scaleY = containerHeight / contentHeight;
        
        currentScale = Math.min(scaleX, scaleY, 1); // Không vượt quá 100%
        updatePreviewScale();
    });
    
    // Hàm đóng modal
    function closeModal() {
        modal.style.display = 'none';
    }
    
    // Hàm highlight mức đánh giá tương ứng với điểm
    function highlightEvaluationLevel(score) {
        // Xóa tất cả highlight hiện tại
        const evaluationLevels = document.querySelectorAll('.evaluation-level');
        evaluationLevels.forEach(function(level) {
            level.style.backgroundColor = '#f9f9f9';
        });
        
        // Highlight mức đánh giá tương ứng
        score = parseFloat(score);
        
        if (score >= 4.5 && score <= 5) {
            evaluationLevels[0].style.backgroundColor = '#e7f5e7'; // Mức xuất sắc
        } else if (score >= 3.5 && score < 4.5) {
            evaluationLevels[1].style.backgroundColor = '#e7f5e7'; // Mức tiềm năng
        } else if (score >= 2.5 && score < 3.5) {
            evaluationLevels[2].style.backgroundColor = '#e7f5e7'; // Mức trung bình
        } else if (score >= 1.5 && score < 2.5) {
            evaluationLevels[3].style.backgroundColor = '#e7f5e7'; // Mức cơ bản
        } else if (score >= 1 && score < 1.5) {
            evaluationLevels[4].style.backgroundColor = '#e7f5e7'; // Mức hạn chế
        }
    }

    // Add ESC key functionality to close modal
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const previewModal = document.getElementById('previewModal');
            if (previewModal && previewModal.style.display === 'block') {
                closeModal();
            }
        }
    });
    
    // Initialize the application
    initApp();
});