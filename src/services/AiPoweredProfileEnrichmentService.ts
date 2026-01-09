// Service for enriching LinkedIn profiles with AI-extracted data

import { DomContentExtractionService } from './DomContentExtractionService';
import { OpenAiIntegrationService } from './OpenAiIntegrationService';
import { ProfileRepository } from './ProfileRepository';
import { Profile } from '../types/Profile';

export interface EnrichmentResult {
  success: boolean;
  profile?: Profile;
  error?: string;
}

export class AiPoweredProfileEnrichmentService {
  /**
   * Enriches a LinkedIn profile by extracting content and processing with AI
   * @param url LinkedIn profile URL
   * @param tabId Optional tab ID (if not provided, uses active tab)
   * @returns The enriched and saved profile
   */
  static async enrichProfile(url: string, tabId?: number): Promise<EnrichmentResult> {
    try {
      // Step 1: Validate URL
      if (!this.isValidLinkedInProfileUrl(url)) {
        return {
          success: false,
          error: 'Invalid LinkedIn profile URL'
        };
      }

      // Step 2: Extract DOM content
      console.log('Extracting content from:', url);
      let rawText: string;

      try {
        rawText = await DomContentExtractionService.getVisibleText(tabId);

        console.log(`Extracted ${rawText.length} characters from page`);

        if (!rawText || rawText.length < 50) {
          console.log('Raw text sample:', rawText ? rawText.substring(0, 200) : 'none');
          return {
            success: false,
            error: `Failed to extract sufficient content from page. Please ensure you are on a LinkedIn profile page.`
          };
        }
      } catch (error) {
        console.error('DOM extraction error:', error);
        return {
          success: false,
          error: `Failed to extract content from page: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
      }

      // Step 3: Use AI to extract structured data
      console.log('Processing profile with AI...');
      let extractedData;

      try {
        extractedData = await OpenAiIntegrationService.extractProfileData(rawText);
      } catch (error) {
        console.error('AI extraction error:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to process profile with AI'
        };
      }

      // Step 4: Create and save profile
      console.log('Saving profile...');
      const profile: Partial<Profile> = {
        linkedinUrl: url,
        name: extractedData.name || 'Unknown',
        title: extractedData.title || '',
        summary: extractedData.summary || '',
        experience: extractedData.experience || [],
        education: extractedData.education || [],
        tags: extractedData.tags || [],
        rawText: rawText.substring(0, 5000), // Limit raw text storage
        createdAt: Date.now()
      };

      const savedProfile = await ProfileRepository.save(profile);

      console.log('Profile enrichment completed:', savedProfile.id);

      return {
        success: true,
        profile: savedProfile
      };
    } catch (error) {
      console.error('Unexpected error during profile enrichment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during enrichment'
      };
    }
  }

  /**
   * Enriches multiple profiles from a queue
   * @param urls Array of LinkedIn profile URLs
   * @returns Array of enrichment results
   */
  static async enrichMultipleProfiles(urls: string[]): Promise<EnrichmentResult[]> {
    const results: EnrichmentResult[] = [];

    for (const url of urls) {
      const result = await this.enrichProfile(url);
      results.push(result);

      // Small delay between profiles to avoid rate limiting
      if (results.length < urls.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  /**
   * Validates if a URL is a LinkedIn profile URL
   */
  private static isValidLinkedInProfileUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return (
        (urlObj.hostname === 'www.linkedin.com' || urlObj.hostname === 'linkedin.com') &&
        urlObj.pathname.startsWith('/in/')
      );
    } catch {
      return false;
    }
  }
}
