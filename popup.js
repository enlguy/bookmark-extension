document.addEventListener("DOMContentLoaded", () => {
  console.log("Popup loaded!"); // Confirm popup loads successfully

  const saveButton = document.getElementById("save-bookmark");
  const bookmarkList = document.getElementById("bookmark-list");

  function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`; // Use full RGB spectrum for vivid colors
  }

  // Save a new bookmark
  saveButton.addEventListener("click", () => {
    console.log("Save button clicked!"); // Log the button click

    // Get the active YouTube tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab && activeTab.url.includes("youtube.com/watch")) {
        // Inject a script to fetch video details and timestamp
        chrome.scripting.executeScript(
          {
            target: { tabId: activeTab.id },
            func: () => ({
              url: window.location.href,
              title: document.title,
              timestamp: Math.floor(
                document.querySelector("video")?.currentTime || 0
              ), // Current playback time
            }),
          },
          (results) => {
            const bookmark = results[0]?.result;
            if (bookmark) {
              console.log("Video details fetched:", bookmark); // Log video details

              // Send bookmark to background script for saving
              chrome.runtime.sendMessage(
                { action: "saveBookmark", bookmark },
                (response) => {
                  if (response?.success) {
                    console.log("Bookmark saved successfully!", bookmark);

                    // Update the UI to show the new bookmark
                    const li = document.createElement("li");
                    const a = document.createElement("a");
                    a.href = `${bookmark.url}&t=${bookmark.timestamp}s`;
                    a.textContent = `${bookmark.title} (${formatTime(
                      bookmark.timestamp
                    )})`;
                    a.target = "_blank"; // Open in a new tab
                    li.appendChild(a);
                    li.style.backgroundColor = getRandomColor();
                    bookmarkList.appendChild(li);
                    alert("Bookmark saved!");
                  } else {
                    alert("Failed to save the bookmark.");
                  }
                }
              );
            } else {
              console.error("Failed to fetch video details.");
            }
          }
        );
      } else {
        alert("Please navigate to a YouTube video to save a bookmark.");
      }
    });
  });

  // Load and display existing bookmarks when the popup opens
  chrome.storage.local.get({ bookmarks: [] }, (data) => {
    bookmarkList.innerHTML = ""; // Clear the list before populating
    data.bookmarks.forEach((bookmark) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `${bookmark.url}&t=${bookmark.timestamp}s`;
      a.textContent = `${bookmark.title} (${formatTime(bookmark.timestamp)})`;
      a.target = "_blank"; // Open in a new tab
      a.style.color = "inherit";
      li.appendChild(a);
      bookmarkList.appendChild(li);
    });
  });

  // Helper function to format timestamp (e.g., 123 seconds -> 2:03)
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }
});
