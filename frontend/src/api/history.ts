import { supabase } from '../lib/supabaseClient';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const getChatHistory = async (conversationId: string) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token || "";

    const response = await fetch(`${API_URL}/chat/history/${conversationId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error("Failed to fetch history");
    const data = await response.json();
    return data.messages || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};
