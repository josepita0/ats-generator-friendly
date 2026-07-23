export function isAIConfigured(): boolean {
  return !!(process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY);
}
