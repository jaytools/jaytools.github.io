// DPI Checker Tool JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements with error checking
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const resultsSection = document.getElementById('resultsSection');
    const previewContainer = document.getElementById('previewContainer');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const fileType = document.getElementById('fileType');
    const dimensions = document.getElementById('dimensions');
    const dpiX = document.getElementById('dpiX');
    const dpiY = document.getElementById('dpiY');
    const qualityBadge = document.getElementById('qualityBadge');
    const qualityDescription = document.getElementById('qualityDescription');

    // Check if all elements exist
    const requiredElements = {
        fileInput, uploadArea, resultsSection, previewContainer,
        fileName, fileSize, fileType, dimensions, dpiX, dpiY,
        qualityBadge, qualityDescription
    };
    
    for (const [name, element] of Object.entries(requiredElements)) {
        if (!element) {
            console.error(`Required element not found: ${name}`);
            showNotification(`Error: Missing page element ${name}. Please refresh the page.`, 'error');
            return;
        }
    }
    
    console.log('All DOM elements found successfully');

    let currentFile = null;
    let currentAnalysis = null;

    // File input change handler
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            handleFile(file);
        }
    });

    // Drag and drop handlers
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            handleFile(file);
        }
    });

    // Handle file processing
    function handleFile(file) {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            showNotification('Please select a valid image or PDF file.', 'error');
            return;
        }

        // Validate file size (max 50MB)
        if (file.size > 50 * 1024 * 1024) {
            showNotification('File size must be less than 50MB.', 'error');
            return;
        }

        currentFile = file;
        
        // Show loading state
        showLoading();
        
        // Process the file
        if (file.type === 'application/pdf') {
            processPDF(file);
        } else {
            processImage(file);
        }
    }

    // Process image files
    function processImage(file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // Create a temporary image to validate and get dimensions
            const img = new Image();
            
            img.onload = function() {
                try {
                    // Get basic image info
                    const basicAnalysis = {
                        fileName: file.name,
                        fileSize: formatFileSize(file.size),
                        fileType: file.type,
                        width: img.naturalWidth || img.width || 0,
                        height: img.naturalHeight || img.height || 0,
                        dpiX: 72, // Default fallback
                        dpiY: 72, // Default fallback
                        hasDPI: false,
                        imageData: e.result,
                        isScreenshot: isLikelyScreenshot(file.name, img.naturalWidth || img.width, img.naturalHeight || img.height)
                    };
                    
                    // Try to extract EXIF data for DPI information
                    getImageDPI(file, img, function(dpiInfo) {
                        basicAnalysis.dpiX = dpiInfo.x || 72;
                        basicAnalysis.dpiY = dpiInfo.y || 72;
                        basicAnalysis.hasDPI = dpiInfo.found;
                        
                        currentAnalysis = basicAnalysis;
                        displayResults(basicAnalysis);
                    });
                    
                } catch (error) {
                    console.error('Image processing error:', error);
                    // Still try to show basic info even if EXIF fails
                    const fallbackAnalysis = {
                        fileName: file.name,
                        fileSize: formatFileSize(file.size),
                        fileType: file.type,
                        width: img.naturalWidth || img.width || 0,
                        height: img.naturalHeight || img.height || 0,
                        dpiX: 72,
                        dpiY: 72,
                        hasDPI: false,
                        imageData: e.result,
                        isScreenshot: true
                    };
                    currentAnalysis = fallbackAnalysis;
                    displayResults(fallbackAnalysis);
                }
            };
            
            img.onerror = function() {
                console.error('Image loading failed for file:', file.name);
                // Try alternative approach for potentially corrupted or unusual files
                tryAlternativeImageProcessing(file, e.result);
            };
            
            // Set crossOrigin to avoid CORS issues
            img.crossOrigin = 'anonymous';
            
            // Set a timeout for image loading
            setTimeout(() => {
                if (!img.complete) {
                    console.log('Image loading timeout, trying alternative method');
                    tryAlternativeImageProcessing(file, e.result);
                }
            }, 8000); // 8 second timeout
            
            img.src = e.result;
        };
        
        reader.onerror = function() {
            console.error('File reading failed for:', file.name);
            showNotification('Error reading file. Please try again.', 'error');
            hideLoading();
        };
        
        try {
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('FileReader error:', error);
            showNotification('Error processing file. Please try another file.', 'error');
            hideLoading();
        }
    }

    // Alternative image processing for problematic files
    function tryAlternativeImageProcessing(file, dataUrl) {
        try {
            // Create basic analysis without image dimensions
            const fallbackAnalysis = {
                fileName: file.name,
                fileSize: formatFileSize(file.size),
                fileType: file.type,
                width: 'Unknown',
                height: 'Unknown',
                dpiX: 72,
                dpiY: 72,
                hasDPI: false,
                imageData: dataUrl,
                isScreenshot: true,
                isProblematic: true
            };
            
            currentAnalysis = fallbackAnalysis;
            displayResults(fallbackAnalysis);
            showNotification('Image processed with limited information. Some details may not be available.', 'warning');
        } catch (error) {
            console.error('Alternative processing failed:', error);
            showNotification('Unable to process this image file. Please try a different file.', 'error');
            hideLoading();
        }
    }

    // Check if image is likely a screenshot
    function isLikelyScreenshot(filename, width, height) {
        const name = filename.toLowerCase();
        const screenshotKeywords = ['screenshot', 'screen shot', 'capture', 'snap'];
        const hasScreenshotName = screenshotKeywords.some(keyword => name.includes(keyword));
        
        // Common screenshot dimensions (rough detection)
        const commonScreenRatios = [
            { w: 1920, h: 1080 }, { w: 1366, h: 768 }, { w: 1280, h: 720 },
            { w: 1440, h: 900 }, { w: 1536, h: 864 }, { w: 1024, h: 768 }
        ];
        
        const hasScreenshotDimensions = commonScreenRatios.some(ratio => 
            (width === ratio.w && height === ratio.h) || 
            (width === ratio.h && height === ratio.w)
        );
        
        return hasScreenshotName || hasScreenshotDimensions;
    }

    // Process PDF files
    function processPDF(file) {
        // For PDF files, we'll show basic info and estimate DPI
        const analysis = {
            fileName: file.name,
            fileSize: formatFileSize(file.size),
            fileType: file.type,
            width: 'N/A',
            height: 'N/A',
            dpiX: 72, // Standard PDF DPI
            dpiY: 72,
            hasDPI: false,
            imageData: null,
            isPDF: true
        };
        
        currentAnalysis = analysis;
        displayResults(analysis);
    }

    // Extract DPI information from image
    function getImageDPI(file, img, callback) {
        // Try to read EXIF data
        if (window.EXIF && typeof EXIF.getData === 'function') {
            try {
                EXIF.getData(img, function() {
                    const xRes = EXIF.getTag(this, 'XResolution');
                    const yRes = EXIF.getTag(this, 'YResolution');
                    const resUnit = EXIF.getTag(this, 'ResolutionUnit');
                    
                    if (xRes && yRes && !isNaN(xRes) && !isNaN(yRes)) {
                        let dpiX = Math.round(xRes);
                        let dpiY = Math.round(yRes);
                        
                        // Convert from cm to inches if needed
                        if (resUnit === 3) {
                            dpiX = Math.round(xRes * 2.54);
                            dpiY = Math.round(yRes * 2.54);
                        }
                        
                        callback({
                            x: dpiX,
                            y: dpiY,
                            found: true
                        });
                        return;
                    }
                    
                    // Fallback if EXIF data is incomplete
                    callback({
                        x: 72,
                        y: 72,
                        found: false
                    });
                });
            } catch (error) {
                console.log('EXIF reading error:', error);
                // Fallback on error
                callback({
                    x: 72,
                    y: 72,
                    found: false
                });
            }
        } else {
            // Fallback: EXIF library not available
            callback({
                x: 72,
                y: 72,
                found: false
            });
        }
    }

    // Display analysis results
    function displayResults(analysis) {
        console.log('Displaying results for analysis:', analysis);
        
        // Update file information
        fileName.textContent = analysis.fileName;
        fileSize.textContent = analysis.fileSize;
        fileType.textContent = analysis.fileType;
        
        // Update dimensions
        if (analysis.isPDF) {
            dimensions.textContent = 'PDF Document';
        } else if (analysis.isProblematic && (analysis.width === 'Unknown' || analysis.height === 'Unknown')) {
            dimensions.textContent = 'Unable to determine dimensions';
        } else {
            dimensions.textContent = `${analysis.width} × ${analysis.height} pixels`;
        }
        
        // Update DPI values with better messaging for screenshots
        if (analysis.isScreenshot && !analysis.hasDPI) {
            dpiX.textContent = `${analysis.dpiX} DPI (screenshot default)`;
            dpiY.textContent = `${analysis.dpiY} DPI (screenshot default)`;
        } else if (!analysis.hasDPI) {
            dpiX.textContent = `${analysis.dpiX} DPI (estimated)`;
            dpiY.textContent = `${analysis.dpiY} DPI (estimated)`;
        } else {
            dpiX.textContent = `${analysis.dpiX} DPI`;
            dpiY.textContent = `${analysis.dpiY} DPI`;
        }
        
        // Update preview
        updatePreview(analysis);
        
        // Update quality assessment
        updateQualityAssessment(analysis);
        
        // Show results - Make sure it's visible
        hideLoading();
        
        // Force show results section
        resultsSection.classList.remove('hidden');
        resultsSection.style.display = 'block';
        resultsSection.style.visibility = 'visible';
        resultsSection.style.opacity = '1';
        
        console.log('Results section shown, classes:', resultsSection.className);
        console.log('Results section display:', getComputedStyle(resultsSection).display);
        
        // Show helpful notification for screenshots
        if (analysis.isScreenshot && !analysis.hasDPI) {
            showNotification('Screenshot detected! DPI values are estimated. Screenshots are perfect for digital use but may need higher resolution for quality printing.', 'info');
        } else if (analysis.isProblematic) {
            showNotification('File analyzed with limited information. Basic details extracted successfully.', 'warning');
        }
        
        // Smooth scroll to results
        setTimeout(() => {
            resultsSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 100);
        
        // Track usage
        trackDPICheck(analysis);
    }

    // Update file preview
    function updatePreview(analysis) {
        previewContainer.innerHTML = '';
        
        if (analysis.isPDF) {
            // PDF preview placeholder
            const pdfPlaceholder = document.createElement('div');
            pdfPlaceholder.className = 'preview-placeholder';
            pdfPlaceholder.innerHTML = `
                <i class="fas fa-file-pdf"></i>
                <p>PDF Document<br><span style="font-size: 0.9rem; color: var(--color-gray-500);">Preview not available</span></p>
            `;
            previewContainer.appendChild(pdfPlaceholder);
        } else if (analysis.imageData) {
            // Image preview with error handling
            const img = document.createElement('img');
            img.className = 'preview-image';
            img.alt = 'File preview';
            
            img.onload = function() {
                // Image loaded successfully
                console.log('Preview image loaded successfully');
            };
            
            img.onerror = function() {
                // Fallback if preview fails
                console.log('Preview failed, showing fallback');
                previewContainer.innerHTML = `
                    <div class="preview-placeholder">
                        <i class="fas fa-image"></i>
                        <p>${analysis.isScreenshot ? 'Screenshot' : 'Image'} File<br>
                        <span style="font-size: 0.9rem; color: var(--color-gray-500);">Preview not available</span></p>
                    </div>
                `;
            };
            
            try {
                img.src = analysis.imageData;
                previewContainer.appendChild(img);
            } catch (error) {
                console.error('Error setting preview image:', error);
                previewContainer.innerHTML = `
                    <div class="preview-placeholder">
                        <i class="fas fa-image"></i>
                        <p>Image File<br><span style="font-size: 0.9rem; color: var(--color-gray-500);">Preview not available</span></p>
                    </div>
                `;
            }
        } else {
            // No preview available
            const placeholder = document.createElement('div');
            placeholder.className = 'preview-placeholder';
            placeholder.innerHTML = `
                <i class="fas fa-file"></i>
                <p>File Processed<br><span style="font-size: 0.9rem; color: var(--color-gray-500);">Preview not available</span></p>
            `;
            previewContainer.appendChild(placeholder);
        }
    }

    // Update quality assessment
    function updateQualityAssessment(analysis) {
        const avgDPI = (analysis.dpiX + analysis.dpiY) / 2;
        let quality, description, icon;
        
        // Special handling for screenshots
        if (analysis.isScreenshot && !analysis.hasDPI) {
            quality = 'screenshot';
            description = 'This appears to be a screenshot. Screenshots are typically optimized for screen viewing (72-96 DPI) and may not be ideal for high-quality printing.';
            icon = 'fas fa-desktop';
        } else if (avgDPI >= 300) {
            quality = 'excellent';
            description = 'Excellent for high-quality printing and professional use. Perfect for magazines, brochures, and detailed graphics.';
            icon = 'fas fa-medal';
        } else if (avgDPI >= 150) {
            quality = 'good';
            description = 'Good quality for standard printing and web use. Suitable for documents, presentations, and basic printing.';
            icon = 'fas fa-thumbs-up';
        } else if (avgDPI >= 72) {
            quality = 'fair';
            description = 'Fair quality, suitable for web display and basic viewing. May appear pixelated when printed at large sizes.';
            icon = 'fas fa-exclamation-triangle';
        } else {
            quality = 'poor';
            description = 'Low quality that may appear pixelated or blurry. Consider using a higher resolution image for better results.';
            icon = 'fas fa-exclamation-circle';
        }
        
        // Update quality badge
        qualityBadge.className = `quality-badge ${quality}`;
        
        if (analysis.isScreenshot && !analysis.hasDPI) {
            qualityBadge.innerHTML = `
                <i class="${icon}"></i>
                <span>Screenshot (${avgDPI.toFixed(0)} DPI default)</span>
            `;
        } else {
            qualityBadge.innerHTML = `
                <i class="${icon}"></i>
                <span>${quality.charAt(0).toUpperCase() + quality.slice(1)} Quality (${avgDPI.toFixed(0)} DPI)</span>
            `;
        }
        
        // Update description
        qualityDescription.textContent = description;
        
        // Add helpful notes based on file type
        if (analysis.isScreenshot) {
            qualityDescription.textContent += ' Tip: For better print quality, try capturing at higher resolution or use original source images.';
        } else if (!analysis.hasDPI && !analysis.isPDF) {
            qualityDescription.textContent += ' Note: DPI values are estimated as no metadata was found in the file.';
        }
        
        // Add problematic file note
        if (analysis.isProblematic) {
            qualityDescription.textContent += ' Some image details could not be determined due to file format limitations.';
        }
    }

    // Format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Show loading state
    function showLoading() {
        uploadArea.style.opacity = '0.5';
        uploadArea.style.pointerEvents = 'none';
        
        // Add loading indicator to upload area
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loadingIndicator';
        loadingDiv.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--color-primary); margin-bottom: 10px;"></i>
                <p style="color: var(--color-gray-600); margin: 0;">Analyzing file...</p>
            </div>
        `;
        uploadArea.appendChild(loadingDiv);
    }

    // Hide loading state
    function hideLoading() {
        uploadArea.style.opacity = '1';
        uploadArea.style.pointerEvents = 'auto';
        
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
    }

    // Reset tool
    window.resetTool = function() {
        currentFile = null;
        currentAnalysis = null;
        fileInput.value = '';
        resultsSection.classList.add('hidden');
        
        // Scroll to top of tool
        uploadArea.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
        
        showNotification('Tool reset. Ready for new file.', 'success');
    };

    // Download report
    window.downloadReport = function() {
        if (!currentAnalysis) {
            showNotification('No analysis data to download.', 'error');
            return;
        }
        
        const report = generateReport(currentAnalysis);
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `dpi-analysis-${currentAnalysis.fileName}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('Report downloaded successfully!', 'success');
    };

    // Generate text report
    function generateReport(analysis) {
        const avgDPI = (analysis.dpiX + analysis.dpiY) / 2;
        const timestamp = new Date().toLocaleString();
        
        return `DPI ANALYSIS REPORT
Generated: ${timestamp}
Tool: Task Proper DPI Checker

FILE INFORMATION
================
Filename: ${analysis.fileName}
File Size: ${analysis.fileSize}
File Type: ${analysis.fileType}
${analysis.isPDF ? 'Document Type: PDF' : `Dimensions: ${analysis.width} × ${analysis.height} pixels`}

RESOLUTION DETAILS
==================
DPI (Horizontal): ${analysis.dpiX}${!analysis.hasDPI ? ' (estimated)' : ''}
DPI (Vertical): ${analysis.dpiY}${!analysis.hasDPI ? ' (estimated)' : ''}
Average DPI: ${avgDPI.toFixed(1)}

QUALITY ASSESSMENT
==================
${getQualityText(avgDPI)}

RECOMMENDATIONS
===============
${getRecommendations(avgDPI, analysis)}

---
Report generated by Task Proper DPI Checker
Visit: https://www.taskproper.com/utility/dpi-checker.html
`;
    }

    // Get quality text for report
    function getQualityText(avgDPI) {
        if (avgDPI >= 300) {
            return 'EXCELLENT: Perfect for professional printing and high-quality graphics.';
        } else if (avgDPI >= 150) {
            return 'GOOD: Suitable for standard printing and web use.';
        } else if (avgDPI >= 72) {
            return 'FAIR: Adequate for web display but may be pixelated when printed.';
        } else {
            return 'POOR: Low quality that may appear blurry or pixelated.';
        }
    }

    // Get recommendations for report
    function getRecommendations(avgDPI, analysis) {
        let recommendations = [];
        
        if (avgDPI < 150) {
            recommendations.push('- Consider using a higher resolution image for printing');
            recommendations.push('- Current resolution is best suited for web display only');
        }
        
        if (avgDPI >= 300) {
            recommendations.push('- Perfect for professional printing and publishing');
            recommendations.push('- Consider compressing for web use to reduce file size');
        }
        
        if (!analysis.hasDPI && !analysis.isPDF) {
            recommendations.push('- DPI values are estimated; original file may not contain metadata');
            recommendations.push('- Consider re-saving the image with embedded DPI information');
        }
        
        if (analysis.isPDF) {
            recommendations.push('- PDF DPI analysis is limited; individual images within PDF may vary');
            recommendations.push('- Use specialized PDF tools for detailed analysis');
        }
        
        return recommendations.length > 0 ? recommendations.join('\n') : 'No specific recommendations for this file.';
    }

    // Track DPI check usage
    function trackDPICheck(analysis) {
        try {
            // Store usage statistics
            const stats = JSON.parse(localStorage.getItem('dpiCheckerStats') || '{}');
            const today = new Date().toDateString();
            
            if (!stats[today]) {
                stats[today] = { count: 0, types: {} };
            }
            
            stats[today].count++;
            
            const fileType = analysis.isPDF ? 'PDF' : 'Image';
            stats[today].types[fileType] = (stats[today].types[fileType] || 0) + 1;
            
            localStorage.setItem('dpiCheckerStats', JSON.stringify(stats));
        } catch (error) {
            console.log('Could not save usage statistics');
        }
    }

    // Show notification
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            min-width: 300px;
            max-width: 500px;
            padding: 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            font-family: inherit;
            animation: slideIn 0.3s ease-out;
        `;
        
        // Set colors based on type
        const colors = {
            success: { bg: '#10b981', text: 'white' },
            error: { bg: '#ef4444', text: 'white' },
            warning: { bg: '#f59e0b', text: 'white' },
            info: { bg: '#3b82f6', text: 'white' }
        };
        
        const color = colors[type] || colors.info;
        notification.style.backgroundColor = color.bg;
        notification.style.color = color.text;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Add CSS for notifications
    const notificationCSS = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }
        
        .notification-message {
            flex: 1;
            font-size: 14px;
            line-height: 1.4;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: inherit;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            opacity: 0.8;
            transition: opacity 0.2s;
        }
        
        .notification-close:hover {
            opacity: 1;
            background: rgba(255, 255, 255, 0.2);
        }
    `;
    
    // Inject notification CSS
    const styleSheet = document.createElement('style');
    styleSheet.textContent = notificationCSS;
    document.head.appendChild(styleSheet);

    // Initialize tool
    console.log('DPI Checker tool initialized');
    
    // Add EXIF.js for better DPI detection (optional enhancement)
    if (!window.EXIF) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/exif-js@2.3.0/exif.js';
        script.onload = function() {
            console.log('EXIF.js loaded for enhanced DPI detection');
        };
        document.head.appendChild(script);
    }
});
