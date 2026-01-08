// Service for managing AI integration settings (OpenAI API key)

const STORAGE_KEY = 'openai_api_key';

export class AiIntegrationSettingsService {
  /**
   * Saves the OpenAI API key to Chrome storage
   * @param apiKey The OpenAI API key to save
   */
  static async saveApiKey(apiKey: string): Promise<void> {
    try {
      await chrome.storage.local.set({ [STORAGE_KEY]: apiKey });
      console.log('API key saved successfully');
    } catch (error) {
      console.error('Error saving API key:', error);
      throw new Error('Failed to save API key');
    }
  }

  /**
   * Retrieves the OpenAI API key from Chrome storage
   * @returns The stored API key or null if not set
   */
  static async getApiKey(): Promise<string | null> {
    try {
      const result = await chrome.storage.local.get(STORAGE_KEY);
      const apiKey = result[STORAGE_KEY];
      return typeof apiKey === 'string' ? apiKey : null;
    } catch (error) {
      console.error('Error retrieving API key:', error);
      throw new Error('Failed to retrieve API key');
    }
  }

  /**
   * Removes the API key from storage
   */
  static async clearApiKey(): Promise<void> {
    try {
      await chrome.storage.local.remove(STORAGE_KEY);
      console.log('API key cleared successfully');
    } catch (error) {
      console.error('Error clearing API key:', error);
      throw new Error('Failed to clear API key');
    }
  }

  /**
   * Checks if an API key is currently stored
   * @returns True if an API key exists, false otherwise
   */
  static async hasApiKey(): Promise<boolean> {
    const apiKey = await this.getApiKey();
    return apiKey !== null && apiKey.length > 0;
  }
}
