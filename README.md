# LinkedIn Profile Harvester

A Chrome extension designed to help recruiters harvest and manage LinkedIn profiles efficiently. Built with TypeScript, React, xState, and TailwindCSS, powered by OpenAI for intelligent profile extraction and search.

## Features

- **AI-Powered Profile Extraction**: Automatically extracts and structures profile information using OpenAI
- **Smart Search**: Natural language search across saved profiles
- **Bulk Harvesting**: Queue multiple profiles from LinkedIn search results
- **Data Export**: Export profiles in JSON, Markdown, or CSV formats
- **Profile Management**: View, organize, and delete saved profiles
- **Secure Storage**: All data stored locally in Chrome storage

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google Chrome browser
- OpenAI API key (get one at [platform.openai.com/api-keys](https://platform.openai.com/api-keys))

## Installation

### 1. Clone and Build

```bash
# Install dependencies
npm install

# Build the extension
npm run build
```

The extension will be built into the `dist/` directory.

### 2. Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `dist` folder from this project

### 3. Configure OpenAI API Key

1. Click the extension icon in Chrome toolbar
2. Click "Settings"
3. Enter your OpenAI API key
4. Click "Save API Key"

## Usage

### Harvesting a Single Profile

1. Navigate to any LinkedIn profile page
2. Click the extension icon
3. Click "Harvest Current Profile"
4. Wait for the AI to extract and structure the profile data

### Bulk Harvesting from Search Results

1. Navigate to LinkedIn search results (e.g., search for "software engineer")
2. The extension will automatically highlight profile links
3. Click the "+ Harvest" button next to profiles you want to save
4. Profiles are queued for processing

### Viewing Profiles

- Open the extension popup to see all saved profiles
- Click on any profile to view full details
- Profiles show name, title, tags, experience, and education

### Searching Profiles

1. Enter a natural language query in the search box (e.g., "React developers with 5+ years experience")
2. Click "Search"
3. AI will find and rank the most relevant profiles

### Exporting Data

1. Open the extension popup
2. Scroll to the bottom of the profile list
3. Choose export format: JSON, Markdown, or CSV
4. File will automatically download

### Deleting Profiles

- Click the "Delete" button on any profile card
- Confirm the deletion

## Development

### Project Structure

```
linkedin-profile-harvester/
├── src/
│   ├── background/          # Background service worker
│   ├── content/             # Content script for LinkedIn pages
│   ├── popup/               # Extension popup UI
│   │   ├── screens/         # React screens
│   │   ├── App.tsx          # Main app component
│   │   └── appMachine.ts    # xState state machine
│   ├── components/          # Reusable React components
│   ├── services/            # Business logic services
│   │   ├── AiIntegrationSettingsService.ts
│   │   ├── AiPoweredProfileEnrichmentService.ts
│   │   ├── DomContentExtractionService.ts
│   │   ├── ExportDataService.ts
│   │   ├── OpenAiIntegrationService.ts
│   │   ├── ProfileEnqueuerService.ts
│   │   └── ProfileRepository.ts
│   └── types/               # TypeScript type definitions
├── public/                  # Static assets
└── dist/                    # Built extension (generated)
```

### Build Commands

```bash
# Development build
npm run dev

# Production build
npm run build

# Watch mode (auto-rebuild on changes)
npm run watch
```

### Architecture

The extension follows a modular architecture with clear separation of concerns:

- **Services Layer**: Handles all business logic (profile management, AI integration, data export)
- **UI Layer**: React components with xState for state management
- **Storage Layer**: Chrome storage API for data persistence
- **Content Script**: Injects functionality into LinkedIn pages
- **Background Script**: Coordinates services and handles messages

## Implementation Details

All 14 issues from CLAUDE.md have been implemented:

1. ✅ Project Foundation & Initial Setup
2. ✅ DOM Content Extraction Service
3. ✅ AI Integration Settings Management
4. ✅ Profile Data Model and Storage
5. ✅ OpenAI Integration Service
6. ✅ Profile Enqueuer Service
7. ✅ AI-Powered Profile Enrichment
8. ✅ AI-Guided Scraping Content Script
9. ✅ Data Export Service
10. ✅ AI-Powered Profile Search Logic
11. ✅ UI - Main Layout, State Machine, and Settings Screen
12. ✅ UI - Profile List and Deletion
13. ✅ UI - Profile Harvesting and Detail View
14. ✅ UI - Profile Search and Data Export

## Security & Privacy

- API keys are stored locally using Chrome's storage API
- No data is sent to external servers except OpenAI (for profile processing)
- All profile data is stored locally in your browser
- The extension only requests necessary permissions (activeTab, storage, scripting)

## Troubleshooting

### "Failed to extract content from page"
- Ensure you're on a LinkedIn profile page (URL contains `/in/`)
- Try refreshing the LinkedIn page and trying again
- Check that you have an active internet connection

### "OpenAI API key not configured"
- Go to Settings and enter your API key
- Verify the API key is correct (starts with `sk-`)
- Check your OpenAI account has available credits

### Extension not loading
- Verify you built the project (`npm run build`)
- Check the `dist` folder exists and contains files
- Look for errors in Chrome's extension page

### Profiles not showing
- Check Chrome DevTools console for errors
- Try clicking "Settings" then "Back to List" to refresh
- Clear Chrome storage and restart

## License

ISC

## Contributing

This project was built according to the implementation guide in `CLAUDE.md`. All features are complete and functional.

## Support

For issues, questions, or contributions, please refer to the project repository.
