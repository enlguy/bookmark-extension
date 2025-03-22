document.addEventListener("DOMContentLoaded", () => {
  console.log("Popup loaded!"); // Log when popup loads successfully

  const saveButton = document.getElementById("save-bookmark");
  saveButton.addEventListener("click", () => {
    console.log("Save button clicked!"); // Log when the button is clicked

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab && activeTab.url.includes("youtube.com/watch")) {
        chrome.scripting.executeScript(
          {
            target: { tabId: activeTab.id },
            func: () => ({
              url: window.location.href,
              title: document.title,
            }),
          },
          (results) => {
            console.log("Video details fetched:", results); // Log video details
            const bookmark = results[0].result;

            chrome.runtime.sendMessage(
              { action: "saveBookmark", bookmark },
              (response) => {
                if (response?.success) {
                  alert("Bookmark saved!");
                  console.log("Bookmark saved successfully!", bookmark); // Log success
                } else {
                  alert("Failed to save the bookmark.");
                  console.error("Error saving the bookmark.");
                }
              }
            );
          }
        );
      } else {
        alert("Please navigate to a YouTube video to save a bookmark.");
      }
    });
  });
});
