document.getElementById("enableMode").addEventListener("click", () => {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    browser.tabs.sendMessage(tabs[0].id, { action: "enableSelection" });
  });
});

document.getElementById("enableAll").addEventListener("click", () => {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    browser.tabs.sendMessage(tabs[0].id, { action: "enableAll" });
  });
});
