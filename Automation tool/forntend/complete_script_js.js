// ============================================
// MOCK DATA
// ============================================

const mockVideos = [
    {
        id: 1,
        title: 'Summer Campaign Video',
        client: 'Acme Corp',
        platform: 'youtube',
        uploadDate: '2025-12-25',
        status: 'pending',
        uploader: 'John Editor'
    },
    {
        id: 2,
        title: 'Product Launch Teaser',
        client: 'TechStart Inc',
        platform: 'instagram',
        uploadDate: '2025-12-24',
        status: 'approved',
        uploader: 'John Editor'
    },
    {
        id: 3,
        title: 'Behind the Scenes',
        client: 'Brand Studio',
        platform: 'tiktok',
        uploadDate: '2025-12-23',
        status: 'changes',
        uploader: 'John Editor'
    },
    {
        id: 4,
        title: 'Holiday Special',
        client: 'Creative Agency',
        platform: 'facebook',
        uploadDate: '2025-12-22',
        status: 'approved',
        uploader: 'John Editor'
    },
    {
        id: 5,
        title: 'Q4 Recap Video',
        client: 'Acme Corp',
        platform: 'youtube',
        uploadDate: '2025-12-21',
        status: 'pending',
        uploader: 'John Editor'
    }
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Format date to readable string
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Get status badge HTML
function getStatusBadge(status) {
    const statusMap = {
        'pending': 'Pending Review',
        'approved': 'Approved',
        'changes': 'Changes Requested'
    };
    return `<span class="status-badge ${status}">${statusMap[status]}</span>`;
}

// Get platform tag HTML
function getPlatformTag(platform) {
    const platformMap = {
        'youtube': 'YouTube',
        'instagram': 'Instagram',
        'tiktok': 'TikTok',
        'facebook': 'Facebook'
    };
    return `<span class="platform-tag ${platform}">${platformMap[platform]}</span>`;
}

// Show notification (mock)
function showNotification(message, type = 'success') {
    alert(message); // In production, use a proper notification system
}

// ============================================
// AUTHENTICATION
// ============================================

// Check if user is logged in
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    const isAuthPage = window.location.pathname.includes('index.html') || 
                       window.location.pathname === '/' ||
                       window.location.pathname === '';
    
    if (!currentUser && !isAuthPage) {
        window.location.href = 'index.html';
        return false;
    }
    
    if (currentUser && !isAuthPage) {
        updateUserDisplay();
    }
    
    return true;
}

// Update user display in navbar
function updateUserDisplay() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userNameElements = document.querySelectorAll('#userName');
    
    userNameElements.forEach(el => {
        if (el && currentUser) {
            el.textContent = currentUser.name;
        }
    });
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// ============================================
// LOGIN PAGE
// ============================================

if (document.getElementById('loginForm')) {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Mock authentication
        let userData = null;
        
        if (email === 'editor@demo.com' && password === 'password') {
            userData = {
                id: 1,
                email: email,
                name: 'Editor User',
                role: 'editor'
            };
        } else if (email === 'client@demo.com' && password === 'password') {
            userData = {
                id: 2,
                email: email,
                name: 'Client User',
                role: 'client'
            };
        }
        
        if (userData) {
            localStorage.setItem('currentUser', JSON.stringify(userData));
            
            // Redirect based on role
            if (userData.role === 'editor') {
                window.location.href = 'dashboard.html';
            } else {
                window.location.href = 'review.html';
            }
        } else {
            showNotification('Invalid credentials. Please use demo credentials.', 'error');
        }
    });
}

// ============================================
// DASHBOARD PAGE
// ============================================

if (document.getElementById('videosTableBody')) {
    checkAuth();
    
    // Filter functionality
    const filterBtns = document.querySelectorAll('.tab-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter videos
            const filter = this.getAttribute('data-filter');
            renderVideos(filter);
        });
    });
    
    // Render videos function
    function renderVideos(filter = 'all') {
        const tbody = document.getElementById('videosTableBody');
        let filteredVideos = mockVideos;
        
        if (filter !== 'all') {
            filteredVideos = mockVideos.filter(video => video.status === filter);
        }
        
        if (filteredVideos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 40px; color: var(--text-secondary);">
                        No videos found for this filter.
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = filteredVideos.map(video => `
            <tr>
                <td>
                    <div class="video-info">
                        <div class="video-name">${video.title}</div>
                        <div class="video-client">${video.client}</div>
                    </div>
                </td>
                <td>${getPlatformTag(video.platform)}</td>
                <td>${formatDate(video.uploadDate)}</td>
                <td>${getStatusBadge(video.status)}</td>
                <td>
                    <div class="action-buttons-table">
                        <button class="btn btn-secondary btn-sm" onclick="viewVideo(${video.id})">
                            View
                        </button>
                        <button class="btn btn-text btn-sm" onclick="deleteVideo(${video.id})">
                            Delete
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
    
    // Initial render
    renderVideos('all');
    
    // Video actions
    window.viewVideo = function(id) {
        window.location.href = `review.html?id=${id}`;
    };
    
    window.deleteVideo = function(id) {
        if (confirm('Are you sure you want to delete this video?')) {
            const index = mockVideos.findIndex(v => v.id === id);
            if (index > -1) {
                mockVideos.splice(index, 1);
                renderVideos('all');
                showNotification('Video deleted successfully');
            }
        }
    };
}

// ============================================
// UPLOAD PAGE
// ============================================

if (document.getElementById('uploadForm')) {
    checkAuth();
    
    const dropzone = document.getElementById('dropzone');
    const videoFileInput = document.getElementById('videoFile');
    const filePreview = document.getElementById('filePreview');
    const fileName = document.getElementById('fileName');
    const removeFileBtn = document.getElementById('removeFile');
    
    // Click to upload
    dropzone.addEventListener('click', () => {
        videoFileInput.click();
    });
    
    // File input change
    videoFileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'var(--primary)';
        dropzone.style.background = 'rgba(79, 70, 229, 0.05)';
    });
    
    dropzone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = '';
        dropzone.style.background = '';
    });
    
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = '';
        dropzone.style.background = '';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            videoFileInput.files = files;
            handleFileSelect();
        }
    });
    
    // Handle file selection
    function handleFileSelect() {
        const file = videoFileInput.files[0];
        if (file) {
            fileName.textContent = file.name;
            dropzone.style.display = 'none';
            filePreview.style.display = 'block';
        }
    }
    
    // Remove file
    removeFileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        videoFileInput.value = '';
        dropzone.style.display = 'flex';
        filePreview.style.display = 'none';
    });
    
    // Form submission
    const uploadForm = document.getElementById('uploadForm');
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const title = formData.get('title');
        const caption = formData.get('caption');
        const platform = formData.get('platform');
        const client = formData.get('client');
        const file = videoFileInput.files[0];
        
        // Validation
        if (!file) {
            showNotification('Please select a video file', 'error');
            return;
        }
        
        // Mock upload (in production, this would be an actual API call)
        console.log('Uploading video:', {
            file: file.name,
            title,
            caption,
            platform,
            client
        });
        
        // Simulate upload delay
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Uploading...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            // Add to mock data
            const newVideo = {
                id: mockVideos.length + 1,
                title: title,
                client: client === 'client1' ? 'Acme Corp' : 
                        client === 'client2' ? 'TechStart Inc' :
                        client === 'client3' ? 'Brand Studio' : 'Creative Agency',
                platform: platform,
                uploadDate: new Date().toISOString().split('T')[0],
                status: 'pending',
                uploader: 'John Editor'
            };
            
            mockVideos.unshift(newVideo);
            
            showNotification('Video uploaded successfully!');
            window.location.href = 'dashboard.html';
        }, 2000);
    });
}

// ============================================
// REVIEW PAGE
// ============================================

if (document.getElementById('videoPlayer')) {
    checkAuth();
    
    // Get video ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = parseInt(urlParams.get('id')) || 1;
    
    // Load video data (mock)
    const video = mockVideos.find(v => v.id === videoId) || mockVideos[0];
    
    // Update page with video data
    document.getElementById('videoTitle').textContent = video.title;
    document.getElementById('videoStatus').className = `status-badge ${video.status}`;
    document.getElementById('videoStatus').textContent = 
        video.status === 'pending' ? 'Pending Review' :
        video.status === 'approved' ? 'Approved' : 'Changes Requested';
    document.getElementById('videoPlatform').className = `platform-tag ${video.platform}`;
    document.getElementById('videoPlatform').textContent = 
        video.platform.charAt(0).toUpperCase() + video.platform.slice(1);
    document.getElementById('uploadDate').textContent = formatDate(video.uploadDate);
    document.getElementById('uploadedBy').textContent = video.uploader;
    
    // Comment form
    const commentForm = document.getElementById('commentForm');
    commentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const commentText = document.getElementById('commentText').value;
        
        if (!commentText.trim()) {
            showNotification('Please enter a comment', 'error');
            return;
        }
        
        // Add comment to list (mock)
        const commentsList = document.getElementById('commentsList');
        const newComment = document.createElement('div');
        newComment.className = 'comment-item';
        newComment.innerHTML = `
            <div class="comment-header">
                <strong>Current User</strong>
                <span class="comment-time">Just now</span>
            </div>
            <p class="comment-text">${commentText}</p>
        `;
        commentsList.insertBefore(newComment, commentsList.firstChild);
        
        // Clear form
        document.getElementById('commentText').value = '';
        showNotification('Comment added successfully');
    });
}

// ============================================
// REVIEW ACTIONS (APPROVE/CHANGES)
// ============================================

window.approveVideo = function() {
    const modal = document.getElementById('approvalModal');
    modal.classList.add('active');
};

window.requestChanges = function() {
    const modal = document.getElementById('changesModal');
    modal.classList.add('active');
};

window.closeModal = function() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.classList.remove('active'));
};

window.confirmApproval = function() {
    // Mock API call
    console.log('Video approved');
    
    // Update status
    const statusBadge = document.getElementById('videoStatus');
    statusBadge.className = 'status-badge approved';
    statusBadge.textContent = 'Approved';
    
    closeModal();
    showNotification('Video approved successfully! Editor has been notified.');
};

window.confirmChanges = function() {
    const changesText = document.getElementById('changesText').value;
    
    if (!changesText.trim()) {
        showNotification('Please describe the changes needed', 'error');
        return;
    }
    
    // Mock API call
    console.log('Changes requested:', changesText);
    
    // Update status
    const statusBadge = document.getElementById('videoStatus');
    statusBadge.className = 'status-badge changes';
    statusBadge.textContent = 'Changes Requested';
    
    // Add to comments
    const commentsList = document.getElementById('commentsList');
    const newComment = document.createElement('div');
    newComment.className = 'comment-item';
    newComment.innerHTML = `
        <div class="comment-header">
            <strong>Current User</strong>
            <span class="comment-time">Just now</span>
        </div>
        <p class="comment-text">${changesText}</p>
    `;
    commentsList.insertBefore(newComment, commentsList.firstChild);
    
    closeModal();
    showNotification('Change request submitted! Editor has been notified.');
};

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        closeModal();
    }
});

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
});