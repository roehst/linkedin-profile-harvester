// Background service worker for LinkedIn Profile Harvester

import { DomContentExtractionService } from '../services/DomContentExtractionService';
import { AiIntegrationSettingsService } from '../services/AiIntegrationSettingsService';
import { ProfileRepository } from '../services/ProfileRepository';
import { OpenAiIntegrationService } from '../services/OpenAiIntegrationService';
import { ProfileEnqueuerService } from '../services/ProfileEnqueuerService';
import { AiPoweredProfileEnrichmentService } from '../services/AiPoweredProfileEnrichmentService';

console.log('LinkedIn Profile Harvester background script loaded');

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request);

  // Handle different message types
  const handleMessage = async () => {
    switch (request.type) {
      case 'PING':
        return { success: true, message: 'pong' };

      case 'EXTRACT_DOM_CONTENT':
        try {
          const text = await DomContentExtractionService.getVisibleText(
            request.tabId,
            request.selector
          );
          return { success: true, text };
        } catch (error) {
          return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error'
          };
        }

      case 'SAVE_API_KEY':
        try {
          await AiIntegrationSettingsService.saveApiKey(request.apiKey);
          return { success: true };
        } catch (error) {
          return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error'
          };
        }

      case 'GET_API_KEY':
        try {
          const apiKey = await AiIntegrationSettingsService.getApiKey();
          return { success: true, apiKey };
        } catch (error) {
          return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error'
          };
        }

      case 'HAS_API_KEY':
        try {
          const hasKey = await AiIntegrationSettingsService.hasApiKey();
          return { success: true, hasKey };
        } catch (error) {
          return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error'
          };
        }

      case 'SAVE_PROFILE':
        try {
          const savedProfile = await ProfileRepository.save(request.profile);
          return { success: true, profile: savedProfile };
        } catch (error) {
          return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error'
          };
        }

      case 'GET_PROFILE':
        try {
          const profile = await ProfileRepository.getById(request.id);
          return { success: true, profile };
        } catch (error) {
          return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error'
          };
        }

      case 'GET_ALL_PROFILES':
        try {
          const profiles = await ProfileRepository.getAll();
          return { success: true, profiles };
        } catch (error) {
          return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error'
          };
        }

      case 'DELETE_PROFILE':
        try {
          const deleted = await ProfileRepository.delete(request.id);
          return { success: true, deleted };
        } catch (error) {
          return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error'
          };
        }

      case 'ENQUEUE_PROFILE':
        try {
          const added = await ProfileEnqueuerService.enqueue(request.url);
          return { success: true, added };
        } catch (error) {
          return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error'
          };
        }

      case 'GET_QUEUE':
        try {
          const queue = await ProfileEnqueuerService.getQueue();
          return { success: true, queue };
        } catch (error) {
          return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error'
          };
        }

      case 'ENRICH_PROFILE':
        try {
          const result = await AiPoweredProfileEnrichmentService.enrichProfile(
            request.url,
            request.tabId
          );
          return result;
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }

      case 'SEARCH_PROFILES':
        try {
          const profiles = await ProfileRepository.getAll();
          const summaries = profiles.map(p => ({
            id: p.id,
            name: p.name,
            title: p.title,
            summary: p.summary,
            tags: p.tags
          }));

          const profileIds = await OpenAiIntegrationService.searchProfiles(
            request.query,
            summaries
          );

          const matchedProfiles = profileIds
            .map(id => profiles.find(p => p.id === id))
            .filter(p => p !== undefined);

          return { success: true, profiles: matchedProfiles };
        } catch (error) {
          return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error'
          };
        }

      default:
        return { success: false, message: 'Unknown message type' };
    }
  };

  // Execute async handler and send response
  handleMessage()
    .then(sendResponse)
    .catch(error => {
      sendResponse({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    });

  return true; // Keep the message channel open for async responses
});

// Extension installed or updated
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed/updated:', details.reason);
});
