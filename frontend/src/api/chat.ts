// Mock API adapter for Chat - ready for Antigravity integration
export const sendMessage = async (message: string, workflow: string) => {
  console.log(`Sending to backend [${workflow}]:`, message);
  // Real implementation will call FastAPI
  return { answer: "This is a mock response pending backend integration." };
};
