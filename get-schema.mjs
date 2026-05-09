import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://thhtdrplrvtwxebgvbzr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoaHRkcnBscnZ0d3hlYmd2YnpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTY1OTMyNCwiZXhwIjoyMDkxMjM1MzI0fQ.uFMDS-cMu2IYN_p2K_W_ElYbFif73WNKG6F-69G9gpw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('links').select('*').limit(1);
  if (error) console.error(error);
  else console.log(data);
}

run();
