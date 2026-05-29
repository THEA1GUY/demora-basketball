# Project Todo List - Demora Basketball Website

## 🎨 Phase 1: Frontend UI/UX Refinement
* [ ] **Enhance Pinterest Grid**: Improve the masonry layout for player cards on the main page.
* [ ] **Video Section**: Create a dedicated section for team highlights and training videos on the main page.
* [ ] **Expand Player Cards**:
  * [ ] Integrate a media gallery (multiple photos/scouting videos) inside the modal card.
  * [ ] Style player stats (PPG, RPG, APG), playing style notes, and scouting bios.
* [ ] **Contact & Locations**: Add a styled "how to find us" / training schedule section.

## 🗄️ Phase 2: Database Setup (Supabase)
* [ ] **Supabase Setup**: Initialize a new project and retrieve API keys.
* [ ] **Database Schema**:
  * [ ] `players` table: ID, name, position, stats (PPG, RPG, APG), playing style, bio, images (URLs), videos (URLs).
  * [ ] `matches` table: ID, opponent, date, status (upcoming/past), score (if past), highlights video link.
  * [ ] `payments` table: Player ID, month, paid status, date paid.

## 🔑 Phase 3: Admin Panel Development
* [ ] **Setup separate admin site/route**: Create the interface for coach/management.
* [ ] **Player Management**: Add forms to create, update, and delete players and their stats.
* [ ] **Media Uploads**: Add fields to upload additional photos or link scouting videos for individual players.
* [ ] **Payment Tracker**: Create a visual dashboard/grid showing payment status per player by month (Paid/Unpaid).
* [ ] **Match Manager**: Admin interface to update upcoming matches or add scores and videos to past matches.

## 🚀 Phase 4: Integration & Deployment
* [ ] Connect main website to Supabase to fetch live player/match/video data.
* [ ] Connect admin panel to Supabase to submit and edit data.
* [ ] Deploy main website to Netlify/Vercel.
* [ ] Deploy admin panel to Netlify/Vercel.
