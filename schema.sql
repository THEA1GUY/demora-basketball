-- ================================================
-- DEMORA BASKETBALL — Supabase Schema
-- Run this entire file in the Supabase SQL Editor
-- ================================================

-- PLAYERS
CREATE TABLE players (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name            TEXT NOT NULL,
  position        TEXT NOT NULL CHECK (position IN ('PG','SG','SF','PF','C')),
  jersey_number   INTEGER,
  ppg             DECIMAL(4,1) DEFAULT 0,
  rpg             DECIMAL(4,1) DEFAULT 0,
  apg             DECIMAL(4,1) DEFAULT 0,
  playing_style   TEXT,
  bio             TEXT,
  photo_url       TEXT,
  gallery_urls    TEXT[] DEFAULT '{}',
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- MATCHES
CREATE TABLE matches (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  opponent        TEXT NOT NULL,
  match_date      TIMESTAMPTZ NOT NULL,
  location        TEXT,
  status          TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming','completed')),
  home_score      INTEGER,
  away_score      INTEGER,
  highlights_url  TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- PAYMENTS  (one row per player per month)
CREATE TABLE payments (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id   UUID REFERENCES players(id) ON DELETE CASCADE,
  month       DATE NOT NULL,   -- always the 1st of the month
  paid        BOOLEAN DEFAULT false,
  paid_date   TIMESTAMPTZ,
  amount      DECIMAL(10,2) DEFAULT 0,
  notes       TEXT,
  UNIQUE (player_id, month)
);

-- CONTACT MESSAGES
CREATE TABLE contacts (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT,
  message    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── ROW LEVEL SECURITY ──────────────────────────
-- Public can read players + matches
-- Only authenticated users (admins) can write anything
-- Payments are admin-only (read + write)

ALTER TABLE players  ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches  ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read players"    ON players  FOR SELECT USING (true);
CREATE POLICY "Auth write players"     ON players  FOR ALL    USING (auth.role() = 'authenticated');

CREATE POLICY "Public read matches"    ON matches  FOR SELECT USING (true);
CREATE POLICY "Auth write matches"     ON matches  FOR ALL    USING (auth.role() = 'authenticated');

CREATE POLICY "Auth all payments"      ON payments FOR ALL    USING (auth.role() = 'authenticated');

CREATE POLICY "Public insert contacts" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth read contacts"     ON contacts FOR SELECT USING (auth.role() = 'authenticated');

-- ── SEED — sample data ──────────────────────────
INSERT INTO players (name,position,jersey_number,ppg,rpg,apg,playing_style,bio,photo_url,gallery_urls) VALUES
('Marcus Adeyemi','PG',3, 18.4,4.1,7.2,'An explosive ball handler with elite court vision. Reads the defense before the play develops.','Marcus joined Demora in 2024 and immediately became the engine of the offense.','team 1.jpg',ARRAY['team 1.jpg','Demora.jpg']),
('Daniel Okonkwo','SG',12,22.1,5.3,3.0,'A pure scorer with a silky pull-up and the ability to heat up from distance.','The team''s leading scorer and a constant threat for opposing defenses.','team 3.jpg',ARRAY['team 3.jpg','Demora.jpg']),
('Emmanuel Chuka','SF',7, 14.7,6.8,4.5,'A versatile two-way player who can guard multiple positions and finish above the rim.','Emmanuel brings remarkable energy to every contest.','Demora2.jpg',ARRAY['Demora2.jpg','team 4.jpg']),
('Femi Lawal',    'PF',21,12.3,9.4,2.1,'A physical presence in the paint. Dominates the glass and sets screens that open up the offense.','Femi is the backbone of the frontcourt.','team 4.jpg',ARRAY['team 4.jpg','team 5.jpg']),
('Kola Benson',   'C', 33,10.6,11.2,1.8,'A dominant interior force. Length alters shots and screen-and-roll chemistry is elite.','At 19, one of the most exciting prospects on the roster.','team 5.jpg',ARRAY['team 5.jpg','Demora.jpg']),
('Tunde Ojo',     'PG',5, 9.8, 3.2,5.6,'A crafty playmaker who thrives in the pick-and-roll.','Tunde is the consummate team-first player.','team .jpg',ARRAY['team .jpg','Demora2.jpg']);

INSERT INTO matches (opponent,match_date,location,status,home_score,away_score) VALUES
('TBA',              '2026-06-14 16:00:00+00', 'Home Ground',  'upcoming',  NULL,NULL),
('Rivals FC',        '2026-05-02 15:00:00+00', 'Home Ground',  'completed', 72,  58),
('Northern BC',      '2026-04-18 15:00:00+00', 'Away',         'completed', 65,  61),
('City Ballers',     '2026-03-29 15:00:00+00', 'Home Ground',  'completed', 81,  67),
('East United',      '2026-04-05 15:00:00+00', 'Away',         'completed', 54,  60);
