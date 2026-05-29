/* ================================================
   DEMORA BASKETBALL — Admin Storage Upload Handler
   ================================================
   Handles image uploads for players and matches using Supabase Storage
   ================================================ */

// Storage configuration
const STORAGE_CONFIG = {
    PLAYER_IMAGES: {
        bucket: 'team-images',
        path: 'players',
        maxFileSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
    },
    PLAYER_GALLERY: {
        bucket: 'player-gallery',
        path: 'players',
        maxFileSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
    },
    MATCH_IMAGES: {
        bucket: 'match-images',
        path: 'matches',
        maxFileSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
    },
    GAME_VIDEOS: {
        bucket: 'game-videos',
        path: 'matches',
        maxFileSize: 50 * 1024 * 1024, // 50MB
        allowedTypes: ['video/mp4', 'video/webm', 'video/quicktime']
    },
    PLAYER_VIDEOS: {
        bucket: 'player-videos',
        path: 'players',
        maxFileSize: 25 * 1024 * 1024, // 25MB (smaller than game videos)
        allowedTypes: ['video/mp4', 'video/webm', 'video/quicktime']
    }
};

// Upload player main image
async function uploadPlayerImage(playerId, file) {
    try {
        if (!window.db) {
            throw new Error('Supabase client not initialized');
        }

        const config = STORAGE_CONFIG.PLAYER_IMAGES;

        // Validate file
        if (!config.allowedTypes.includes(file.type)) {
            throw new Error(`Invalid file type. Allowed: ${config.allowedTypes.join(', ')}`);
        }

        if (file.size > config.maxFileSize) {
            throw new Error(`File size exceeds ${config.maxFileSize / 1024 / 1024}MB limit`);
        }

        // Generate unique filename
        const fileExtension = file.name.split('.').pop();
        const fileName = `${playerId}_${Date.now()}.${fileExtension}`;
        const filePath = `${config.path}/${playerId}/${fileName}`;

        // Upload file
        const { data, error } = await window.db.storage
            .from(config.bucket)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            throw error;
        }

        // Get public URL
        const publicUrl = getStorageUrl(config.bucket, filePath);

        return {
            success: true,
            url: publicUrl,
            path: filePath,
            fileName: fileName
        };

    } catch (err) {
        console.error('Error uploading player image:', err);
        return {
            success: false,
            error: err.message
        };
    }
}

// Upload player gallery images
async function uploadPlayerGallery(playerId, files) {
    try {
        if (!window.db) {
            throw new Error('Supabase client not initialized');
        }

        const config = STORAGE_CONFIG.PLAYER_GALLERY;
        const uploadedImages = [];

        for (const file of files) {
            // Validate file
            if (!config.allowedTypes.includes(file.type)) {
                console.warn(`Skipping ${file.name} - invalid file type`);
                continue;
            }

            if (file.size > config.maxFileSize) {
                console.warn(`Skipping ${file.name} - file too large`);
                continue;
            }

            // Generate unique filename
            const fileExtension = file.name.split('.').pop();
            const fileName = `${playerId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExtension}`;
            const filePath = `${config.path}/${playerId}/gallery/${fileName}`;

            // Upload file
            const { data, error } = await window.db.storage
                .from(config.bucket)
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) {
                console.error(`Error uploading ${file.name}:`, error);
                continue;
            }

            // Get public URL
            const publicUrl = getStorageUrl(config.bucket, filePath);
            uploadedImages.push(publicUrl);
        }

        return {
            success: true,
            urls: uploadedImages,
            count: uploadedImages.length
        };

    } catch (err) {
        console.error('Error uploading player gallery:', err);
        return {
            success: false,
            error: err.message
        };
    }
}

// Upload match logo
async function uploadMatchLogo(matchId, file) {
    try {
        if (!window.db) {
            throw new Error('Supabase client not initialized');
        }

        const config = STORAGE_CONFIG.MATCH_IMAGES;

        // Validate file
        if (!config.allowedTypes.includes(file.type)) {
            throw new Error(`Invalid file type. Allowed: ${config.allowedTypes.join(', ')}`);
        }

        if (file.size > config.maxFileSize) {
            throw new Error(`File size exceeds ${config.maxFileSize / 1024 / 1024}MB limit`);
        }

        // Generate unique filename
        const fileExtension = file.name.split('.').pop();
        const fileName = `${matchId}_${Date.now()}.${fileExtension}`;
        const filePath = `${config.path}/${matchId}/${fileName}`;

        // Upload file
        const { data, error } = await window.db.storage
            .from(config.bucket)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            throw error;
        }

        // Get public URL
        const publicUrl = getStorageUrl(config.bucket, filePath);

        return {
            success: true,
            url: publicUrl,
            path: filePath,
            fileName: fileName
        };

    } catch (err) {
        console.error('Error uploading match logo:', err);
        return {
            success: false,
            error: err.message
        };
    }
}

// Upload game video
async function uploadGameVideo(matchId, file) {
    try {
        if (!window.db) {
            throw new Error('Supabase client not initialized');
        }

        const config = STORAGE_CONFIG.GAME_VIDEOS;

        // Validate file
        if (!config.allowedTypes.includes(file.type)) {
            throw new Error(`Invalid file type. Allowed: ${config.allowedTypes.join(', ')}`);
        }

        if (file.size > config.maxFileSize) {
            throw new Error(`File size exceeds ${config.maxFileSize / 1024 / 1024}MB limit`);
        }

        // Generate unique filename
        const fileExtension = file.name.split('.').pop();
        const fileName = `${matchId}_${Date.now()}.${fileExtension}`;
        const filePath = `${config.path}/${matchId}/${fileName}`;

        // Upload file
        const { data, error } = await window.db.storage
            .from(config.bucket)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            throw error;
        }

        // Get public URL
        const publicUrl = getStorageUrl(config.bucket, filePath);

        return {
            success: true,
            url: publicUrl,
            path: filePath,
            fileName: fileName
        };

    } catch (err) {
        console.error('Error uploading game video:', err);
        return {
            success: false,
            error: err.message
        };
    }
}

// Upload player profile video
async function uploadPlayerVideo(playerId, file) {
    try {
        if (!window.db) {
            throw new Error('Supabase client not initialized');
        }

        const config = STORAGE_CONFIG.PLAYER_VIDEOS;

        // Validate file
        if (!config.allowedTypes.includes(file.type)) {
            throw new Error(`Invalid file type. Allowed: ${config.allowedTypes.join(', ')}`);
        }

        if (file.size > config.maxFileSize) {
            throw new Error(`File size exceeds ${config.maxFileSize / 1024 / 1024}MB limit`);
        }

        // Generate unique filename
        const fileExtension = file.name.split('.').pop();
        const fileName = `${playerId}_${Date.now()}.${fileExtension}`;
        const filePath = `${config.path}/${playerId}/videos/${fileName}`;

        // Upload file
        const { data, error } = await window.db.storage
            .from(config.bucket)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            throw error;
        }

        // Get public URL
        const publicUrl = getStorageUrl(config.bucket, filePath);

        return {
            success: true,
            url: publicUrl,
            path: filePath,
            fileName: fileName
        };

    } catch (err) {
        console.error('Error uploading player video:', err);
        return {
            success: false,
            error: err.message
        };
    }
}

// Delete storage file
async function deleteStorageFile(bucketName, filePath) {
    try {
        if (!window.db) {
            throw new Error('Supabase client not initialized');
        }

        const { error } = await window.db.storage
            .from(bucketName)
            .remove([filePath]);

        if (error) {
            throw error;
        }

        return {
            success: true
        };

    } catch (err) {
        console.error('Error deleting storage file:', err);
        return {
            success: false,
            error: err.message
        };
    }
}

// Store active upload configs so removeUploadItem can access them by container ID
const _uploadConfigs = {};

// Create image upload UI
function createImageUploadUI(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const config = {
        containerId,
        maxFiles: options.maxFiles || 1,
        acceptedTypes: options.acceptedTypes || 'image/*',
        maxSize: options.maxSize || 5 * 1024 * 1024,
        onUpload: options.onUpload || (() => { }),
        onError: options.onError || (() => { }),
        ...options
    };
    _uploadConfigs[containerId] = config;

    container.innerHTML = `
    <div class="upload-area" id="${containerId}-upload">
      <input type="file" 
             id="${containerId}-input" 
             accept="${config.acceptedTypes}" 
             ${config.maxFiles > 1 ? 'multiple' : ''}>
      <div class="upload-placeholder">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
        <p>Click to upload ${config.maxFiles > 1 ? 'images' : 'image'}</p>
        <p class="upload-hint">Max size: ${config.maxSize / 1024 / 1024}MB</p>
      </div>
      <div class="upload-preview" id="${containerId}-preview"></div>
    </div>
  `;

    // Add event listeners
    const input = document.getElementById(`${containerId}-input`);
    const uploadArea = document.getElementById(`${containerId}-upload`);

    input.addEventListener('change', (e) => handleFileSelect(e, config));

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        handleFileSelect({ target: { files: e.dataTransfer.files } }, config);
    });
}

// Handle file selection
function handleFileSelect(event, config) {
    const files = Array.from(event.target.files);

    if (files.length === 0) return;

    // Validate files
    const validFiles = files.filter(file => {
        if (file.size > config.maxSize) {
            config.onError(`File ${file.name} exceeds size limit`);
            return false;
        }
        return true;
    });

    if (validFiles.length === 0) return;

    // Create previews
    createImagePreviews(validFiles, config);
}

// Create image previews
function createImagePreviews(files, config) {
    const previewContainer = document.getElementById(`${config.containerId}-preview`);
    if (!previewContainer) return;

    previewContainer.innerHTML = '';

    files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.createElement('div');
            preview.className = 'upload-preview-item';
            preview.innerHTML = `
        <img src="${e.target.result}" alt="${file.name}">
        <div class="upload-info">
          <span class="upload-name">${file.name}</span>
          <span class="upload-size">${formatFileSize(file.size)}</span>
        </div>
        <button class="upload-remove" onclick="removeUploadItem('${config.containerId}', ${index})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      `;
            previewContainer.appendChild(preview);
        };
        reader.readAsDataURL(file);
    });
}

// Remove upload item
function removeUploadItem(containerId, index) {
    const config = _uploadConfigs[containerId];
    if (!config) return;

    const input = document.getElementById(`${containerId}-input`);
    const dt = new DataTransfer();
    const files = Array.from(input.files);

    files.splice(index, 1);
    files.forEach(file => dt.items.add(file));

    input.files = dt.files;

    handleFileSelect({ target: input }, config);
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Initialize storage functionality
function initializeAdminStorage() {
    // Make functions globally available
    window.uploadPlayerImage = uploadPlayerImage;
    window.uploadPlayerGallery = uploadPlayerGallery;
    window.uploadMatchLogo = uploadMatchLogo;
    window.deleteStorageFile = deleteStorageFile;
    window.createImageUploadUI = createImageUploadUI;
    window.removeUploadItem = removeUploadItem;

    console.log('Admin storage helper initialized');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeAdminStorage);