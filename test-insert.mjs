import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("Supabase URL:", supabaseUrl ? "Exists" : "Missing");
console.log("Supabase Key:", supabaseKey ? "Exists" : "Missing");

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('links')
    .insert([{ id: 'hao', original_url: 'https://halo.me' }]);

  console.log("Error object:", JSON.stringify(error, null, 2));
}

run();
