const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const getChatHistory = async (conversationId: string) => {
  try {
    const response = await fetch(`${API_URL}/chat/history/${conversationId}`, {
      headers: {
        "Authorization": "Bearer dummy_token"
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
