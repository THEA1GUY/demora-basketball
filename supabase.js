/* ================================================
   DEMORA BASKETBALL — Supabase Client
   ================================================
   SETUP:
   1. Go to https://supabase.com → your project → Settings → API
   2. Copy "Project URL" → paste as SUPABASE_URL
   3. Copy "anon public" key → paste as SUPABASE_ANON_KEY
   ================================================ */

const SUPABASE_URL      = 'https://smgyhukoxmlzadrlusnd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZ3lodWtveG1semFkcmx1c25kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwMDU2MDksImV4cCI6MjA5NTU4MTYwOX0.r3nXB1rY7k3UPVufO0-CMOVrDWwte-8fmlETCKdQRmQ';

/* Creates the shared client used by all public pages */
if (typeof window !== 'undefined' && window.supabase && SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
  window.db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
