import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://bvvlswnwhpbjjhgsoo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_5iqQHnRSl48pHoK1F466IA_4c12Dg47";

// Esta linha mata o erro "supabaseConfigError is not defined"
export const supabaseConfigError = null;

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
