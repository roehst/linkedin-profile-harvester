# Release Process Guide

This document explains how to create and publish releases of the LinkedIn Profile Harvester extension.

## Quick Start

### Automated Release (Recommended)

```bash
# 1. Update version in manifest.json
# Edit public/manifest.json and change the version number

# 2. Commit your changes
git add .
git commit -m "Release v1.0.1"

# 3. Create and push a tag
git tag v1.0.1
git push origin v1.0.1
```

That's it! GitHub Actions will automatically:
- Build the extension
- Create a ZIP package
- Publish a GitHub Release with installation instructions
- Attach the ZIP file to the release

### Manual Release

```bash
# Build and package locally
npm run package
```

The ZIP file will be created in the `releases/` directory.

---

## Detailed Instructions

### 1. Prepare for Release

#### Update Version Number

Edit [public/manifest.json](public/manifest.json):

```json
{
  "manifest_version": 3,
  "name": "LinkedIn Profile Harvester",
  "version": "1.0.1",  // <- Update this
  ...
}
```

Version format: `MAJOR.MINOR.PATCH`
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

#### Update Changelog (Optional)

If you maintain a CHANGELOG.md, update it with the changes in this release.

#### Commit Changes

```bash
git add public/manifest.json
git commit -m "Bump version to 1.0.1"
git push origin main
```

### 2. Create Release

#### Option A: Automated via Git Tag

```bash
# Create a tag matching the version
git tag v1.0.1

# Push the tag to trigger GitHub Actions
git push origin v1.0.1
```

**What happens next:**
1. GitHub Actions workflow starts automatically
2. Extension is built in production mode
3. ZIP package is created
4. GitHub Release is published with:
   - Release notes
   - Installation instructions
   - ZIP file attachment
   - INSTALLATION.md file

**Check progress:**
- Go to your repository on GitHub
- Click "Actions" tab
- Watch the "Build and Release" workflow run

#### Option B: Manual Trigger on GitHub

1. Go to your GitHub repository
2. Click **"Actions"** tab
3. Select **"Build and Release"** workflow (left sidebar)
4. Click **"Run workflow"** button (right side)
5. Select the branch (usually `main`)
6. Click green **"Run workflow"** button

#### Option C: Manual Local Build

```bash
# Build and package
npm run package
```

Output: `releases/linkedin-profile-harvester-v1.0.1.zip`

Then manually create a GitHub Release:
1. Go to your repository on GitHub
2. Click "Releases" (right sidebar)
3. Click "Draft a new release"
4. Create a new tag (e.g., `v1.0.1`)
5. Add release title and description
6. Upload the ZIP file from `releases/` folder
7. Publish release

### 3. Verify Release

1. Go to [Releases page](https://github.com/YOUR_USERNAME/linkedin-profile-harvester/releases)
2. Verify the latest release appears
3. Check that the ZIP file is attached
4. Download and test the ZIP file:
   - Extract it
   - Load it in Chrome as an unpacked extension
   - Test basic functionality

### 4. Distribute to Users

Share the release link with your users:
```
https://github.com/YOUR_USERNAME/linkedin-profile-harvester/releases/latest
```

Users should:
1. Download the ZIP file
2. Follow [INSTALLATION.md](INSTALLATION.md) instructions

---

## GitHub Actions Workflow

The workflow file is located at [.github/workflows/release.yml](.github/workflows/release.yml)

### Triggers

The workflow runs when:
- A tag starting with `v` is pushed (e.g., `v1.0.0`, `v2.1.3`)
- Manually triggered from GitHub Actions UI

### Steps

1. **Checkout code**: Gets the latest code from the repository
2. **Setup Node.js**: Installs Node.js v18
3. **Install dependencies**: Runs `npm ci`
4. **Build extension**: Runs `npm run build` (production mode)
5. **Get version**: Extracts version from built manifest.json
6. **Create ZIP**: Packages the `dist/` folder into a ZIP file
7. **Create Release**: Publishes a GitHub Release with:
   - Auto-generated release notes
   - Installation instructions
   - ZIP file attachment
8. **Upload artifact**: Saves build as GitHub artifact (90 days retention)

### Customizing the Workflow

Edit [.github/workflows/release.yml](.github/workflows/release.yml) to:
- Change Node.js version
- Modify release notes format
- Add additional files to release
- Change artifact retention period
- Add testing steps before release

---

## Troubleshooting

### "Version already exists" error

If you try to push a tag that already exists:

```bash
# Delete local tag
git tag -d v1.0.1

# Delete remote tag
git push origin :refs/tags/v1.0.1

# Create new tag and push
git tag v1.0.1
git push origin v1.0.1
```

### GitHub Actions workflow not running

- Check that the tag starts with `v` (e.g., `v1.0.0`, not `1.0.0`)
- Verify GitHub Actions are enabled in repository settings
- Check the "Actions" tab for error messages

### Build fails on GitHub Actions

- Run `npm run build` locally to check for build errors
- Check that all dependencies are in `package.json` (not just `devDependencies`)
- Review the workflow logs in GitHub Actions tab

### ZIP file is too large

- Ensure source maps are disabled for production builds (check webpack.config.js)
- Verify `node_modules` is not being included
- Check that `.gitignore` patterns are correct

---

## Version History

Keep track of your releases:

| Version | Date | Notes |
|---------|------|-------|
| v1.0.0  | 2024-01-XX | Initial release |
| v1.0.1  | 2024-XX-XX | Bug fixes |

---

## Best Practices

1. **Always test locally first**: Run `npm run build` and test the extension before creating a release
2. **Use semantic versioning**: Follow MAJOR.MINOR.PATCH format
3. **Write clear release notes**: Explain what changed in each release
4. **Tag after testing**: Only create git tags for tested, working code
5. **Keep manifest.json version in sync**: Always update it before tagging
6. **Test the distributed ZIP**: Download and install the release ZIP to verify it works

---

## Publishing to Chrome Web Store (Optional)

To distribute the extension through the official Chrome Web Store:

1. Create a [Chrome Web Store Developer account](https://chrome.google.com/webstore/devconsole) ($5 one-time fee)
2. Click "New Item"
3. Upload the ZIP file from a release
4. Fill in store listing details (description, screenshots, etc.)
5. Submit for review (usually takes 1-3 days)
6. Once approved, users can install directly from the store

**Benefits of Chrome Web Store:**
- Automatic updates for users
- No "Developer mode" required
- Better discoverability
- Verified publisher badge

**Note**: The current setup creates unpacked extensions suitable for private distribution. For Chrome Web Store submission, you may need to adjust some build settings.

---

## Questions?

- Check GitHub Actions logs for build errors
- Review [webpack.config.js](webpack.config.js) for build configuration
- See [package.json](package.json) for build scripts
- Read [INSTALLATION.md](INSTALLATION.md) for user installation steps
