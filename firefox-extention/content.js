let selectionMode = false;

function showToast(message, duration = 2000) {
  const toast = document.createElement("div");
  toast.textContent = message;
  Object.assign(toast.style, {
    position: "fixed",
    bottom: "60px",
    left: "30px",
    padding: "10px 16px",
    background: "rgba(0,0,0,0.85)",
    color: "#fff",
    fontSize: "14px",
    borderRadius: "8px",
    zIndex: 2147483647,
    fontFamily: "system-ui, sans-serif",
    boxShadow: "0 2px 6px rgba(0,0,0,0.4)"
  });
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = "opacity 0.4s";
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

function highlight(el) {
  el.style.outline = "2px solid lime";
  setTimeout(() => (el.style.outline = ""), 1200);
}

function enableElement(el) {
  if (!el) return;
  let target = el;

  if (
    !target.hasAttribute("disabled") &&
    !target.hasAttribute("readonly") &&
    !(target.type === "hidden")
  ) {
    target = el.querySelector("[disabled], [readonly], input[type=hidden]");
  }

  if (!target) return;

  if (target.hasAttribute("disabled")) target.removeAttribute("disabled");
  if (target.hasAttribute("readonly")) target.removeAttribute("readonly");
  if (target.type === "hidden") target.type = "text";

  highlight(target);
  // showToast("✅ Element Enabled");
}

browser.runtime.onMessage.addListener((msg) => {
  if (msg.action === "enableSelection") {
    selectionMode = true;
    document.documentElement.style.setProperty(
      "cursor",
      "crosshair",
      "important"
    );
    showToast("🎯 Selection Mode Activated");
  }

  if (msg.action === "enableAll") {
    document
      .querySelectorAll("[disabled], [readonly], input[type=hidden]")
      .forEach((el) => enableElement(el));
    showToast("🚀 All Elements Enabled");
  }

  if (msg.action === "contextEnable") {
    document.addEventListener(
      "contextmenu",
      (e) => {
        enableElement(e.target);
      },
      { once: true }
    );
  }
});

document.addEventListener(
  "click",
  (e) => {
    if (!selectionMode) return;

    e.preventDefault();
    e.stopPropagation();

    enableElement(e.target);

    selectionMode = false;
    document.documentElement.style.cursor = "default";
  },
  true
);
