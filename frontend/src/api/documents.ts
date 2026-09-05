const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const getDocuments = async () => {
  return [];
};

export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await fetch(`${API_URL}/documents/upload`, {
    method: "POST",
    headers: {
      "Authorization": "Bearer dummy_token"
    },
    body: formData
  });
  
  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status}`);
  }
  
  return response.json();
};
