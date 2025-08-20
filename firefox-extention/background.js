browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({
    id: "enableElement",
    title: "Enable this element",
    contexts: ["all"]
  });
});

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "enableElement") {
    browser.tabs.sendMessage(tab.id, { action: "contextEnable" });
  }
});

browser.commands.onCommand.addListener((command) => {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    browser.tabs.sendMessage(tabs[0].id, { action: command });
  });
});
