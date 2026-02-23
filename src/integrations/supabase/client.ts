import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://bvvlswnwhpbjjhgsoo.supabase.co";
// Use a chave nova que você me enviou:
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_5iqQHnRSl48pHoK1F466IA_4c12Dg47";

// ESSA LINHA ABAIXO É A QUE VAI FAZER O SITE ABRIR:
export const supabaseConfigError = null;

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
