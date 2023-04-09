const selectionWheel = document.createElement("div");
selectionWheel.id = "github-folder-selection-wheel";
selectionWheel.style.display = "none";
document.body.appendChild(selectionWheel);

let RepositoryData = null;
let selectedFolderIndex = 0;
let selectedFileIndex = 0;
let selectionWheelToggled = false;
let selectedState = "folder";

async function fetchRepositoryData(RepositoryUrl) {
  const apiBaseUrl = "https://api.github.com/repos";
  const response = await fetch(`${apiBaseUrl}/${RepositoryUrl}/contents`);
  const data = await response.json();

  // Fetch files data for each directory
  const directories = data.filter(item => item.type === 'dir');
  await Promise.all(directories.map(async (dir) => {
    const dirResponse = await fetch(dir.url);
    const dirData = await dirResponse.json();
    dir.files = dirData.filter(item => item.type === 'file');
  }));

  return data;
}

function createWheelItems(items, selectedIndex, isFile = false, folderContents = null) {
  return items.map((item, index) => {
    const selectedClass = index === selectedIndex ? "selected" : "";
    const type = isFile ? "file" : "folder";
    const itemIndex = index + 1;
    const itemName = item.name;
    return `
      <div class="wheel-item ${selectedClass}" data-type="${type}" data-index="${index}">
        ${itemIndex}: ${itemName}
      </div>
    `;
  }).join("");
}

async function renderSelectionWheel(folders, files, selectedFolderIndex, selectedFileIndex, folderContents) {
  const folderItems = createWheelItems(folders, selectedFolderIndex);
  const fileDropdownStyle = files.length > 0 && selectedFolderIndex >= 0 ? "" : "display: none";
  if (selectionWheelToggled) { // check if the menu is toggled before rendering
    selectionWheel.innerHTML = `
      <div class="folder-items">${folderItems}</div>
      <div class="file-dropdown" style="${fileDropdownStyle}">
        <div class="file-dropdown-options">
          ${createWheelItems(files, selectedFileIndex, true)}
        </div>
      </div>
    `;
  }
}

async function toggleSelectionWheel(visible) {
  selectionWheel.style.display = visible ? "block" : "none";
  if (visible) {
    const { RepositoryUrl } = await new Promise((resolve) =>
      chrome.storage.local.get("RepositoryUrl", resolve)
    );

    if (!RepositoryUrl || !/^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/.test(RepositoryUrl)) {
      console.error('Invalid repository URL format. Please provide a valid URL in the format "user/repo".');
      return;
    }

    if (!RepositoryData) {
      RepositoryData = await fetchRepositoryData(RepositoryUrl);
    }

    if (!Array.isArray(RepositoryData) || RepositoryData.length === 0) {
      console.error("No repository data found or failed to fetch data.");
      return;
    }

    const folders = RepositoryData.filter((item) => item.type === "dir");

    if (folders.length === 0) {
      console.error('No directories found in the repository.');
      return;
    }

    const selectedFolder = folders[selectedFolderIndex];
    const folderContentsResponse = await fetch(selectedFolder.url);
    const folderContents = await folderContentsResponse.json();
    const files = folderContents.filter((item) => item.type === "file");

    renderSelectionWheel(folders, files, selectedFolderIndex, selectedFileIndex, folderContents); // render the menu here
  }
}

function pasteTextIntoActiveElement(fileContents) {
  const activeElement = document.activeElement;
  if (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA" || activeElement.isContentEditable) {
    const start = activeElement.selectionStart;
    const end = activeElement.selectionEnd;
    const text = activeElement.value || activeElement.textContent;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);

    if (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA") {
      activeElement.value = before + fileContents + after;
    } else {
      activeElement.textContent = before + fileContents + after;
    }
  }
}

document.addEventListener("keydown", async (event) => {
  if (event.altKey && event.key === "`") {
    event.preventDefault();
    selectionWheelToggled = !selectionWheelToggled;
    toggleSelectionWheel(selectionWheelToggled);
    if (!selectionWheelToggled) {
      selectedState = "folder";
      renderSelectionWheel(folders, files, selectedFolderIndex, selectedFileIndex, folderContents);
    }
  } else if (selectionWheelToggled && event.key.match(/[0-9]/) && event.repeat === false) {
    event.preventDefault();
    const numberPressed = parseInt(event.key, 10) - 1;
    const folders = RepositoryData.filter((item) => item.type === "dir");

    if (selectedState === "folder") {
      if (numberPressed >= 0 && numberPressed < folders.length) {
        selectedFolderIndex = numberPressed;
        const selectedFolder = folders[selectedFolderIndex];
        const folderContentsResponse = await fetch(selectedFolder.url);
        const folderContents = await folderContentsResponse.json();
        const files = folderContents.filter((item) => item.type === "file");
        renderSelectionWheel(folders, files, selectedFolderIndex, selectedFileIndex, folderContents);
        selectedState = "file";
      }
    } else if (selectedState === "file") {
      const selectedFolder = folders[selectedFolderIndex];
      const folderContentsResponse = await fetch(selectedFolder.url);
      const folderContents = await folderContentsResponse.json();
      const files = folderContents.filter((item) => item.type === "file");

      if (numberPressed >= 0 && numberPressed < files.length) {
        selectedFileIndex = numberPressed;
        renderSelectionWheel(folders, files, selectedFolderIndex, selectedFileIndex, folderContents);
        const selectedFile = files[selectedFileIndex];
        const fileResponse = await fetch(selectedFile.download_url);
        const fileContents = await fileResponse.text();
        pasteTextIntoActiveElement(fileContents);
        selectionWheelToggled = false;
        toggleSelectionWheel(false);
        selectedState = "folder";
        renderSelectionWheel(folders, files, selectedFolderIndex, selectedFileIndex, folderContents);
      }
    }
  } else if (selectionWheelToggled && event.key === "Escape") {
    event.preventDefault();
    selectionWheelToggled = false;
    toggleSelectionWheel(false);
    selectedState = "folder";
    renderSelectionWheel(folders, files, selectedFolderIndex, selectedFileIndex, folderContents);
  }
});