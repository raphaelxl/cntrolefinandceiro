import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = "https://bvvlswtnwhpbjjhgsoo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_maFvQfL7n_ctmGAhm5VmcA_HSkIqI2w";
export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
