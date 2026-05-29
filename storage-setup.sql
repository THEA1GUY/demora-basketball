-- ================================================
-- DEMORA BASKETBALL — Supabase Storage Setup
-- ================================================
-- This script sets up storage buckets and updates database schema
-- for image and media management
-- ================================================

-- 1. Create storage buckets
-- Note: This needs to be done in the Supabase dashboard
-- Instructions:
-- - Go to your Supabase project → Storage
-- - Click "New bucket" for each of the following:

-- Bucket: "team-images"
-- - Public: true (for public access)
-- - File size limit: 5MB
-- - Allowed file types: image/jpeg, image/png, image/webp
-- - Purpose: Team logos and player profile images

-- Bucket: "match-images"
-- - Public: true (for public access)
-- - File size limit: 10MB
-- - Allowed file types: image/jpeg, image/png, image/webp
-- - Purpose: Match photos and game highlights

-- Bucket: "player-gallery"
-- - Public: true (for public access)
-- - File size limit: 5MB
-- - Allowed file types: image/jpeg, image/png, image/webp
-- - Purpose: Player photo galleries

-- Bucket: "player-videos"
-- - Public: true (for public access)
-- - File size limit: 25MB
-- - Allowed file types: video/mp4, video/webm, video/quicktime
-- - Purpose: Player profile videos and highlight reels

-- Bucket: "game-videos"
-- - Public: true (for public access)
-- - File size limit: 50MB
-- - Allowed file types: video/mp4, video/webm, video/quicktime
-- - Purpose: Game recordings and match highlights

-- 2. Update players table to include storage URL for scouting video
-- Note: photo_url and gallery_urls already exist from schema.sql
ALTER TABLE players
ADD COLUMN IF NOT EXISTS player_video_url TEXT;

-- 3. Update matches table to include storage URL for opponent logo
-- Note: highlights_url already exists from schema.sql
ALTER TABLE matches
ADD COLUMN IF NOT EXISTS opponent_logo_url TEXT;

-- 4. Create function to generate storage URLs
CREATE OR REPLACE FUNCTION get_storage_url(bucket_name TEXT, file_path TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN format('https://smgyhukoxmlzadrlusnd.supabase.co/storage/v1/object/public/%s/%s',
    bucket_name, file_path);
END;
$$ LANGUAGE plpgsql;

-- 5. (No data migration needed — photo_url and gallery_urls already populated by schema.sql seed)

-- 7. Create RLS policies for all storage buckets
-- These policies allow public read access and authenticated write access

-- Team images: Public read, Authenticated write
CREATE POLICY "Public access to team images" ON storage.objects
  FOR SELECT USING (bucket_id = 'team-images');

CREATE POLICY "Authenticated manage team images" ON storage.objects
  FOR ALL USING (bucket_id = 'team-images' AND auth.role() = 'authenticated')
  WITH CHECK (bucket_id = 'team-images' AND auth.role() = 'authenticated');

-- Match images: Public read, Authenticated write
CREATE POLICY "Public access to match images" ON storage.objects
  FOR SELECT USING (bucket_id = 'match-images');

CREATE POLICY "Authenticated manage match images" ON storage.objects
  FOR ALL USING (bucket_id = 'match-images' AND auth.role() = 'authenticated')
  WITH CHECK (bucket_id = 'match-images' AND auth.role() = 'authenticated');

-- Player gallery: Public read, Authenticated write
CREATE POLICY "Public access to player gallery" ON storage.objects
  FOR SELECT USING (bucket_id = 'player-gallery');

CREATE POLICY "Authenticated manage player gallery" ON storage.objects
  FOR ALL USING (bucket_id = 'player-gallery' AND auth.role() = 'authenticated')
  WITH CHECK (bucket_id = 'player-gallery' AND auth.role() = 'authenticated');

-- Player videos: Public read, Authenticated write
CREATE POLICY "Public access to player videos" ON storage.objects
  FOR SELECT USING (bucket_id = 'player-videos');

CREATE POLICY "Authenticated manage player videos" ON storage.objects
  FOR ALL USING (bucket_id = 'player-videos' AND auth.role() = 'authenticated')
  WITH CHECK (bucket_id = 'player-videos' AND auth.role() = 'authenticated');

-- Game videos: Public read, Authenticated write
CREATE POLICY "Public access to game videos" ON storage.objects
  FOR SELECT USING (bucket_id = 'game-videos');

CREATE POLICY "Authenticated manage game videos" ON storage.objects
  FOR ALL USING (bucket_id = 'game-videos' AND auth.role() = 'authenticated')
  WITH CHECK (bucket_id = 'game-videos' AND auth.role() = 'authenticated');

-- 8. (No server-side upload function needed — file uploads are handled by the JS client)

-- ================================================
-- Setup Instructions:
-- ================================================
-- 1. Execute this SQL in your Supabase SQL Editor
-- 2. Create all 5 storage buckets in the Supabase Dashboard (as specified above)
-- 3. Update your application code to use the new storage URLs and functions
-- 4. Add player video upload functionality to admin panel
-- 5. Test the complete storage integration with images and videos
-- ================================================

-- Additional Notes:
-- - Player videos are stored in 'player-videos' bucket with 25MB limit
-- - Game videos are stored in 'game-videos' bucket with 50MB limit
-- - All buckets are public for easy access but require authentication for uploads
-- - Use the uploadPlayerVideo() function for player profile videos
-- - Use the uploadGameVideo() function for game recordings
-- ================================================