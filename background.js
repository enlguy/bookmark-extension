chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in background script:", message); // Log the received message

  if (message.action === "saveBookmark") {
    // Retrieve existing bookmarks
    chrome.storage.local.get({ bookmarks: [] }, (data) => {
      console.log("Existing bookmarks:", data.bookmarks); // Log current bookmarks

      // Add the new bookmark to the array
      const bookmarks = data.bookmarks;
      bookmarks.push(message.bookmark);

      // Save updated bookmarks to storage
      chrome.storage.local.set({ bookmarks }, () => {
        console.log("Bookmark saved to storage:", message.bookmark); // Log the saved bookmark
        sendResponse({ success: true }); // Confirm success
      });
    });

    return true; // Keep the messaging channel open for async response
  }
});
