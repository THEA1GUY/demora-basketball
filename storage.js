/* ================================================
   DEMORA BASKETBALL — Supabase Storage Helper
   ================================================
   Helper functions for managing images and media in Supabase Storage
   ================================================ */

// Storage bucket configuration
const STORAGE_BUCKETS = {
    TEAM_IMAGES: 'team-images',
    MATCH_IMAGES: 'match-images',
    PLAYER_GALLERY: 'player-gallery',
    PLAYER_VIDEOS: 'player-videos',
    GAME_VIDEOS: 'game-videos'
};

// Generate storage URL
function getStorageUrl(bucketName, filePath) {
    if (!window.db) {
        console.error('Supabase client not initialized');
        return null;
    }

    const { data } = window.db.storage.from(bucketName).getPublicUrl(filePath);
    return data.publicUrl;
}

// Upload player image
async function uploadPlayerImage(playerId, file, fileName) {
    try {
        if (!window.db) {
            throw new Error('Supabase client not initialized');
        }

        const filePath = `players/${playerId}/${fileName}`;
        const { data, error } = await window.db.storage
            .from(STORAGE_BUCKETS.TEAM_IMAGES)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            throw error;
        }

        // Get public URL
        const publicUrl = getStorageUrl(STORAGE_BUCKETS.TEAM_IMAGES, filePath);

        return {
            success: true,
            url: publicUrl,
            path: filePath
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
async function uploadPlayerGalleryImages(playerId, files) {
    try {
        if (!window.db) {
            throw new Error('Supabase client not initialized');
        }

        const uploadedImages = [];

        for (const file of files) {
            const fileName = `${Date.now()}_${file.name}`;
            const filePath = `players/${playerId}/gallery/${fileName}`;

            const { data, error } = await window.db.storage
                .from(STORAGE_BUCKETS.PLAYER_GALLERY)
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) {
                console.error('Error uploading gallery image:', error);
                continue;
            }

            const publicUrl = getStorageUrl(STORAGE_BUCKETS.PLAYER_GALLERY, filePath);
            uploadedImages.push(publicUrl);
        }

        return {
            success: true,
            urls: uploadedImages
        };

    } catch (err) {
        console.error('Error uploading player gallery:', err);
        return {
            success: false,
            error: err.message
        };
    }
}

// Upload game videos
async function uploadGameVideo(matchId, file) {
    try {
        if (!window.db) {
            throw new Error('Supabase client not initialized');
        }

        // Validate file type
        const videoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
        if (!videoTypes.includes(file.type)) {
            throw new Error(`Invalid video type. Allowed: ${videoTypes.join(', ')}`);
        }

        // Validate file size (50MB limit for videos)
        const maxSize = 50 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new Error(`Video size exceeds ${maxSize / 1024 / 1024}MB limit`);
        }

        const fileName = `${matchId}_${Date.now()}_${file.name}`;
        const filePath = `matches/${matchId}/${fileName}`;

        const { data, error } = await window.db.storage
            .from(STORAGE_BUCKETS.GAME_VIDEOS)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            throw error;
        }

        const publicUrl = getStorageUrl(STORAGE_BUCKETS.GAME_VIDEOS, filePath);

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

// Upload player profile videos
async function uploadPlayerVideo(playerId, file) {
    try {
        if (!window.db) {
            throw new Error('Supabase client not initialized');
        }

        // Validate file type
        const videoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
        if (!videoTypes.includes(file.type)) {
            throw new Error(`Invalid video type. Allowed: ${videoTypes.join(', ')}`);
        }

        // Validate file size (25MB limit for player videos - smaller than game videos)
        const maxSize = 25 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new Error(`Video size exceeds ${maxSize / 1024 / 1024}MB limit`);
        }

        const fileName = `${playerId}_${Date.now()}_${file.name}`;
        const filePath = `players/${playerId}/videos/${fileName}`;

        const { data, error } = await window.db.storage
            .from(STORAGE_BUCKETS.PLAYER_VIDEOS)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            throw error;
        }

        const publicUrl = getStorageUrl(STORAGE_BUCKETS.PLAYER_VIDEOS, filePath);

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

// Upload match logo
async function uploadMatchLogo(matchId, file, fileName) {
    try {
        if (!window.db) {
            throw new Error('Supabase client not initialized');
        }

        const filePath = `matches/${matchId}/${fileName}`;
        const { data, error } = await window.db.storage
            .from(STORAGE_BUCKETS.MATCH_IMAGES)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            throw error;
        }

        const publicUrl = getStorageUrl(STORAGE_BUCKETS.MATCH_IMAGES, filePath);

        return {
            success: true,
            url: publicUrl,
            path: filePath
        };

    } catch (err) {
        console.error('Error uploading match logo:', err);
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

// Get all files in a bucket
async function getBucketFiles(bucketName) {
    try {
        if (!window.db) {
            throw new Error('Supabase client not initialized');
        }

        const { data, error } = await window.db.storage
            .from(bucketName)
            .list();

        if (error) {
            throw error;
        }

        return {
            success: true,
            files: data
        };

    } catch (err) {
        console.error('Error getting bucket files:', err);
        return {
            success: false,
            error: err.message
        };
    }
}

// Image upload handler with preview
function handleImageUpload(input, callback) {
    const file = input.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = function (e) {
        callback({
            file: file,
            preview: e.target.result,
            name: file.name
        });
    };
    reader.readAsDataURL(file);
}

// Multiple image upload handler
function handleMultipleImageUpload(input, callback) {
    const files = Array.from(input.files);

    // Validate files
    const validFiles = files.filter(file => {
        if (!file.type.startsWith('image/')) {
            console.warn(`${file.name} is not an image file`);
            return false;
        }
        if (file.size > 5 * 1024 * 1024) {
            console.warn(`${file.name} is larger than 5MB`);
            return false;
        }
        return true;
    });

    if (validFiles.length === 0) {
        alert('Please select valid image files');
        return;
    }

    // Create previews
    const previews = [];
    let completed = 0;

    validFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            previews[index] = {
                file: file,
                preview: e.target.result,
                name: file.name
            };
            completed++;

            if (completed === validFiles.length) {
                callback(previews);
            }
        };
        reader.readAsDataURL(file);
    });
}

// Initialize storage functionality
function initializeStorage() {
    // Make functions globally available
    window.getStorageUrl = getStorageUrl;
    window.uploadPlayerImage = uploadPlayerImage;
    window.uploadPlayerGalleryImages = uploadPlayerGalleryImages;
    window.uploadMatchLogo = uploadMatchLogo;
    window.uploadGameVideo = uploadGameVideo;
    window.deleteStorageFile = deleteStorageFile;
    window.getBucketFiles = getBucketFiles;
    window.handleImageUpload = handleImageUpload;
    window.handleMultipleImageUpload = handleMultipleImageUpload;

    console.log('Storage helper initialized');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeStorage);