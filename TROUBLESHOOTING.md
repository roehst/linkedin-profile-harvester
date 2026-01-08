# Troubleshooting Guide

## Common Issues and Solutions

### "GET chrome-extension://invalid/" Errors in Console

**Symptom**: Multiple `ERR_FAILED` errors appearing in the Chrome DevTools console when opening the extension popup.

**Cause**: Tailwind CSS v4 may try to load external resources or fonts that are blocked by Chrome's extension security model.

**Solution**: Already fixed in the latest build. The `popup.html` file now includes a proper Content Security Policy (CSP) meta tag that prevents external resource loading:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src https://api.openai.com">
```

If you still see these errors:
1. Reload the extension in `chrome://extensions/`
2. Close and reopen the extension popup
3. Clear Chrome's cache and restart the browser

---

### Buttons Don't Work (Settings, Harvest, etc.)

**Symptom**: Clicking buttons in the extension popup doesn't trigger any action.

**Possible Causes**:
1. Background script not loaded properly
2. JavaScript errors in the console
3. Chrome storage permissions issue

**Solutions**:

1. **Check Background Script**:
   - Go to `chrome://extensions/`
   - Find "LinkedIn Profile Harvester"
   - Click "service worker" link to open the background script console
   - Look for any errors

2. **Check Popup Console**:
   - Right-click the extension icon
   - Select "Inspect popup"
   - Check the Console tab for errors

3. **Reload Extension**:
   - Go to `chrome://extensions/`
   - Click the reload icon for the extension
   - Try again

4. **Verify Build**:
   ```bash
   npm run build
   ```
   - Ensure the build completes without errors
   - Check that `dist/` folder contains all files

---

### "Failed to extract content from page"

**Symptom**: Error message when trying to harvest a profile.

**Causes**:
1. Not on a LinkedIn profile page
2. LinkedIn URL structure changed
3. Page not fully loaded
4. Chrome permissions issue

**Solutions**:

1. **Verify You're on a Profile Page**:
   - URL should contain `/in/` (e.g., `linkedin.com/in/username`)
   - Not on search results, feed, or other LinkedIn pages

2. **Wait for Page to Load**:
   - Ensure the LinkedIn page is fully loaded
   - Wait for all content to appear
   - Try refreshing the page

3. **Check Permissions**:
   - Go to `chrome://extensions/`
   - Check that extension has "activeTab" and "scripting" permissions
   - Try removing and re-adding the extension

4. **LinkedIn URL Validation**:
   - The extension only works on URLs matching:
     - `linkedin.com/in/*`
     - `www.linkedin.com/in/*`

---

### "OpenAI API key not configured"

**Symptom**: Error when trying to harvest profiles.

**Solutions**:

1. **Configure API Key**:
   - Click extension icon
   - Click "Settings"
   - Enter your OpenAI API key (starts with `sk-`)
   - Click "Save API Key"

2. **Verify API Key**:
   - Check that the key was copied correctly (no extra spaces)
   - Verify the key is active at [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Ensure your OpenAI account has available credits

3. **Check Storage**:
   - Open background script console
   - Run: `chrome.storage.local.get('openai_api_key', console.log)`
   - Verify the key is stored

---

### Profiles Not Showing in List

**Symptom**: Harvested profiles don't appear in the profile list.

**Solutions**:

1. **Reload the List**:
   - Click "Settings" then "Back to List"
   - Close and reopen the extension popup

2. **Check Storage**:
   - Open background script console
   - Run: `chrome.storage.local.get('profiles', console.log)`
   - Verify profiles are stored

3. **Check for Errors**:
   - Open popup console (right-click icon → "Inspect popup")
   - Look for JavaScript errors
   - Check background script console for errors

4. **Clear and Re-harvest**:
   - If storage seems corrupted:
   ```javascript
   chrome.storage.local.clear()
   ```
   - Reload extension
   - Try harvesting again

---

### Search Not Working

**Symptom**: AI-powered search returns no results or errors.

**Solutions**:

1. **Verify API Key**:
   - Ensure OpenAI API key is configured
   - Check API key has credits available

2. **Check Query**:
   - Use natural language queries
   - Example: "React developers with 5+ years"
   - Example: "Senior engineering managers"

3. **Verify Profiles Exist**:
   - Ensure you have profiles saved first
   - Search only works on existing profiles

4. **Check Console**:
   - Look for OpenAI API errors in background script console
   - Common issues:
     - Rate limiting (429 error)
     - Invalid API key (401 error)
     - Insufficient credits (insufficient_quota)

---

### Export Not Working

**Symptom**: Export buttons don't download files.

**Solutions**:

1. **Check Browser Permissions**:
   - Ensure browser allows downloads
   - Check if pop-up blocker is interfering

2. **Verify Profiles Exist**:
   - Can only export if profiles are loaded
   - Try refreshing the profile list

3. **Check Console**:
   - Open popup console
   - Look for JavaScript errors during export

4. **Try Different Format**:
   - If one format fails, try another
   - JSON is usually most reliable

---

### Content Script Not Highlighting Links

**Symptom**: LinkedIn search results don't show "Harvest" buttons.

**Solutions**:

1. **Verify URL**:
   - Must be on LinkedIn search results
   - URL should contain `/search/results/`

2. **Reload Page**:
   - Refresh the LinkedIn search results page
   - Extension should automatically inject

3. **Check Content Script**:
   - Open page console (F12)
   - Look for message: "LinkedIn Profile Harvester content script loaded"
   - If not present, content script didn't load

4. **Check Manifest**:
   - Verify `manifest.json` includes:
   ```json
   "content_scripts": [
     {
       "matches": ["https://www.linkedin.com/search/results/*"],
       "js": ["content.js"]
     }
   ]
   ```

5. **Reload Extension**:
   - Go to `chrome://extensions/`
   - Reload the extension
   - Refresh LinkedIn page

---

### Extension Won't Load

**Symptom**: Extension doesn't appear in Chrome toolbar or shows errors when loading.

**Solutions**:

1. **Check Build**:
   ```bash
   npm run build
   ```
   - Ensure no build errors
   - Verify `dist/` folder exists and contains files

2. **Verify Manifest**:
   - Check `dist/manifest.json` is valid JSON
   - Ensure all required files are referenced correctly

3. **Check Chrome Version**:
   - Extension requires Manifest V3
   - Requires Chrome 88+

4. **Check Errors**:
   - Go to `chrome://extensions/`
   - Look for error messages
   - Click "Details" to see specific errors

5. **Clean Rebuild**:
   ```bash
   rm -rf node_modules dist
   npm install
   npm run build
   ```

---

## Development Issues

### Webpack Build Errors

**Solution**:
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

### TypeScript Errors

**Solution**:
- Check `tsconfig.json` is correctly configured
- Ensure all `@types/*` packages are installed
- Run: `npx tsc --noEmit` to check for type errors

### Hot Reload Not Working

**Solution**:
- Watch mode doesn't auto-reload extension
- After file changes:
  1. `npm run watch` rebuilds automatically
  2. Manually reload extension in `chrome://extensions/`
  3. Refresh affected pages

---

## Getting Help

### Debug Information to Collect

When reporting issues, please include:

1. **Chrome Version**: Check in `chrome://version/`
2. **Extension Version**: 1.0.0
3. **Error Messages**: From both popup and background console
4. **Steps to Reproduce**: Detailed steps that trigger the issue
5. **Screenshots**: If UI issue

### Console Logs

To enable verbose logging:
1. Open background script console
2. Run: `chrome.storage.local.get(console.log)` to see all stored data
3. Check for any error messages

### Reset Extension

To completely reset the extension:
```javascript
// In background script console
chrome.storage.local.clear()
```
Then reload the extension and reconfigure.

---

## Known Limitations

1. **LinkedIn Rate Limiting**: LinkedIn may block rapid scraping
2. **OpenAI Costs**: Each profile harvest costs ~$0.01-0.02
3. **Storage Limits**: Chrome storage limited to 10MB
4. **Profile Structure Changes**: If LinkedIn changes their HTML structure, extraction may fail

---

## Contact & Support

- Check `README.md` for usage instructions
- Review `IMPLEMENTATION_SUMMARY.md` for technical details
- Check `CLAUDE.md` for architecture overview
