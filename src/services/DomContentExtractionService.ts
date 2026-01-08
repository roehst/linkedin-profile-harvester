// Service for extracting content from DOM

export class DomContentExtractionService {
  /**
   * Extracts visible text content from the page
   * @param selector Optional CSS selector to limit extraction scope
   * @returns Extracted text content as Markdown-like string
   */
  static async getVisibleText(tabId?: number, selector?: string): Promise<string> {
    try {
      const tabs = tabId
        ? [{ id: tabId }]
        : await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tabs || tabs.length === 0 || !tabs[0].id) {
        throw new Error('No active tab found');
      }

      const results = await chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: this.extractTextFromDOM,
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

  /**
   * Function that runs in the context of the page to extract text
   * This function is serialized and injected into the page
   */
  private static extractTextFromDOM(selector?: string): string {
    try {
      const root = selector
        ? document.querySelector(selector)
        : document.body;

      if (!root) {
        return '';
      }

      // Helper to check if element is visible
      const isVisible = (element: Element): boolean => {
        if (!(element instanceof HTMLElement)) return false;

        const style = window.getComputedStyle(element);
        return style.display !== 'none' &&
               style.visibility !== 'hidden' &&
               style.opacity !== '0';
      };

      // Extract text with some structure preservation
      const extractText = (node: Node): string => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent?.trim() || '';
        }

        if (node.nodeType !== Node.ELEMENT_NODE) {
          return '';
        }

        const element = node as Element;

        // Skip invisible elements and script/style tags
        if (!isVisible(element)) {
          return '';
        }

        const tagName = element.tagName.toLowerCase();
        if (['script', 'style', 'noscript'].includes(tagName)) {
          return '';
        }

        let text = '';
        let childTexts: string[] = [];

        // Process child nodes
        for (const child of Array.from(element.childNodes)) {
          const childText = extractText(child);
          if (childText) {
            childTexts.push(childText);
          }
        }

        text = childTexts.join(' ');

        // Add markdown-like formatting for headings
        if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
          const level = parseInt(tagName[1]);
          text = '\n\n' + '#'.repeat(level) + ' ' + text + '\n\n';
        } else if (['p', 'div', 'section', 'article'].includes(tagName)) {
          text = '\n' + text + '\n';
        } else if (['li'].includes(tagName)) {
          text = '\n- ' + text;
        } else if (['br'].includes(tagName)) {
          text = '\n';
        }

        return text;
      };

      let fullText = extractText(root);

      // Clean up excessive whitespace and newlines
      fullText = fullText
        .replace(/\n\s*\n\s*\n/g, '\n\n') // Max 2 consecutive newlines
        .replace(/[ \t]+/g, ' ') // Normalize spaces
        .trim();

      return fullText;
    } catch (error) {
      console.error('Error in extractTextFromDOM:', error);
      return '';
    }
  }
}
