import { supabase } from '../lib/supabaseClient';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const sendMessage = async (message: string, workflow: string, sassy: boolean = false) => {
  console.log(`Sending to backend [${workflow}]:`, message);
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token || "";

    const response = await fetch(`${API_URL}/chat/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        message,
        workflow,
        sassy,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data; // Returns ChatResponse schema
  } catch (error) {
    console.error("Error communicating with backend:", error);
    return { 
      answer: "Sorry, there was an error connecting to the Riviera service.",
      grounded: false,
      sources: []
    };
  }
};

export const streamMessage = async (
  message: string, 
  workflow: string, 
  onChunk: (chunk: string) => void,
  sassy: boolean = false
) => {
  console.log(`Streaming from backend [${workflow}]:`, message);
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token || "";

    const response = await fetch(`${API_URL}/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        message,
        workflow,
        sassy,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    if (!response.body) {
      throw new Error("No response body");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        const chunkValue = decoder.decode(value, { stream: true });
        // The chunkValue contains SSE events separated by \n\n
        const lines = chunkValue.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                onChunk(data.content);
              }
            } catch (e) {
              console.error("Error parsing stream chunk:", e);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error communicating with backend:", error);
    onChunk("Sorry, there was an error connecting to the Riviera service.");
  }
};
