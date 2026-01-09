// Service for extracting content from DOM

export class DomContentExtractionService {
  /**
   * Extracts visible text content from the page
   * @param selector Optional CSS selector to limit extraction scope
   * @returns Extracted text content as string
   */
  static async getVisibleText(tabId?: number, selector?: string): Promise<string> {
    try {
      const tabs = tabId
        ? [{ id: tabId }]
        : await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tabs || tabs.length === 0 || !tabs[0].id) {
        throw new Error('No active tab found');
      }

      // Define the extraction function inline to avoid serialization issues
      const extractionFunc = (sel?: string): string => {
        try {
          // Try to find LinkedIn's main content area or use selector
          let root: Element | null = null;

          if (sel) {
            root = document.querySelector(sel);
          } else {
            // Try multiple selectors for LinkedIn
            root = document.querySelector('main') ||
                   document.querySelector('#main-content') ||
                   document.querySelector('.scaffold-layout__main') ||
                   document.querySelector('.application-outlet') ||
                   document.body;
          }

          if (!root) {
            console.log('No root element found');
            return '';
          }

          // Use innerText for the simplest and most reliable extraction
          const text = (root as HTMLElement).innerText || (root as HTMLElement).textContent || '';

          if (!text) {
            console.log('No text found in root element');
            return '';
          }

          // Clean up the text
          const cleanedText = text
            .replace(/\n{3,}/g, '\n\n') // Max 2 consecutive newlines
            .replace(/[ \t]{2,}/g, ' ') // Normalize spaces
            .replace(/\s+\n/g, '\n') // Remove trailing spaces before newlines
            .trim();

          console.log(`Extracted ${cleanedText.length} characters`);
          return cleanedText;
        } catch (error) {
          console.error('Error in extractTextFromDOM:', error);
          return '';
        }
      };

      const results = await chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: extractionFunc,
        args: selector ? [selector] : []
      });

      if (results && results[0]) {
        return results[0].result || '';
      }

      return '';
    } catch (error) {
      console.error('Error extracting DOM content:', error);
      throw error;
    }
  }

}
