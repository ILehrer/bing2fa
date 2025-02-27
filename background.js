chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "getStorage") {
      chrome.storage.local.get("_bing_2fa_key", function(result) {
        sendResponse(result);
      });
      return true; // Indicates asynchronous response
    }
  });
  