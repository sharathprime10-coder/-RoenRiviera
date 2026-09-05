import { supabase } from '../lib/supabaseClient';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const getDocuments = async () => {
  return [];
};

export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token || "";

  const response = await fetch(`${API_URL}/documents/upload`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: formData
  });
  
  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status}`);
  }
  
  return response.json();
};
