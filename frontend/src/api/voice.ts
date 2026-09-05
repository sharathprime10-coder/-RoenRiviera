import { supabase } from '../lib/supabaseClient';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export interface Voice {
  short_name: string;
  friendly_name: string;
  locale: string;
  gender: string;
}

export const getVoices = async (): Promise<Voice[]> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token || "";

    const response = await fetch(`${API_URL}/voice/voices`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching voices: ${response.statusText}`);
    }

    const data = await response.json();
    return data.voices || [];
  } catch (error) {
    console.error("Failed to fetch voices", error);
    return [];
  }
};
