// API Configuration
const API_URL = 'http://localhost:5000';

// Get auth token
function getAuthToken() {
    return sessionStorage.getItem('adminToken') || '';
}

// Get auth headers
function getAuthHeaders() {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        'X-Auth-Token': token
    };
}

// Check authentication
if (sessionStorage.getItem('adminLoggedIn') !== 'true') {
    window.location.href = 'admin-login.html';
}

// Display username
document.getElementById('adminUsername').textContent = sessionStorage.getItem('adminUsername') || 'Admin';

// Store messages globally
let messages = [];
let currentMessageId = null;

// Store projects globally
let projects = [];

// Store skills globally
let skills = [];
let currentProjectId = null;

// Load messages from Flask API
function loadMessages() {
    fetch(`${API_URL}/api/messages`, {
        method: 'GET',
        headers: getAuthHeaders()
    })
    .then(response => {
        if (response.status === 401) {
            // Unauthorized - redirect to login
            sessionStorage.removeItem('adminLoggedIn');
            window.location.href = 'admin-login.html';
            return;
        }
        return response.json();
    })
    .then(data => {
        if (data && data.success) {
            messages = data.messages;
            updateStats(messages);
            displayMessages(messages);
        } else {
            console.error('Error loading messages:', data);
            messagesList.innerHTML = '<div class="empty-state"><p>Error loading messages</p></div>';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        messagesList.innerHTML = '<div class="empty-state"><p>Connection error. Please check if the server is running.</p></div>';
    });
}

// Update statistics
function updateStats(messages) {
    const total = messages.length;
    const unread = messages.filter(m => !m.read).length;
    const replied = messages.filter(m => m.replied).length;
    
    document.getElementById('totalMessages').textContent = total;
    document.getElementById('unreadMessages').textContent = unread;
    document.getElementById('repliedMessages').textContent = replied;
}

// Display messages
function displayMessages(messages) {
    const messagesList = document.getElementById('messagesList');
    
    if (messages.length === 0) {
        messagesList.innerHTML = '<div class="empty-state"><p>No messages yet</p></div>';
        return;
    }
    
    messagesList.innerHTML = messages.map((message) => `
        <div class="message-card ${!message.read ? 'unread' : ''} ${message.replied ? 'replied' : ''}">
            <div class="message-header">
                <div class="message-info">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <h3>${escapeHtml(message.name)}</h3>
                        ${message.replied ? '<span class="replied-badge">✓ Replied</span>' : ''}
                    </div>
                    <p>${escapeHtml(message.email)}</p>
                </div>
                <div class="message-date">${formatDate(message.date)}</div>
            </div>
            <div class="message-content">
                <div class="subject">${escapeHtml(message.subject)}</div>
                <div class="message-text">${escapeHtml(message.message)}</div>
            </div>
            <div class="message-status">
                <label class="status-checkbox">
                    <input type="checkbox" ${message.replied ? 'checked' : ''} disabled>
                    <span>Replied to user</span>
                </label>
            </div>
            <div class="message-actions">
                <button class="btn-reply" onclick="openReplyModal(${message.id})" ${message.replied ? 'style="opacity: 0.6;"' : ''}>${message.replied ? 'Reply Again' : 'Reply'}</button>
                <button class="btn-delete" onclick="deleteMessage(${message.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Open reply modal
function openReplyModal(messageId) {
    const message = messages.find(m => m.id === messageId);
    
    if (!message) return;
    
    currentMessageId = messageId;
    
    // Pre-fill form
    document.getElementById('replyTo').value = message.email;
    document.getElementById('replySubject').value = `Re: ${message.subject}`;
    document.getElementById('replyMessage').value = `\n\n--- Original Message ---\n${message.message}`;
    
    // Mark as read via API
    fetch(`${API_URL}/api/messages/${messageId}/read`, {
        method: 'PUT',
        headers: getAuthHeaders()
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Reload messages to update read status
            loadMessages();
        }
    })
    .catch(error => console.error('Error marking as read:', error));
    
    // Show modal
    document.getElementById('replyModal').classList.add('show');
}

// Close modal
function closeModal() {
    document.getElementById('replyModal').classList.remove('show');
    currentMessageId = null;
}

// Send reply email
document.getElementById('replyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!currentMessageId) return;
    
    const replyData = {
        to: document.getElementById('replyTo').value,
        subject: document.getElementById('replySubject').value,
        message: document.getElementById('replyMessage').value
    };
    
    // Send email via Flask API
    fetch(`${API_URL}/api/send-email`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(replyData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Mark as replied
            fetch(`${API_URL}/api/messages/${currentMessageId}/replied`, {
                method: 'PUT',
                headers: getAuthHeaders()
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Close modal first
                    closeModal();
                    
                    // Show success message
                    showSuccessMessage('✓ You replied to the user!');
                    
                    // Reload messages to update the checkbox and badge
                    loadMessages();
                }
            })
            .catch(error => {
                console.error('Error marking as replied:', error);
                showSuccessMessage('Email sent but failed to update status.');
            });
        } else {
            alert('Error sending email: ' + (data.error || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Error sending email:', error);
        alert('Error sending email. Please try again.');
    });
});

// Delete message
function deleteMessage(messageId) {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    fetch(`${API_URL}/api/messages/${messageId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Reload messages
            loadMessages();
        } else {
            alert('Error deleting message');
        }
    })
    .catch(error => {
        console.error('Error deleting message:', error);
        alert('Error deleting message. Please try again.');
    });
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Logout
function logout() {
    // Call logout API
    fetch(`${API_URL}/api/admin/logout`, {
        method: 'POST'
    })
    .then(() => {
        sessionStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('adminUsername');
        window.location.href = 'admin-login.html';
    })
    .catch(error => {
        console.error('Error logging out:', error);
        // Still logout locally
        sessionStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('adminUsername');
        window.location.href = 'admin-login.html';
    });
}

// Close modal on outside click
document.getElementById('replyModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Show success message
function showSuccessMessage(message) {
    // Create or get notification element
    let notification = document.getElementById('successNotification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'successNotification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(100, 200, 255, 0.95);
            color: #ffffff;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(100, 200, 255, 0.4);
            z-index: 10000;
            font-weight: 500;
            letter-spacing: 0.05em;
            animation: slideInRight 0.3s ease-out;
        `;
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.style.display = 'block';
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 300);
    }, 3000);
}

// Add CSS animations for notification
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// PROJECTS MANAGEMENT
// ============================================

// Load projects from Flask API
function loadProjects() {
    fetch(`${API_URL}/api/projects`, {
        method: 'GET',
        headers: getAuthHeaders()
    })
    .then(response => {
        if (response.status === 401) {
            sessionStorage.removeItem('adminLoggedIn');
            window.location.href = 'admin-login.html';
            return;
        }
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data && data.success) {
            projects = data.projects || [];
            displayProjects(projects);
        } else {
            console.error('Failed to load projects:', data);
            projects = [];
            displayProjects([]);
        }
    })
    .catch(error => {
        console.error('Error loading projects:', error);
        projects = [];
        displayProjects([]);
    });
}

// Display projects
function displayProjects(projectsList) {
    const projectsListContainer = document.getElementById('projectsList');
    
    if (!projectsListContainer) {
        console.error('Projects list container not found');
        return;
    }
    
    if (!projectsList || projectsList.length === 0) {
        projectsListContainer.innerHTML = '<p style="color: #888; text-align: center; padding: 2rem;">No projects yet. Click "Add Project" to create one.</p>';
        return;
    }
    
    projectsListContainer.innerHTML = projectsList.map(project => {
        const statusClass = project.status === 'live' ? 'live' : 'draft';
        const statusText = project.status === 'live' ? 'LIVE' : 'DRAFT';
        const toggleText = project.status === 'live' ? 'Move to Draft' : 'Publish Live';
        
        const stackTags = project.stack && project.stack.length > 0 
            ? project.stack.map(tag => `<span class="project-stack-tag">${escapeHtml(tag)}</span>`).join('')
            : '<span class="project-stack-tag">No stack defined</span>';
        
        return `
            <div class="project-card">
                <div class="project-card-header">
                    <div>
                        <h3 class="project-card-title">${escapeHtml(project.name)}</h3>
                        <span class="project-status ${statusClass}">${statusText}</span>
                    </div>
                </div>
                <p class="project-card-mission">${escapeHtml(project.mission || 'No mission description')}</p>
                <div class="project-card-stack">
                    ${stackTags}
                </div>
                <div class="project-card-actions">
                    <button class="btn-edit" onclick="editProject(${project.id})">Edit</button>
                    <button class="btn-toggle-status" onclick="toggleProjectStatus(${project.id}, '${project.status}')">${toggleText}</button>
                    <button class="btn-delete-project" onclick="deleteProject(${project.id})">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

// Open project modal (for add/edit)
function openProjectModal(projectId = null) {
    const modal = document.getElementById('projectModal');
    const form = document.getElementById('projectForm');
    const title = document.getElementById('projectModalTitle');
    
    if (!modal || !form || !title) {
        console.error('Project modal elements not found');
        return;
    }
    
    if (projectId) {
        // Edit mode - clear old image data first
        clearImageData();
        
        const project = projects.find(p => p.id === projectId);
        if (project) {
            title.textContent = 'Edit Project';
            document.getElementById('projectId').value = project.id;
            document.getElementById('projectName').value = project.name || '';
            document.getElementById('projectMission').value = project.mission || '';
            document.getElementById('projectMissionBrief').value = project.missionBrief || '';
            document.getElementById('projectArchitecture').value = project.architecture || '';
            document.getElementById('projectStack').value = project.stack ? project.stack.join(', ') : '';
            document.getElementById('projectImages').value = project.images ? project.images.join('\n') : '';
            document.getElementById('projectLinkedIn').value = project.linkedInLink || '';
            const reportInput = document.getElementById('projectReport');
            const hasReportCheckbox = document.getElementById('projectHasReport');
            if (reportInput) {
                reportInput.value = project.reportFile || '';
            }
            if (hasReportCheckbox) {
                hasReportCheckbox.checked = !!(project.reportFile && project.reportFile.trim());
            }
            document.getElementById('projectStability').value = project.statusValues?.stability || 0;
            document.getElementById('projectRange').value = project.statusValues?.range || 0;
            document.getElementById('projectReliability').value = project.statusValues?.reliability || 0;
            document.getElementById('projectStatus').value = project.status || 'draft';
            currentProjectId = projectId;
            
            // Trigger preview update after a short delay to ensure textarea is updated
            setTimeout(() => {
                const textarea = document.getElementById('projectImages');
                if (textarea) {
                    // Trigger input event to update previews
                    textarea.dispatchEvent(new Event('input'));
                }
            }, 100);
        }
    } else {
        // Add mode - clear everything
        title.textContent = 'Add New Project';
        form.reset();
        const projectIdInput = document.getElementById('projectId');
        if (projectIdInput) {
            projectIdInput.value = '';
        }
            const reportInput = document.getElementById('projectReport');
            if (reportInput) {
                reportInput.value = '';
            }
            const hasReportCheckbox = document.getElementById('projectHasReport');
            if (hasReportCheckbox) {
                hasReportCheckbox.checked = false;
            }
        currentProjectId = null;
        
        // Clear image data and previews for new project
        clearImageData();
    }
    
    modal.style.display = 'flex';
}

// Clear image data and previews
function clearImageData() {
    imageData.clear();
    const previewList = document.getElementById('imagePreviewList');
    if (previewList) {
        previewList.innerHTML = '';
    }
    const textarea = document.getElementById('projectImages');
    if (textarea) {
        textarea.value = '';
    }
}

// Close project modal
function closeProjectModal() {
    document.getElementById('projectModal').style.display = 'none';
    document.getElementById('projectForm').reset();
    currentProjectId = null;
    // Clear image data when closing modal
    clearImageData();
}

// Save project (create or update)
function saveProject(projectData) {
    const url = currentProjectId 
        ? `${API_URL}/api/projects/${currentProjectId}`
        : `${API_URL}/api/projects`;
    
    const method = currentProjectId ? 'PUT' : 'POST';
    
    fetch(url, {
        method: method,
        headers: getAuthHeaders(),
        body: JSON.stringify(projectData)
    })
    .then(response => {
        if (response.status === 401) {
            sessionStorage.removeItem('adminLoggedIn');
            window.location.href = 'admin-login.html';
            return;
        }
        return response.json();
    })
    .then(data => {
        if (data && data.success) {
            showSuccessMessage(currentProjectId ? 'Project updated successfully!' : 'Project created successfully!');
            loadProjects();
            closeProjectModal();
        } else {
            alert('Error: ' + (data.error || 'Failed to save project'));
        }
    })
    .catch(error => {
        console.error('Error saving project:', error);
        alert('Error saving project. Please try again.');
    });
}

// Edit project
function editProject(projectId) {
    openProjectModal(projectId);
}

// Delete project
function deleteProject(projectId) {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
        return;
    }
    
    fetch(`${API_URL}/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    })
    .then(response => {
        if (response.status === 401) {
            sessionStorage.removeItem('adminLoggedIn');
            window.location.href = 'admin-login.html';
            return;
        }
        return response.json();
    })
    .then(data => {
        if (data && data.success) {
            showSuccessMessage('Project deleted successfully!');
            loadProjects();
        } else {
            alert('Error: ' + (data.error || 'Failed to delete project'));
        }
    })
    .catch(error => {
        console.error('Error deleting project:', error);
        alert('Error deleting project. Please try again.');
    });
}

// Toggle project status (live/draft)
function toggleProjectStatus(projectId, currentStatus) {
    const newStatus = currentStatus === 'live' ? 'draft' : 'live';
    
    fetch(`${API_URL}/api/projects/${projectId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
    })
    .then(response => {
        if (response.status === 401) {
            sessionStorage.removeItem('adminLoggedIn');
            window.location.href = 'admin-login.html';
            return;
        }
        return response.json();
    })
    .then(data => {
        if (data && data.success) {
            showSuccessMessage(`Project ${newStatus === 'live' ? 'published' : 'moved to draft'}!`);
            loadProjects();
        } else {
            alert('Error: ' + (data.error || 'Failed to update project status'));
        }
    })
    .catch(error => {
        console.error('Error updating project status:', error);
        alert('Error updating project status. Please try again.');
    });
}

// Handle project form submission
document.addEventListener('DOMContentLoaded', function() {
    const projectForm = document.getElementById('projectForm');
    if (projectForm) {
        projectForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const stackArray = document.getElementById('projectStack').value
                .split(',')
                .map(s => s.trim())
                .filter(s => s.length > 0);
            
            const imagesArray = document.getElementById('projectImages').value
                .split('\n')
                .map(s => s.trim())
                .filter(s => s.length > 0);
            
            // Limit to 20 images
            if (imagesArray.length > 20) {
                alert(`Maximum 20 images allowed. You have ${imagesArray.length} images. Please remove ${imagesArray.length - 20} image(s).`);
                return;
            }
            
            const hasReportCheckbox = document.getElementById('projectHasReport');
            const hasReport = hasReportCheckbox ? hasReportCheckbox.checked : false;
            const reportValue = document.getElementById('projectReport')
                ? document.getElementById('projectReport').value.trim()
                : '';
            
            const projectData = {
                name: document.getElementById('projectName').value,
                mission: document.getElementById('projectMission').value,
                missionBrief: document.getElementById('projectMissionBrief').value,
                architecture: document.getElementById('projectArchitecture').value,
                stack: stackArray,
                images: imagesArray,
                linkedInLink: document.getElementById('projectLinkedIn').value.trim(),
                reportFile: hasReport ? reportValue : '',
                stability: parseInt(document.getElementById('projectStability').value) || 0,
                range: parseInt(document.getElementById('projectRange').value) || 0,
                reliability: parseInt(document.getElementById('projectReliability').value) || 0,
                status: document.getElementById('projectStatus').value
            };
            
            saveProject(projectData);
        });
    }
    
    // Close modal on background click
    const projectModal = document.getElementById('projectModal');
    if (projectModal) {
        projectModal.addEventListener('click', function(e) {
            if (e.target === projectModal) {
                closeProjectModal();
            }
        });
    }
    
    // Load projects on page load
    loadProjects();
    
    // Initialize drag and drop for images
    initImageDragAndDrop();

    // Initialize drag and drop for PDF report
    initPdfDragAndDrop();
});

// Store image data globally so it can be cleared when needed
let imageData = new Map();

// Initialize drag and drop functionality for images
function initImageDragAndDrop() {
    const dropzone = document.getElementById('imageDropzone');
    const fileInput = document.getElementById('imageFileInput');
    const textarea = document.getElementById('projectImages');
    const previewList = document.getElementById('imagePreviewList');
    
    if (!dropzone || !fileInput || !textarea) return;
    
    // Click to browse
    dropzone.addEventListener('click', () => {
        fileInput.click();
    });
    
    // File input change
    fileInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files).map(file => ({ file, path: null }));
        await handleFiles(files);
        fileInput.value = ''; // Reset input
    });
    
    // Drag and drop events
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('drag-over');
    });
    
    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('drag-over');
    });
    
    dropzone.addEventListener('drop', async (e) => {
        e.preventDefault();
        dropzone.classList.remove('drag-over');
        
        const files = Array.from(e.dataTransfer.files).filter(file => 
            file.type.startsWith('image/')
        );
        
        // Try to get file paths from dataTransfer
        const items = Array.from(e.dataTransfer.items);
        const filePaths = [];
        
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.kind === 'file') {
                const file = item.getAsFile();
                if (file && file.type.startsWith('image/')) {
                    // Try to get the full path
                    let filePath = null;
                    
                    // Method 1: Check if file has path property (Electron/Node.js environments)
                    if (file.path) {
                        filePath = file.path;
                    }
                    // Method 2: Try to get from webkitGetAsEntry (Chrome)
                    else if (item.webkitGetAsEntry) {
                        const entry = item.webkitGetAsEntry();
                        if (entry && entry.fullPath) {
                            // This gives relative path, we need to construct full path
                            // For now, we'll use a workaround
                        }
                    }
                    // Method 3: Check dataTransfer.getData for file paths (some browsers)
                    const data = e.dataTransfer.getData('text/plain');
                    if (data && data.includes('\\') && data.endsWith(file.name)) {
                        filePath = data;
                    }
                    
                    filePaths.push({ file, path: filePath || null });
                }
            }
        }
        
        // If we couldn't get paths from items, use files array
        if (filePaths.length === 0) {
            files.forEach(file => {
                filePaths.push({ file, path: null });
            });
        }
        
        if (filePaths.length > 0) {
            await handleFiles(filePaths);
        }
    });
    
    // Handle dropped/selected files
    async function handleFiles(fileData) {
        // Check current image count
        const currentPaths = getPathsFromTextarea();
        const maxImages = 20;
        
        if (currentPaths.length + fileData.length > maxImages) {
            const allowed = maxImages - currentPaths.length;
            if (allowed <= 0) {
                alert(`Maximum ${maxImages} images allowed. Please remove some images first.`);
                return;
            }
            alert(`Maximum ${maxImages} images allowed. Only adding first ${allowed} image(s).`);
            fileData = fileData.slice(0, allowed);
        }
        
        for (const { file, path } of fileData) {
            const fileName = file.name;
            
            // Determine the path to use
            let filePath = path;
            
            // If we don't have a path, try to construct it or prompt user
            if (!filePath) {
                // Try to get path from File System Access API if available
                if (file.handle && file.handle.getParent) {
                    try {
                        const parent = await file.handle.getParent();
                        const parentPath = await parent.resolve(file.handle);
                        filePath = parentPath.join('\\') + '\\' + fileName;
                    } catch (e) {
                        // Fallback: construct likely path
                        filePath = constructPathFromFilename(fileName);
                    }
                } else {
                    // Construct likely path based on common structure
                    filePath = constructPathFromFilename(fileName);
                }
            }
            
            // Show preview from file
            const reader = new FileReader();
            reader.onload = (e) => {
                imageData.set(filePath, {
                    path: filePath,
                    preview: e.target.result,
                    fileName: fileName
                });
                
                // Add path to textarea
                const currentPaths = getPathsFromTextarea();
                if (!currentPaths.includes(filePath)) {
                    currentPaths.push(filePath);
                    textarea.value = currentPaths.join('\n');
                }
                
                updatePreviews();
            };
            reader.readAsDataURL(file);
        }
    }
    
    // Construct likely path from filename
    function constructPathFromFilename(fileName) {
        // Check existing paths in textarea to detect pattern
        const existingPaths = getPathsFromTextarea();
        if (existingPaths.length > 0) {
            // Find a path that contains similar filename pattern
            for (const existingPath of existingPaths) {
                if (existingPath.includes('\\') || existingPath.includes('/')) {
                    // Extract directory structure
                    const dirMatch = existingPath.match(/(.+[\/\\])([^\/\\]+)$/);
                    if (dirMatch) {
                        const directory = dirMatch[1];
                        // Use the same directory structure
                        return directory.replace(/\//g, '\\') + fileName;
                    }
                }
            }
        }
        
        // Fallback: just use the filename.
        // This avoids forcing everything into a fixed folder like por1.
        // If you want a specific folder (e.g. image/project/por3),
        // type or paste the full/relative path manually in the textarea.
        return fileName;
    }
    
    // Update previews based on current paths
    function updatePreviews() {
        previewList.innerHTML = '';
        const paths = getPathsFromTextarea();
        
        paths.forEach((path, index) => {
            const normalizedPath = normalizePathForDisplay(path);
            const isAbsolutePath = path.includes(':') || path.startsWith('D:\\') || path.startsWith('C:\\');
            
            // Check if we have a preview for this path (from drag-and-drop)
            let previewSrc = null;
            let useDataUrl = false;
            
            if (imageData.has(path)) {
                previewSrc = imageData.get(path).preview;
                useDataUrl = true;
            } else if (!isAbsolutePath && normalizedPath.startsWith('image/')) {
                // Try to load relative path (only works if file exists on server)
                previewSrc = normalizedPath;
            }
            
            const previewItem = document.createElement('div');
            previewItem.className = 'image-preview-item';
            previewItem.dataset.path = path;
            previewItem.dataset.index = index;
            previewItem.title = path; // Show full path on hover
            
            if (previewSrc) {
                previewItem.innerHTML = `
                    <img src="${previewSrc}" alt="${path}" onerror="this.parentElement.querySelector('.path-label').style.display='block'; this.style.display='none';">
                    <div class="path-label" style="display: none; font-size: 8px; color: #888; padding: 4px; word-break: break-all;">${normalizedPath.split('/').pop()}</div>
                    <button type="button" class="remove-image" onclick="removeImageByIndex(${index})">×</button>
                `;
            } else {
                // Show placeholder for absolute paths or paths that can't be loaded
                const fileName = path.split(/[/\\]/).pop() || 'Image';
                previewItem.innerHTML = `
                    <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: rgba(100, 200, 255, 0.1); border: 1px dashed rgba(100, 200, 255, 0.3);">
                        <div style="text-align: center; padding: 4px;">
                            <div style="font-size: 20px; color: #64c8ff; margin-bottom: 4px;">📷</div>
                            <div class="path-label" style="font-size: 8px; color: #888; word-break: break-all;">${fileName}</div>
                        </div>
                    </div>
                    <button type="button" class="remove-image" onclick="removeImageByIndex(${index})">×</button>
                `;
            }
            
            previewList.appendChild(previewItem);
        });
    }
    
    // Normalize path for display (convert absolute to relative)
    function normalizePathForDisplay(path) {
        if (!path) return '';
        const normalized = path.replace(/\\/g, '/');
        if (normalized.toLowerCase().includes('image')) {
            const parts = normalized.split('/');
            const imageIndex = parts.findIndex(p => p.toLowerCase() === 'image');
            if (imageIndex >= 0) {
                return parts.slice(imageIndex).join('/');
            }
        }
        if (normalized.startsWith('image/')) {
            return normalized;
        }
        return `image/${normalized.split('/').pop()}`;
    }
    
    // Get paths from textarea
    function getPathsFromTextarea() {
        return textarea.value.split('\n')
            .map(line => line.trim())
            .filter(line => line);
    }
    
    // Update textarea from imageData
    function updateTextarea() {
        const paths = Array.from(imageData.keys());
        if (paths.length > 0) {
            // Don't overwrite if user is typing
            const currentPaths = getPathsFromTextarea();
            if (currentPaths.length === 0 || paths.some(p => !currentPaths.includes(p))) {
                textarea.value = paths.join('\n');
            }
        }
    }
    
    // Remove image by index
    window.removeImageByIndex = function(index) {
        const paths = getPathsFromTextarea();
        if (index >= 0 && index < paths.length) {
            const pathToRemove = paths[index];
            imageData.delete(pathToRemove);
            paths.splice(index, 1);
            textarea.value = paths.join('\n');
            updatePreviews();
        }
    };
    
    // Handle textarea input - update previews when paths change
    textarea.addEventListener('input', () => {
        const paths = getPathsFromTextarea();
        if (paths.length > 20) {
            alert(`Maximum 20 images allowed. Please remove ${paths.length - 20} image(s).`);
            // Remove excess images
            const limitedPaths = paths.slice(0, 20);
            textarea.value = limitedPaths.join('\n');
        }
        updatePreviews();
    });
    
    // Handle paste in textarea
    textarea.addEventListener('paste', (e) => {
        setTimeout(() => {
            updatePreviews();
        }, 10);
    });
    
    // Initial update
    updatePreviews();
}

// Initialize drag and drop for single PDF report
function initPdfDragAndDrop() {
    const dropzone = document.getElementById('pdfDropzone');
    const fileInput = document.getElementById('pdfFileInput');
    const reportInput = document.getElementById('projectReport');
    const note = document.getElementById('pdfDropzoneNote');
    const hasReportCheckbox = document.getElementById('projectHasReport');

    if (!dropzone || !fileInput || !reportInput) return;

    // Helper: enable/disable controls based on checkbox
    function updatePdfControlsState() {
        const enabled = !hasReportCheckbox || hasReportCheckbox.checked;
        if (enabled) {
            dropzone.classList.remove('disabled');
            reportInput.classList.remove('pdf-input-disabled');
            reportInput.removeAttribute('disabled');
        } else {
            dropzone.classList.add('disabled');
            reportInput.classList.add('pdf-input-disabled');
            reportInput.setAttribute('disabled', 'disabled');
            reportInput.value = '';
            if (note) {
                note.textContent = 'PDF disabled for this project (checkbox is off).';
            }
        }
    }

    if (hasReportCheckbox) {
        hasReportCheckbox.addEventListener('change', updatePdfControlsState);
    }

    // Initial state
    updatePdfControlsState();

    // Click to browse
    dropzone.addEventListener('click', () => {
        fileInput.click();
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handlePdfFile(file);
        }
        fileInput.value = '';
    });

    // Drag & drop events
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('drag-over');
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('drag-over');
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('drag-over');

        const file = e.dataTransfer.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            alert('Please drop a PDF file.');
            return;
        }

        handlePdfFile(file);
    });

    function handlePdfFile(file) {
        const fileName = file.name;
        let currentPath = reportInput.value.trim();
        let finalPath = '';

        // If user already set a path, keep its folder and replace filename
        if (currentPath) {
            const match = currentPath.match(/(.+[\/\\])([^\/\\]+)$/);
            if (match) {
                const dir = match[1].replace(/\\/g, '/');
                finalPath = `${dir}${fileName}`.replace(/\/{2,}/g, '/');
            }
        }

        // Default folder: docs/
        if (!finalPath) {
            finalPath = `docs/${fileName}`;
        }

        reportInput.value = finalPath;
        if (hasReportCheckbox) {
            hasReportCheckbox.checked = true;
            updatePdfControlsState();
        }
        if (note) {
            note.textContent = `Selected: ${fileName} → ${finalPath}`;
        }
    }
}

// Load messages on page load
loadMessages();

// ============================================
// SKILLS MANAGEMENT
// ============================================

function loadSkills() {
    fetch(`${API_URL}/api/skills`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
        // No credentials needed for GET request (public endpoint)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            skills = data.skills;
            displaySkills(skills);
        } else {
            console.error('Error loading skills:', data);
            const skillsList = document.getElementById('skillsList');
            if (skillsList) {
                skillsList.innerHTML = '<div class="empty-state"><p>Error loading skills</p></div>';
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        const skillsList = document.getElementById('skillsList');
        if (skillsList) {
            skillsList.innerHTML = '<div class="empty-state"><p>Connection error. Please check if the server is running.</p></div>';
        }
    });
}

function displaySkills(skillsList) {
    const skillsListContainer = document.getElementById('skillsList');
    if (!skillsListContainer) {
        console.error('Skills list container not found');
        return;
    }

    if (skillsList.length === 0) {
        skillsListContainer.innerHTML = '<div class="empty-state"><p>No skills added yet. Click "Add Skill" to get started.</p></div>';
        return;
    }

    skillsListContainer.innerHTML = skillsList.map(skill => `
        <div class="project-card" style="max-width: 400px;">
            <div class="project-card-header">
                <div>
                    <h3 class="project-card-title">${skill.name}</h3>
                    <div style="margin-top: 0.5rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                            <span style="color: #888; font-size: 0.9rem;">Proficiency</span>
                            <span style="color: #64c8ff; font-weight: 600;">${skill.percentage}%</span>
                        </div>
                        <div style="width: 100%; height: 8px; background: rgba(100, 200, 255, 0.1); border-radius: 4px; overflow: hidden;">
                            <div style="width: ${skill.percentage}%; height: 100%; background: linear-gradient(90deg, #64c8ff, #8a2be2); border-radius: 4px; transition: width 0.3s ease;"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="project-card-actions">
                <button class="btn-edit" onclick="openSkillModal(${skill.id})">Edit</button>
                <button class="btn-delete-project" onclick="deleteSkill(${skill.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function openSkillModal(skillId = null) {
    const modal = document.getElementById('skillModal');
    const form = document.getElementById('skillForm');
    const title = document.getElementById('skillModalTitle');
    
    if (skillId) {
        const skill = skills.find(s => s.id === skillId);
        if (skill) {
            title.textContent = 'Edit Skill';
            document.getElementById('skillId').value = skill.id;
            document.getElementById('skillName').value = skill.name;
            document.getElementById('skillPercentage').value = skill.percentage;
        }
    } else {
        title.textContent = 'Add New Skill';
        form.reset();
        document.getElementById('skillId').value = '';
    }
    
    modal.style.display = 'flex';
}

function closeSkillModal() {
    document.getElementById('skillModal').style.display = 'none';
    document.getElementById('skillForm').reset();
    document.getElementById('skillId').value = '';
}

function deleteSkill(skillId) {
    if (!confirm('Are you sure you want to delete this skill?')) {
        return;
    }

    fetch(`${API_URL}/api/skills/${skillId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadSkills();
        } else {
            alert('Error deleting skill');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error deleting skill');
    });
}

// Add event listener for skill form
document.addEventListener('DOMContentLoaded', function() {
    const skillForm = document.getElementById('skillForm');
    if (skillForm) {
        skillForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const skillId = document.getElementById('skillId').value;
            const skillData = {
                name: document.getElementById('skillName').value,
                percentage: parseInt(document.getElementById('skillPercentage').value)
            };

            if (skillId) {
                // Update existing skill
                fetch(`${API_URL}/api/skills/${skillId}`, {
                    method: 'PUT',
                    headers: getAuthHeaders(),
                    credentials: 'include',
                    body: JSON.stringify(skillData)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        closeSkillModal();
                        loadSkills();
                    } else {
                        alert('Error updating skill');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error updating skill');
                });
            } else {
                // Create new skill
                fetch(`${API_URL}/api/skills`, {
                    method: 'POST',
                    headers: getAuthHeaders(),
                    credentials: 'include',
                    body: JSON.stringify(skillData)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        closeSkillModal();
                        loadSkills();
                    } else {
                        alert('Error creating skill');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error creating skill');
                });
            }
        });
    }
    
    // Load skills on page load
    loadSkills();
});
