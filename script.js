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
    
    // Initialize the grid
    function generateGrid() {
        dataField.innerHTML = '';
        
        // Create 10x25 grid of static numbers matching the image
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
        
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 25; col++) {
                const span = document.createElement('span');
                span.className = 'data-point';
                span.textContent = numbers[row][col] || '1';
                span.dataset.index = row * 25 + col;
                dataField.appendChild(span);
            }
        }
    }
    
    // Remove automatic cluster creation
    function createCluster() {
        if (activeCluster) return;
        
        // Randomly select a cluster type (0-4 for each character)
        const clusterType = Math.floor(Math.random() * 5);
        
        // Select a random position in the grid
        const startRow = Math.floor(Math.random() * 8);
        const startCol = Math.floor(Math.random() * 23);
        
        // Create a cluster of 3-5 numbers
        const clusterSize = Math.floor(Math.random() * 3) + 3;
        const clusterElements = [];
        
        for (let i = 0; i < clusterSize; i++) {
            const row = startRow + Math.floor(i / 3);
            const col = startCol + (i % 3);
            const index = row * 25 + col;
            const element = dataField.children[index];
            
            if (element) {
                element.classList.add('active');
                clusterElements.push(element);
            }
        }
        
        if (clusterElements.length > 0) {
            activeCluster = {
                type: clusterType,
                elements: clusterElements
            };
            
            // Make the cluster glow and pulse
            clusterElements.forEach(element => {
                element.style.transition = 'all 0.3s ease';
                element.style.textShadow = '0 0 15px #00ffff';
                element.style.color = '#00ffff';
            });
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
            point.style.opacity = '1';
            point.style.transform = 'scale(1)';
            point.style.textShadow = 'none';
            point.style.color = 'rgba(0, 255, 255, 0.3)';
        });
    }
    
    // Handle selection drawing
    function startSelection(e) {
        if (!activeCluster) return;
        
        isSelecting = true;
        selectionStart = {
            x: e.clientX - dataField.getBoundingClientRect().left,
            y: e.clientY - dataField.getBoundingClientRect().top
        };
        
        selectionArea = document.createElement('div');
        selectionArea.className = 'selection-area';
        dataField.appendChild(selectionArea);
    }
    
    function updateSelection(e) {
        if (!isSelecting || !selectionStart) return;
        
        const currentPos = {
            x: e.clientX - dataField.getBoundingClientRect().left,
            y: e.clientY - dataField.getBoundingClientRect().top
        };
        
        const left = Math.min(selectionStart.x, currentPos.x);
        const top = Math.min(selectionStart.y, currentPos.y);
        const width = Math.abs(currentPos.x - selectionStart.x);
        const height = Math.abs(currentPos.y - selectionStart.y);
        
        selectionArea.style.left = `${left}px`;
        selectionArea.style.top = `${top}px`;
        selectionArea.style.width = `${width}px`;
        selectionArea.style.height = `${height}px`;
    }
    
    function endSelection() {
        if (!isSelecting) return;
        
        isSelecting = false;
        if (selectionArea) {
            const bounds = selectionArea.getBoundingClientRect();
            const fieldBounds = dataField.getBoundingClientRect();
            
            // Check which numbers are within selection
            if (activeCluster) {
                const selected = activeCluster.elements.filter(point => {
                    const rect = point.getBoundingClientRect();
                    return (
                        rect.left >= bounds.left &&
                        rect.right <= bounds.right &&
                        rect.top >= bounds.top &&
                        rect.bottom <= bounds.bottom
                    );
                });
                
                if (selected.length === activeCluster.elements.length) {
                    // All cluster numbers selected
                    animateNumbersToBox(selected, activeCluster.type);
                }
            }
            
            selectionArea.remove();
            selectionArea = null;
        }
    }
    
    // Animate numbers flowing to category bin
    function animateNumbersToBox(numbers, binIndex) {
        const categoryBin = document.querySelectorAll('.category-bin')[binIndex];
        const binRect = categoryBin.getBoundingClientRect();
        const binCenter = {
            x: binRect.left + binRect.width / 2,
            y: binRect.top + binRect.height / 2
        };
        
        // Create copies of numbers for animation
        numbers.forEach((point, index) => {
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
                point.classList.remove('active');
                point.style.opacity = '1'; // Reset opacity
                point.style.textShadow = 'none';
                point.style.color = 'rgba(0, 255, 255, 0.3)';
            });
            activeCluster = null;
            
            // Immediately try to create a new cluster
            setTimeout(createCluster, 500);
        }
    }
    
    // Initialize
    generateGrid();
    
    // Event listeners
    dataField.addEventListener('mousedown', startSelection);
    dataField.addEventListener('mousemove', updateSelection);
    document.addEventListener('mouseup', endSelection);
    
    // Remove automatic cluster creation and screen effects
    function addScreenEffects() {
        // Disabled
        return;
    }
    
    // Add CRT effects
    addScreenEffects();
    
    // Start creating clusters and ensure they keep going
    scheduleNewCluster();
    setInterval(() => {
        if (!activeCluster) {
            createCluster();
        }
    }, 3000);
} 