import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://bvvlswnwhpbjjhgsoo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_maFvQfL7n_ctmGAhm5VmcA_HSkIqi2w";

// Esta linha abaixo é a que vai sumir com o erro da sua tela:
export const supabaseConfigError = null;

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
