// Repository for managing Profile entities in Chrome storage

import { Profile } from '../types/Profile';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'profiles';

export class ProfileRepository {
  /**
   * Saves a profile to storage (creates new or updates existing)
   * @param profile Profile to save
   * @returns The saved profile with generated ID if new
   */
  static async save(profile: Partial<Profile>): Promise<Profile> {
    try {
      const profiles = await this.getAllAsMap();

      // Generate ID if not present
      const id = profile.id || uuidv4();
      const now = Date.now();

      const savedProfile: Profile = {
        id,
        linkedinUrl: profile.linkedinUrl || '',
        name: profile.name || '',
        title: profile.title || '',
        summary: profile.summary || '',
        experience: profile.experience || [],
        education: profile.education || [],
        tags: profile.tags || [],
        rawText: profile.rawText || '',
        createdAt: profile.createdAt || now
      };

      profiles[id] = savedProfile;

      await chrome.storage.local.set({ [STORAGE_KEY]: profiles });
      console.log('Profile saved:', id);

      return savedProfile;
    } catch (error) {
      console.error('Error saving profile:', error);
      throw new Error('Failed to save profile');
    }
  }

  /**
   * Retrieves a profile by ID
   * @param id Profile ID
   * @returns The profile or null if not found
   */
  static async getById(id: string): Promise<Profile | null> {
    try {
      const profiles = await this.getAllAsMap();
      return profiles[id] || null;
    } catch (error) {
      console.error('Error retrieving profile:', error);
      throw new Error('Failed to retrieve profile');
    }
  }

  /**
   * Retrieves all profiles, sorted by creation date (newest first)
   * @returns Array of all profiles
   */
  static async getAll(): Promise<Profile[]> {
    try {
      const profiles = await this.getAllAsMap();
      const profileArray = Object.values(profiles);

      // Sort by createdAt descending (newest first)
      profileArray.sort((a, b) => b.createdAt - a.createdAt);

      return profileArray;
    } catch (error) {
      console.error('Error retrieving all profiles:', error);
      throw new Error('Failed to retrieve profiles');
    }
  }

  /**
   * Deletes a profile by ID
   * @param id Profile ID to delete
   * @returns True if deleted, false if not found
   */
  static async delete(id: string): Promise<boolean> {
    try {
      const profiles = await this.getAllAsMap();

      if (!profiles[id]) {
        return false;
      }

      delete profiles[id];

      await chrome.storage.local.set({ [STORAGE_KEY]: profiles });
      console.log('Profile deleted:', id);

      return true;
    } catch (error) {
      console.error('Error deleting profile:', error);
      throw new Error('Failed to delete profile');
    }
  }

  /**
   * Deletes all profiles
   */
  static async deleteAll(): Promise<void> {
    try {
      await chrome.storage.local.set({ [STORAGE_KEY]: {} });
      console.log('All profiles deleted');
    } catch (error) {
      console.error('Error deleting all profiles:', error);
      throw new Error('Failed to delete all profiles');
    }
  }

  /**
   * Internal helper to get profiles as a map
   */
  private static async getAllAsMap(): Promise<Record<string, Profile>> {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    const profiles = result[STORAGE_KEY];

    if (typeof profiles === 'object' && profiles !== null) {
      return profiles as Record<string, Profile>;
    }

    return {};
  }
}
