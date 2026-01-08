// Service for integrating with OpenAI API

import { AiIntegrationSettingsService } from './AiIntegrationSettingsService';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_MODEL = 'gpt-4o-mini';

export interface OpenAiMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAiCompletionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface OpenAiResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export class OpenAiIntegrationService {
  /**
   * Generates a completion from OpenAI
   * @param messages Array of messages for the conversation
   * @param options Optional configuration
   * @returns The completion response
   */
  static async generateCompletion(
    messages: OpenAiMessage[],
    options?: OpenAiCompletionOptions
  ): Promise<OpenAiResponse> {
    const apiKey = await AiIntegrationSettingsService.getApiKey();

    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const requestBody = {
      model: options?.model || DEFAULT_MODEL,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens || 2000
    };

    try {
      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `OpenAI API error: ${response.status} - ${errorData.error?.message || response.statusText}`
        );
      }

      const data = await response.json();

      if (!data.choices || data.choices.length === 0) {
        throw new Error('No completion returned from OpenAI');
      }

      return {
        content: data.choices[0].message.content,
        usage: data.usage
          ? {
              promptTokens: data.usage.prompt_tokens,
              completionTokens: data.usage.completion_tokens,
              totalTokens: data.usage.total_tokens
            }
          : undefined
      };
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error calling OpenAI API');
    }
  }

  /**
   * Generates structured data from a prompt (expects JSON response)
   * @param prompt The prompt to send
   * @param options Optional configuration
   * @returns Parsed JSON response
   */
  static async generateStructuredData<T = any>(
    prompt: string,
    options?: OpenAiCompletionOptions
  ): Promise<T> {
    const messages: OpenAiMessage[] = [
      {
        role: 'system',
        content:
          'You are a helpful assistant that extracts structured data from text. ' +
          'Always respond with valid JSON only, no additional text or formatting.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const response = await this.generateCompletion(messages, {
      ...options,
      temperature: 0.3 // Lower temperature for more consistent JSON output
    });

    try {
      // Try to extract JSON from the response
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : response.content;
      return JSON.parse(jsonString) as T;
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      console.error('Raw response:', response.content);
      throw new Error('Failed to parse structured data from OpenAI response');
    }
  }

  /**
   * Extracts profile information from LinkedIn text
   * @param profileText The raw text from a LinkedIn profile
   * @returns Structured profile data
   */
  static async extractProfileData(profileText: string): Promise<{
    name: string;
    title: string;
    summary: string;
    experience: string[];
    education: string[];
    tags: string[];
  }> {
    const prompt = `
Given the following text from a LinkedIn profile, extract and structure the following information:

1. Person's full name
2. Current job title
3. A brief professional summary (2-3 sentences)
4. List of work experience entries (company + role)
5. List of education entries (institution + degree/field)
6. Generate 5-10 relevant professional skill tags

Please format the output as a JSON object with these exact keys:
- name (string)
- title (string)
- summary (string)
- experience (array of strings)
- education (array of strings)
- tags (array of strings)

LinkedIn Profile Text:
${profileText}
`;

    return this.generateStructuredData(prompt, {
      maxTokens: 2000
    });
  }

  /**
   * Searches profiles using natural language query
   * @param query The search query
   * @param profiles Array of profile summaries
   * @returns Array of profile IDs in order of relevance
   */
  static async searchProfiles(
    query: string,
    profiles: Array<{ id: string; name: string; title: string; summary: string; tags: string[] }>
  ): Promise<string[]> {
    const prompt = `
Given the following search query and list of professional profiles, return the IDs of profiles that best match the query, ordered by relevance.

Search Query: "${query}"

Profiles:
${JSON.stringify(profiles, null, 2)}

Please respond with a JSON array of profile IDs, ordered from most to least relevant. Only include profiles that are relevant to the query.
Format: ["id1", "id2", "id3", ...]
`;

    const result = await this.generateStructuredData<string[]>(prompt);
    return Array.isArray(result) ? result : [];
  }
}
