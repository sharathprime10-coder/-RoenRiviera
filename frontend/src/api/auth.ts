import { supabase } from '../lib/supabaseClient';

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin
    }
  });
  
  if (error) {
    console.error("Error signing in with Google:", error.message);
    throw error;
  }
  
  return data;
};

export const getSession = async () => {
  return await supabase.auth.getSession();
};
