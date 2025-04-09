// src/supabase/client.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://elearning-kcijcz46r-southjamesss-projects.vercel.app/login' // ใช้ URL ของโปรเจกต์คุณ
const supabaseKey = 'CWPtXB5c-8D&P38'               // ใช้ anon public key

export const supabase = createClient(supabaseUrl, supabaseKey)