document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            
            // Animate hamburger to X
            const spans = menuToggle.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));
            
            if (mainNav.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
    
    // Intranet portal
    const intranetLink = document.querySelector('.intranet-link');
    const intranetPortal = document.getElementById('intranetPortal');
    const closePortal = document.getElementById('closePortal');
    const intranetForm = document.getElementById('intranetForm');
    
    if (intranetLink && intranetPortal && closePortal) {
        intranetLink.addEventListener('click', function(e) {
            e.preventDefault();
            intranetPortal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        closePortal.addEventListener('click', function() {
            intranetPortal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    if (intranetForm) {
        intranetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Access denied. Please contact your department chief.');
        });
    }
    
    // Macrodata Refinement Simulation
    initMacrodataRefinement();
});

// Macrodata Refinement Simulation
function initMacrodataRefinement() {
    const dataField = document.getElementById('dataField');
    if (!dataField) return;
    
    let isSelecting = false;
    let selectionStart = null;
    let selectionArea = null;
    let activeCluster = null;
    let totalProgress = 0;
    let isMobile = window.innerWidth < 768;
    
    // Initialize the grid
    function generateGrid() {
        dataField.innerHTML = '';
        
        // Create grid of numbers - for mobile, we'll use a smaller grid
        const numbers = [
            "057713405702175604826",
            "358902915154093966189",
            "054971013916433391736",
            "957220517629118802957",
            "660085154077351248912",
            "401639860775613890461",
            "186532459606868702645",
            "880110933371153245196",
            "491626949534937482137",
            "791724609349309733900"
        ];
        
        // For mobile, we'll only show the first 10 columns to make numbers bigger and more tappable
        const colLimit = isMobile ? 10 : 25;
        
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < colLimit; col++) {
                const span = document.createElement('span');
                span.className = 'data-point';
                span.textContent = numbers[row][col] || '1';
                span.dataset.index = row * colLimit + col;
                span.dataset.row = row;
                span.dataset.col = col;
                dataField.appendChild(span);
            }
        }
        
        // Clear any existing animations or styles
        clearAllAnimations();
    }
    
    // New function to clear all animations from the grid
    function clearAllAnimations() {
        const allPoints = dataField.querySelectorAll('.data-point');
        allPoints.forEach(point => {
            point.classList.remove('active', 'being-selected');
            point.removeAttribute('style');
            point.style.color = 'rgba(0, 255, 255, 0.3)';
            point.style.textShadow = 'none';
        });
    }
    
    // Remove automatic cluster creation
    function createCluster() {
        if (activeCluster) return;
        
        // First, ensure no stray animations are running
        clearAllAnimations();
        
        // Randomly select a cluster type (0-4 for each character)
        const clusterType = Math.floor(Math.random() * 5);
        
        // Get the actual grid dimensions
        const colLimit = isMobile ? 10 : 25;
        const rowLimit = 10;
        
        // Create a safe inner area by adding padding from the edges
        const edgePadding = 3; // Increase padding to keep clusters further from edges
        
        // Select a random position in the inner area of the grid
        const startRow = edgePadding + Math.floor(Math.random() * (rowLimit - (2 * edgePadding)));
        const startCol = edgePadding + Math.floor(Math.random() * (colLimit - (2 * edgePadding)));
        
        // Create a cluster of 3-4 numbers (reduced from 3-5 to ensure better fit)
        const clusterSize = Math.floor(Math.random() * 2) + 3; // 3 or 4 elements
        const clusterElements = [];
        const clusterIndices = new Set(); // Track indices to avoid duplicates
        
        // Create a more compact cluster pattern
        for (let i = 0; i < clusterSize; i++) {
            // Create a more compact pattern for the cluster
            let row, col;
            
            // Different patterns based on cluster size
            if (clusterSize === 3) {
                // Triangle pattern
                if (i === 0) { row = startRow; col = startCol; }
                else if (i === 1) { row = startRow; col = startCol + 1; }
                else { row = startRow + 1; col = startCol; }
            } else {
                // Square pattern for 4
                row = startRow + Math.floor(i / 2);
                col = startCol + (i % 2);
            }
            
            // Double-check we're within the safe inner area
            if (row < edgePadding || row >= rowLimit - edgePadding || 
                col < edgePadding || col >= colLimit - edgePadding) {
                continue; // Skip this position if it's in the edge area
            }
            
            const index = row * colLimit + col;
            
            // Check if this index is valid and not already in the cluster
            if (index >= 0 && index < dataField.children.length && !clusterIndices.has(index)) {
                const element = dataField.children[index];
                
                if (element) {
                    // Add to tracking set
                    clusterIndices.add(index);
                    
                    // Apply the active class which triggers the CSS animations
                    element.classList.add('active');
                    
                    // Make sure we're not overriding the CSS animations with inline styles
                    element.style.transition = 'all 0.3s ease';
                    element.style.color = '#00ffff';
                    element.style.textShadow = '0 0 15px #00ffff';
                    
                    clusterElements.push(element);
                }
            }
        }
        
        if (clusterElements.length >= 3) { // Ensure we have at least 3 elements
            activeCluster = {
                type: clusterType,
                elements: clusterElements,
                indices: Array.from(clusterIndices)
            };
            
            // Log for debugging
            console.log(`Created cluster with ${clusterElements.length} elements of type ${clusterType} at position [${startRow},${startCol}]`);
        } else {
            // Try again if we couldn't create a valid cluster
            setTimeout(createCluster, 100);
        }
    }
    
    // Schedule new clusters periodically
    function scheduleNewCluster() {
        if (!activeCluster) {
            createCluster();
        }
        // Ensure we keep trying to create clusters
        setTimeout(scheduleNewCluster, 2000);
    }
    
    // Regenerate numbers after successful selection
    function regenerateNumbers(positions) {
        positions.forEach(point => {
            // First remove all inline styles that might interfere
            point.removeAttribute('style');
            
            // Then remove the active class
            point.classList.remove('active', 'being-selected');
            
            // Finally set the basic styles
            setTimeout(() => {
                point.style.color = 'rgba(0, 255, 255, 0.3)';
                point.style.textShadow = 'none';
            }, 50);
        });
    }
    
    // Handle selection drawing
    function startSelection(e) {
        if (!activeCluster) return;
        
        isSelecting = true;
        
        // Handle both mouse and touch events
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        selectionStart = {
            x: clientX - dataField.getBoundingClientRect().left,
            y: clientY - dataField.getBoundingClientRect().top
        };
        
        selectionArea = document.createElement('div');
        selectionArea.className = 'selection-area';
        dataField.appendChild(selectionArea);
        
        // Prevent scrolling on touch devices when selecting
        if (e.touches) {
            e.preventDefault();
        }
    }
    
    function updateSelection(e) {
        if (!isSelecting || !selectionStart) return;
        
        // Handle both mouse and touch events
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        const currentPos = {
            x: clientX - dataField.getBoundingClientRect().left,
            y: clientY - dataField.getBoundingClientRect().top
        };
        
        // Ensure selection stays within the data field boundaries
        const fieldRect = dataField.getBoundingClientRect();
        const left = Math.max(0, Math.min(selectionStart.x, currentPos.x));
        const top = Math.max(0, Math.min(selectionStart.y, currentPos.y));
        const right = Math.min(fieldRect.width, Math.max(selectionStart.x, currentPos.x));
        const bottom = Math.min(fieldRect.height, Math.max(selectionStart.y, currentPos.y));
        
        const width = right - left;
        const height = bottom - top;
        
        selectionArea.style.left = `${left}px`;
        selectionArea.style.top = `${top}px`;
        selectionArea.style.width = `${width}px`;
        selectionArea.style.height = `${height}px`;
        
        // Highlight numbers that are being selected
        if (activeCluster) {
            activeCluster.elements.forEach(point => {
                const rect = point.getBoundingClientRect();
                const pointCenterX = rect.left + rect.width/2;
                const pointCenterY = rect.top + rect.height/2;
                
                // Check if point center is within selection
                const isSelected = 
                    pointCenterX >= selectionArea.getBoundingClientRect().left &&
                    pointCenterX <= selectionArea.getBoundingClientRect().right &&
                    pointCenterY >= selectionArea.getBoundingClientRect().top &&
                    pointCenterY <= selectionArea.getBoundingClientRect().bottom;
                
                // Add/remove a visual indicator class
                if (isSelected) {
                    point.classList.add('being-selected');
                } else {
                    point.classList.remove('being-selected');
                }
            });
        }
        
        // Prevent scrolling on touch devices when selecting
        if (e.touches) {
            e.preventDefault();
        }
    }
    
    function endSelection() {
        if (!isSelecting) return;
        
        isSelecting = false;
        if (selectionArea) {
            const bounds = selectionArea.getBoundingClientRect();
            
            // Check which numbers are within selection
            if (activeCluster) {
                // Count numbers that have the being-selected class
                const selected = activeCluster.elements.filter(point => 
                    point.classList.contains('being-selected')
                );
                
                // Remove the selection indicator class
                activeCluster.elements.forEach(point => 
                    point.classList.remove('being-selected')
                );
                
                // If we selected at least half of the cluster, count it as success
                if (selected.length >= Math.ceil(activeCluster.elements.length / 2)) {
                    // All cluster numbers selected
                    animateNumbersToBox(activeCluster.elements, activeCluster.type);
                }
            }
            
            selectionArea.remove();
            selectionArea = null;
        }
    }
    
    // Animate numbers flowing to category bin
    function animateNumbersToBox(numbers, binIndex) {
        const categoryBin = document.querySelectorAll('.category-bin')[binIndex];
        if (!categoryBin) return; // Safety check
        
        const binRect = categoryBin.getBoundingClientRect();
        const binCenter = {
            x: binRect.left + binRect.width / 2,
            y: binRect.top + binRect.height / 2
        };
        
        // Create copies of numbers for animation
        numbers.forEach((point, index) => {
            // First, remove the active class to stop animations
            point.classList.remove('active', 'being-selected');
            
            const rect = point.getBoundingClientRect();
            const clone = point.cloneNode(true);
            
            // Style the clone for animation
            clone.style.position = 'fixed';
            clone.style.left = `${rect.left}px`;
            clone.style.top = `${rect.top}px`;
            clone.style.width = `${rect.width}px`;
            clone.style.height = `${rect.height}px`;
            clone.classList.add('transferring');
            
            // Calculate final position (spiral into bin)
            const angle = (index / numbers.length) * Math.PI * 2;
            const finalX = binCenter.x + Math.cos(angle) * 20;
            const finalY = binCenter.y + Math.sin(angle) * 20;
            
            // Set animation
            clone.style.transition = `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 50}ms`;
            document.body.appendChild(clone);
            
            // Start animation
            setTimeout(() => {
                clone.style.transform = 'scale(0.8)';
                clone.style.left = `${finalX}px`;
                clone.style.top = `${finalY}px`;
                clone.style.opacity = '0.8';
            }, 50);
            
            // Remove clone after animation
            setTimeout(() => {
                clone.remove();
            }, 1000 + index * 50);
            
            // Hide original number
            point.style.opacity = '0';
        });
        
        // Animate category bin
        categoryBin.classList.add('receiving');
        const ripple = document.createElement('div');
        ripple.className = 'success-ripple';
        categoryBin.appendChild(ripple);
        
        setTimeout(() => {
            categoryBin.classList.remove('receiving');
            ripple.remove();
        }, 600);
        
        // After animation, regenerate the numbers
        setTimeout(() => {
            regenerateNumbers(numbers);
        }, 1000);
        
        // Update progress and clear cluster
        updateProgress(binIndex);
        clearCluster();
    }
    
    // Update progress bars with smoother animation
    function updateProgress(binIndex) {
        const progressBars = document.querySelectorAll('.progress-bar-fill');
        const progressValues = document.querySelectorAll('.progress-bar-value');
        const currentProgress = parseInt(progressBars[binIndex].style.width) || 0;
        const increment = Math.floor(Math.random() * 5) + 3; // 3-7% increase
        
        const newProgress = Math.min(currentProgress + increment, 100);
        progressBars[binIndex].style.width = `${newProgress}%`;
        
        // Animate the percentage text
        const startValue = currentProgress;
        const endValue = newProgress;
        const duration = 800;
        const startTime = performance.now();
        
        function updateValue(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Use easing function for smooth animation
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.round(startValue + (endValue - startValue) * easeProgress);
            
            progressValues[binIndex].textContent = `${currentValue}%`;
            
            if (progress < 1) {
                requestAnimationFrame(updateValue);
            }
        }
        
        requestAnimationFrame(updateValue);
        
        // Update total progress with animation
        const totalProgress = Array.from(progressBars)
            .reduce((sum, bar) => sum + (parseInt(bar.style.width) || 0), 0) / 5;
        
        const completionElement = document.querySelector('.mdr-completion');
        const startTotal = parseInt(completionElement.textContent) || 0;
        const endTotal = Math.floor(totalProgress);
        
        function updateTotal(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.round(startTotal + (endTotal - startTotal) * easeProgress);
            
            completionElement.textContent = `${currentValue}% Complete`;
            
            if (progress < 1) {
                requestAnimationFrame(updateTotal);
            }
        }
        
        requestAnimationFrame(updateTotal);
    }
    
    // Clear active cluster
    function clearCluster() {
        if (activeCluster) {
            activeCluster.elements.forEach(point => {
                // First remove all inline styles that might interfere
                point.removeAttribute('style');
                
                // Then remove all special classes
                point.classList.remove('active', 'being-selected');
                
                // Finally set the basic styles
                setTimeout(() => {
                    point.style.color = 'rgba(0, 255, 255, 0.3)';
                    point.style.textShadow = 'none';
                }, 50);
            });
            
            activeCluster = null;
            
            // Immediately try to create a new cluster
            setTimeout(createCluster, 500);
        }
    }
    
    // Add event listeners for both mouse and touch events
    dataField.addEventListener('mousedown', startSelection);
    dataField.addEventListener('mousemove', updateSelection);
    dataField.addEventListener('mouseup', endSelection);
    
    // Add touch event listeners
    dataField.addEventListener('touchstart', startSelection, { passive: false });
    dataField.addEventListener('touchmove', updateSelection, { passive: false });
    dataField.addEventListener('touchend', endSelection);
    
    // Handle window resize
    window.addEventListener('resize', function() {
        isMobile = window.innerWidth < 768;
        
        // Clear any active cluster before regenerating the grid
        if (activeCluster) {
            clearCluster();
        }
        
        // Clear all animations and regenerate grid
        clearAllAnimations();
        generateGrid();
    });
    
    // Initialize
    generateGrid();
    scheduleNewCluster();
    
    // Add scan line effect
    const scanLine = document.createElement('div');
    scanLine.className = 'scan-line';
    dataField.appendChild(scanLine);
    
    // Remove automatic cluster creation and screen effects
    function addScreenEffects() {
        // Disabled
        return;
    }
    
    // Add CRT effects
    addScreenEffects();
} 