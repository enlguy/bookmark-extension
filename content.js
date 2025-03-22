// Example: Save the current YouTube video as a bookmark
const saveBookmark = () => {
  const videoTitle =
    document.querySelector("h1.title")?.innerText || "Untitled Video";
  const videoUrl = window.location.href;
  const videoPlayer = document.querySelector("video");

  const currentTime = Math.floor(videoPlayer?.currentTime || 0);

  chrome.runtime.sendMessage(
    {
      action: "saveBookmark",
      bookmark: { url: videoUrl, title: videoTitle },
    },
    (response) => {
      if (response?.success) {
        console.log("Bookmark saved successfully!");
      } else {
        console.error("Failed to save the bookmark.");
      }
    }
  );
};

// Add a keyboard shortcut (for example, 'Ctrl+B') to save the bookmark
document.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key === "b") {
    saveBookmark();
  }
});
