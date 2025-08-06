import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fgetnperucdzcaslevml.supabase.co'; // Replace with your URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnZXRucGVydWNkemNhc2xldm1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMDE4OTUsImV4cCI6MjA2OTc3Nzg5NX0.925l0CgMye9HOXVoLVGNEveAH0y9cPqR4nyjgG7XElc'; // Replace with your anon key
export const supabase = createClient(supabaseUrl, supabaseKey);
