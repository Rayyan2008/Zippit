import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://quydvrkkarlftbuagajc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1eWR2cmtrYXJsZnRidWFnYWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyODMwMzIsImV4cCI6MjA5Njg1OTAzMn0.s7Mlqdl71wBQslwuQtCwZG7F16t-dIGxJhPKHkYrecY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export default supabase;