# Demora Basketball - Supabase Storage Setup Guide

## Overview
This guide explains how to set up Supabase Storage for managing team images and media files, replacing the current local file system with a scalable cloud storage solution.

## 🚀 Quick Setup

### 1. Create Storage Buckets
Go to your Supabase Dashboard → Storage → New bucket

Create these buckets:
- **team-images** (Public access for team logos and player images)
- **player-gallery** (Public access for player photo galleries)
- **player-videos** (Public access for player profile videos and highlight reels)
- **match-images** (Public access for match logos and media)
- **game-videos** (Public access for game recordings and match highlights)

### 2. Run Database Migration
Execute the `storage-setup.sql` file in your Supabase SQL Editor to:
- Add new columns for storage URLs
- Create helper functions
- Set up RLS policies

### 3. Update Frontend Files
- `players.html` - Updated to use storage URLs
- `matches.html` - Updated to use storage URLs
- `storage.js` - New storage helper functions
- `admin/storage-uploads.js` - Admin panel upload functionality

## 📁 File Structure

### Storage Buckets Structure
```
team-images/
├── players/
│   ├── {player_id}/
│   │   ├── player_image.jpg
│   │   └── gallery/
│   │       ├── image1.jpg
│   │       ├── image2.jpg
│   │       └── image3.jpg
├── matches/
│   ├── {match_id}/
│   │   ├── team_logo.png
│   │   └── opponent_logo.png
└── logos/
    └── demora-logo.png

player-gallery/
├── players/
│   ├── {player_id}/
│   │   └── gallery/
│   │       ├── image1.jpg
│   │       ├── image2.jpg
│   │       └── image3.jpg

player-videos/
├── players/
│   ├── {player_id}/
│   │   └── videos/
│   │       ├── highlight_reel.mp4
│   │       └── skills_demo.webm

game-videos/
├── matches/
│   ├── {match_id}/
│   │   ├── full_game.mp4
│   │   └── highlights.webm
```

### Database Schema Updates

#### Players Table
```sql
ALTER TABLE players
ADD COLUMN player_image_url TEXT,
ADD COLUMN player_video_url TEXT,
ADD COLUMN gallery_images TEXT[];
```

#### Matches Table
```sql
ALTER TABLE matches 
ADD COLUMN team_logo_url TEXT,
ADD COLUMN opponent_logo_url TEXT;
```

## 🔧 Usage Examples

### Frontend (Display Images)
```javascript
// Get storage URL
const imageUrl = getStorageUrl('team-images', 'players/123/player_image.jpg');

// Display in HTML
<img src="${imageUrl}" alt="Player Image">
```

### Admin Panel (Upload Images)
```javascript
// Upload player image
const result = await uploadPlayerImage(playerId, file);
if (result.success) {
  // Update database with new URL
  await updatePlayer(playerId, {
    player_image_url: result.url
  });
}
```

### Batch Upload Gallery
```javascript
// Upload multiple gallery images
const result = await uploadPlayerGallery(playerId, files);
if (result.success) {
  // Update database with gallery URLs
  await updatePlayer(playerId, {
    gallery_images: result.urls
  });
}
```

## 🛡️ Security & Permissions

### RLS Policies
- **Public Access**: Anyone can view images and videos
- **Authenticated Upload**: Only logged-in users can upload
- **Authenticated Update/Delete**: Only uploaders can modify their files

### File Validation
- **Images**: Max 5MB, formats: JPEG, PNG, WebP
- **Player Videos**: Max 25MB, formats: MP4, WebM, QuickTime
- **Game Videos**: Max 50MB, formats: MP4, WebM, QuickTime
- Automatic caching headers for all files

## 🎥 Player Video Support

### New Features Added
- **Player Profile Videos**: Upload highlight reels and skill demonstrations
- **Video Storage**: Dedicated `player-videos` bucket for player media
- **Database Integration**: `player_video_url` column in players table
- **Upload Function**: `uploadPlayerVideo()` for admin panel

### Video File Structure
```
player-videos/
├── players/
│   ├── {player_id}/
│   │   └── videos/
│   │       ├── {player_id}_{timestamp}_highlight.mp4
│   │       └── {player_id}_{timestamp}_skills.webm
```

### Usage Example
```javascript
// Upload player video
const result = await uploadPlayerVideo(playerId, videoFile);
if (result.success) {
    // Update player record with video URL
    await updatePlayer(playerId, {
        player_video_url: result.url
    });
}
```

## 📋 Implementation Checklist

### ✅ Completed
- [x] Created storage helper functions (`storage.js`)
- [x] Updated frontend to use storage URLs
- [x] Created admin upload functionality (`admin/storage-uploads.js`)
- [x] Added database migration script (`storage-setup.sql`)
- [x] Updated players and matches pages
- [x] Added player video support functionality

### 🔄 Next Steps
- [ ] Create all 5 storage buckets in Supabase Dashboard:
  - [ ] team-images (5MB limit, images only)
  - [ ] player-gallery (5MB limit, images only)
  - [ ] player-videos (25MB limit, videos only)
  - [ ] match-images (10MB limit, images only)
  - [ ] game-videos (50MB limit, videos only)
- [ ] Execute database migration
- [ ] Upload existing images to storage
- [ ] Test upload functionality for both images and videos
- [ ] Update admin interface with video upload UI
- [ ] Test player video display in player profiles

## 🎯 Benefits

1. **Scalability**: Cloud storage grows with your needs
2. **Performance**: CDN delivery for fast image loading
3. **Security**: Built-in access controls and RLS policies
4. **Management**: Centralized media management
5. **Backup**: Automatic backup and version control
6. **Cost-effective**: Pay only for what you use

## 🔍 Troubleshooting

### Common Issues
1. **Images not loading**: Check bucket permissions and RLS policies
2. **Upload failed**: Verify file size and format restrictions
3. **URL errors**: Ensure correct bucket name and file path
4. **Permission denied**: Check user authentication status

### Debug Commands
```javascript
// Check storage connection
console.log(window.db?.storageUrl);

// List bucket files
const files = await getBucketFiles('team-images');
console.log(files);

// Test upload
const result = await uploadPlayerImage('test-id', file);
console.log(result);
```

## 📞 Support

For issues with Supabase Storage:
1. Check [Supabase Documentation](https://supabase.com/docs/guides/storage)
2. Review [Storage API Reference](https://supabase.com/docs/reference/javascript/storage-upload)
3. Contact support for account-specific issues

---

**Note**: This setup requires Supabase project admin access to create buckets and execute database migrations.