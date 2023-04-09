chrome.commands.onCommand.addListener(function(command) {
  if (command === 'toggle-selector') {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const currentUrl = tabs[0].url;

      if (currentUrl.includes('github.com') && currentUrl.includes('/tree/')) {
        chrome.storage.sync.get(['repository', 'branch'], function(data) {
          const repository = data.repository;
          const branch = data.branch;

          if (repository && branch) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'startListening' });
          } else {
            chrome.runtime.openOptionsPage();
          }
        });
      }
    });
  }
});
