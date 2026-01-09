# LinkedIn Profile Harvester - Installation Guide

This guide will help you install the LinkedIn Profile Harvester Chrome extension on your computer.

## What You'll Need

1. **Google Chrome browser** (or any Chromium-based browser like Edge, Brave, etc.)
2. **The extension ZIP file** (`linkedin-profile-harvester-v1.0.0.zip`)
3. **An OpenAI API key** - Get one free at [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

---

## Step 1: Download the Extension

Download the latest release ZIP file:
- `linkedin-profile-harvester-v1.0.0.zip`

**Save it somewhere you can find it** (like your Downloads folder or Desktop).

---

## Step 2: Extract the ZIP File

1. **Find the downloaded ZIP file** on your computer
2. **Right-click** on the file
3. **Choose "Extract All..."** (Windows) or **double-click** (Mac)
4. **Remember where you extracted it** - you'll need this folder in the next step

> ⚠️ **Important**: Keep the extracted folder somewhere permanent (don't delete it). The extension will stop working if you delete this folder.

---

## Step 3: Open Chrome Extensions Page

1. **Open Google Chrome**
2. **Type** `chrome://extensions/` in the address bar and press Enter
   - Or click the three dots menu (⋮) → **More Tools** → **Extensions**

---

## Step 4: Enable Developer Mode

1. Look for **"Developer mode"** toggle in the **top right corner** of the Extensions page
2. **Turn it ON** (it should turn blue)

![Developer Mode Toggle](https://i.imgur.com/example.png)

> 💡 Don't worry - this is safe! "Developer mode" just means you can install extensions that aren't from the Chrome Web Store.

---

## Step 5: Load the Extension

1. Click the **"Load unpacked"** button (appears after enabling Developer mode)
2. **Navigate to** the folder you extracted in Step 2
3. **Select the folder** and click **"Select Folder"** or **"Open"**

You should now see **"LinkedIn Profile Harvester"** appear in your extensions list!

---

## Step 6: Configure Your OpenAI API Key

The extension needs an OpenAI API key to work. Here's how to set it up:

### Getting Your API Key

1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign in or create a free account
3. Click **"Create new secret key"**
4. **Copy the key** (it starts with `sk-proj-...`)
5. **Save it somewhere safe** - you won't be able to see it again!

### Adding the Key to the Extension

1. **Click the extension icon** in your Chrome toolbar (puzzle piece icon → LinkedIn Profile Harvester)
2. Click **"Settings"**
3. **Paste your API key** in the text box
4. Click **"Save API Key"**

You should see a success message: "API key saved successfully!"

---

## Step 7: Start Using the Extension!

You're all set! Here's what you can do:

### Harvest a LinkedIn Profile

1. Go to any LinkedIn profile page (e.g., `linkedin.com/in/someone`)
2. Click the extension icon
3. Click **"Harvest Current Profile"**
4. Wait for the AI to extract the information
5. Done! The profile is saved

### Harvest Multiple Profiles from Search

1. Go to LinkedIn and search for people (e.g., "software engineer")
2. You'll see **"+ Harvest"** buttons next to profile links
3. Click these buttons to queue profiles for harvesting
4. They'll be processed automatically

### View Your Saved Profiles

1. Click the extension icon
2. See all your saved profiles
3. Click any profile to view full details

### Search Your Profiles

1. Open the extension
2. Type a natural language query like "React developers with 5+ years"
3. Click "Search"
4. AI will find and rank the most relevant profiles

### Export Your Data

1. Open the extension
2. Scroll to the bottom
3. Choose your format: **JSON**, **Markdown**, or **CSV**
4. File downloads automatically

---

## Troubleshooting

### "Extension not found" or won't load
- Make sure you extracted the ZIP file completely
- Make sure you selected the right folder (it should contain `manifest.json`)
- Try extracting to a different location

### "Failed to extract content from page"
- Make sure you're on a LinkedIn profile page (URL contains `/in/`)
- Refresh the LinkedIn page and try again
- Check your internet connection

### "OpenAI API key not configured"
- Go to Settings and enter your API key
- Make sure the key is correct (starts with `sk-proj-` or `sk-`)
- Check your OpenAI account has available credits

### Extension icon not showing in toolbar
- Click the puzzle piece icon in Chrome toolbar
- Find "LinkedIn Profile Harvester"
- Click the pin icon to keep it visible

### Profiles not appearing
- Click "Settings" then "Back to List" to refresh
- Open Chrome DevTools (F12) and check for errors in the Console
- Try reloading the extension: go to `chrome://extensions/` and click the reload icon

---

## Uninstalling

To remove the extension:

1. Go to `chrome://extensions/`
2. Find "LinkedIn Profile Harvester"
3. Click **"Remove"**
4. Confirm removal
5. You can now delete the extracted folder

> ⚠️ **Note**: This will delete all saved profiles. Export your data first if you want to keep it!

---

## Privacy & Security

- ✅ All profile data is stored **locally** on your computer
- ✅ Your API key is stored **securely** in Chrome's storage
- ✅ No data is sent to external servers (except OpenAI for processing)
- ✅ The extension only works on LinkedIn pages you visit

---

## Need Help?

If you encounter any issues:

1. Check the troubleshooting section above
2. Make sure you're using the latest version of Chrome
3. Try disabling other extensions to check for conflicts
4. Contact your system administrator or IT support

---

## Updates

To update the extension:

1. Download the new version ZIP file
2. Extract it to a **new folder**
3. Go to `chrome://extensions/`
4. Remove the old version
5. Load the new version using "Load unpacked"

Your saved profiles and settings will be preserved (they're stored separately).

---

**Enjoy harvesting profiles!** 🎉
