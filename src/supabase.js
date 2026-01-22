import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iimmfymmrkbibjugbpwk.supabase.co'; 
const supabaseKey = 'sb_publishable_kiWk8n6p_sNfW21TrAFBzA_cKZ6AzhI';

export const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
