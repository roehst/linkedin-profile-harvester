// Content script for LinkedIn search results pages

console.log('LinkedIn Profile Harvester content script loaded');

// Style for highlighted links
const HIGHLIGHT_STYLE = 'border: 2px solid #0077B5; border-radius: 4px; padding: 2px; background-color: #E7F3FF;';
const BUTTON_CLASS = 'linkedin-harvester-enqueue-btn';

// Track processed links
const processedLinks = new Set<string>();

/**
 * Initializes the content script
 */
function init() {
  console.log('Initializing LinkedIn Profile Harvester on:', window.location.href);

  // Initial scan for profile links
  scanForProfileLinks();

  // Set up mutation observer to detect dynamically loaded content
  const observer = new MutationObserver(() => {
    scanForProfileLinks();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  console.log('Content script initialized, monitoring for profile links');
}

/**
 * Scans the page for LinkedIn profile links
 */
function scanForProfileLinks() {
  const links = document.querySelectorAll('a[href*="/in/"]');

  links.forEach(link => {
    const href = (link as HTMLAnchorElement).href;

    // Check if it's a profile link and hasn't been processed
    if (isProfileLink(href) && !processedLinks.has(href)) {
      processedLinks.add(href);
      highlightLink(link as HTMLAnchorElement);
      addEnqueueButton(link as HTMLAnchorElement);
    }
  });
}

/**
 * Checks if a URL is a valid profile link
 */
function isProfileLink(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return (
      (urlObj.hostname === 'www.linkedin.com' || urlObj.hostname === 'linkedin.com') &&
      urlObj.pathname.startsWith('/in/') &&
      !urlObj.pathname.includes('/posts/') &&
      !urlObj.pathname.includes('/detail/')
    );
  } catch {
    return false;
  }
}

/**
 * Highlights a profile link
 */
function highlightLink(link: HTMLAnchorElement) {
  link.setAttribute('style', HIGHLIGHT_STYLE);
}

/**
 * Adds an enqueue button next to a profile link
 */
function addEnqueueButton(link: HTMLAnchorElement) {
  // Check if button already exists
  const existingBtn = link.parentElement?.querySelector(`.${BUTTON_CLASS}`);
  if (existingBtn) return;

  const button = document.createElement('button');
  button.className = BUTTON_CLASS;
  button.textContent = '+ Harvest';
  button.style.cssText = `
    margin-left: 8px;
    padding: 4px 8px;
    background-color: #0077B5;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: bold;
  `;

  button.addEventListener('mouseenter', () => {
    button.style.backgroundColor = '#005582';
  });

  button.addEventListener('mouseleave', () => {
    button.style.backgroundColor = '#0077B5';
  });

  button.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const url = link.href;
    button.disabled = true;
    button.textContent = 'Adding...';

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'ENQUEUE_PROFILE',
        url: url
      });

      if (response.success) {
        button.textContent = response.added ? '✓ Added' : '✓ Already in Queue';
        button.style.backgroundColor = '#057642';

        setTimeout(() => {
          button.textContent = '+ Harvest';
          button.style.backgroundColor = '#0077B5';
          button.disabled = false;
        }, 2000);
      } else {
        throw new Error(response.message || 'Failed to enqueue');
      }
    } catch (error) {
      console.error('Error enqueueing profile:', error);
      button.textContent = '✗ Error';
      button.style.backgroundColor = '#cc0000';

      setTimeout(() => {
        button.textContent = '+ Harvest';
        button.style.backgroundColor = '#0077B5';
        button.disabled = false;
      }, 2000);
    }
  });

  // Insert button after the link
  if (link.parentElement) {
    link.parentElement.insertBefore(button, link.nextSibling);
  }
}

// Run initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
