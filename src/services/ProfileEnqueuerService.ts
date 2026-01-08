// Service for managing a queue of profile URLs to be processed

const QUEUE_STORAGE_KEY = 'profile_queue';

export class ProfileEnqueuerService {
  /**
   * Adds a profile URL to the queue
   * @param url LinkedIn profile URL
   * @returns True if added, false if already in queue
   */
  static async enqueue(url: string): Promise<boolean> {
    try {
      const queue = await this.getQueue();

      // Normalize URL and check for duplicates
      const normalizedUrl = this.normalizeUrl(url);

      if (queue.includes(normalizedUrl)) {
        console.log('URL already in queue:', normalizedUrl);
        return false;
      }

      queue.push(normalizedUrl);
      await chrome.storage.local.set({ [QUEUE_STORAGE_KEY]: queue });
      console.log('URL added to queue:', normalizedUrl);

      return true;
    } catch (error) {
      console.error('Error enqueueing URL:', error);
      throw new Error('Failed to enqueue URL');
    }
  }

  /**
   * Removes and returns the next URL from the queue
   * @returns The next URL or null if queue is empty
   */
  static async dequeue(): Promise<string | null> {
    try {
      const queue = await this.getQueue();

      if (queue.length === 0) {
        return null;
      }

      const url = queue.shift()!;
      await chrome.storage.local.set({ [QUEUE_STORAGE_KEY]: queue });
      console.log('URL dequeued:', url);

      return url;
    } catch (error) {
      console.error('Error dequeuing URL:', error);
      throw new Error('Failed to dequeue URL');
    }
  }

  /**
   * Gets the current queue without modifying it
   * @returns Array of URLs in the queue
   */
  static async getQueue(): Promise<string[]> {
    try {
      const result = await chrome.storage.local.get(QUEUE_STORAGE_KEY);
      const queue = result[QUEUE_STORAGE_KEY];

      if (Array.isArray(queue)) {
        return queue;
      }

      return [];
    } catch (error) {
      console.error('Error getting queue:', error);
      throw new Error('Failed to get queue');
    }
  }

  /**
   * Clears the entire queue
   */
  static async clearQueue(): Promise<void> {
    try {
      await chrome.storage.local.set({ [QUEUE_STORAGE_KEY]: [] });
      console.log('Queue cleared');
    } catch (error) {
      console.error('Error clearing queue:', error);
      throw new Error('Failed to clear queue');
    }
  }

  /**
   * Gets the number of items in the queue
   */
  static async getQueueSize(): Promise<number> {
    const queue = await this.getQueue();
    return queue.length;
  }

  /**
   * Removes a specific URL from the queue
   * @param url URL to remove
   * @returns True if removed, false if not found
   */
  static async remove(url: string): Promise<boolean> {
    try {
      const queue = await this.getQueue();
      const normalizedUrl = this.normalizeUrl(url);
      const initialLength = queue.length;

      const updatedQueue = queue.filter(item => item !== normalizedUrl);

      if (updatedQueue.length < initialLength) {
        await chrome.storage.local.set({ [QUEUE_STORAGE_KEY]: updatedQueue });
        console.log('URL removed from queue:', normalizedUrl);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error removing URL from queue:', error);
      throw new Error('Failed to remove URL from queue');
    }
  }

  /**
   * Normalizes a LinkedIn URL for consistent comparison
   */
  private static normalizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      // Remove trailing slashes and query parameters
      let pathname = urlObj.pathname.replace(/\/$/, '');
      return `https://www.linkedin.com${pathname}`;
    } catch {
      // If URL parsing fails, return as-is
      return url;
    }
  }
}
