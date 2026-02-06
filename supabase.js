// supabase.js
const SUPABASE_URL = "https://jyjhdsrhvnhquvjcexen.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5amhkc3Jodm5ocXV2amNleGVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzOTg0MjAsImV4cCI6MjA4NTk3NDQyMH0.6jte8bzgBAgaP6Px8cUUDF_7duWXZt8xp2dXSHqU5Gg"

window.supabase = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
)

//console.log("Supabase conectado:", window.supabase)
