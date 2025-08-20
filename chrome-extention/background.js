// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "enableElement",
    title: "Enable this element",
    contexts: ["all"]
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "enableElement" && tab.id) {
    sendMessageOrInject(tab.id, { action: "contextEnable" });
  }
});

// Handle keyboard shortcuts (commands)
chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]) return;
    sendMessageOrInject(tabs[0].id, { action: command });
  });
});

/**
 * Sends a message to content.js
 * If it fails (not injected yet), injects content.js then retries.
 */
function sendMessageOrInject(tabId, msg) {
  chrome.tabs.sendMessage(tabId, msg, () => {
    if (chrome.runtime.lastError) {
      // Inject content.js dynamically
      chrome.scripting.executeScript(
        {
          target: { tabId },
          files: ["content.js"]
        },
        () => {
          // Retry after injection
          chrome.tabs.sendMessage(tabId, msg);
        }
      );
    }
  });
}
