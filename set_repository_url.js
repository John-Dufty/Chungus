// Wait for the DOM content to load before executing the script
document.addEventListener('DOMContentLoaded', function() {
    // Get references to HTML elements
    var wrapper = document.getElementById('wrapper');
    var RepositoryKeyInput = document.getElementById('RepositoryUrl');
    var optionsButton = document.getElementById('options');
    var setupGuideButton = document.getElementById('setup_guide');
    var userGuideButton = document.getElementById('user_guide');
    var donateButton = document.getElementById('donate');
    var sampleText = document.getElementById('sampleText');
    
    // Retrieve the Repository key from local storage and set the value of the input field if it exists
    chrome.storage.local.get('RepositoryUrl', function(data) {
        if (data.RepositoryUrl) {
            RepositoryKeyInput.value = data.RepositoryUrl;
        }
    });

    function isValidRepoUrl(url) {
        var regex = /^[\w\d-.]+\/[\w\d-.]+$/i; // Add "." to the character class and "i" flag for case-insensitive matching
        return regex.test(url);
    }

document.getElementById('save').addEventListener('click', function(event) {
    event.preventDefault();
    var repoUrl = RepositoryKeyInput.value.trim();
    console.log('Input value:', repoUrl); // Debugging

    if (isValidRepoUrl(repoUrl)) {
        console.log('URL is valid:', repoUrl); // Debugging
        chrome.storage.local.set({ RepositoryUrl: repoUrl }, function() {
            wrapper.style.display = 'none';
            optionsButton.classList.remove('active');
        });
    } else {
        console.log('URL is invalid:', repoUrl); // Debugging
        alert("Invalid repository URL format. Please provide a valid URL in the format \"user/repo\".");
    }
});
    // Toggle the display of the wrapper element and the "active" class of the options button on click
	optionsButton.addEventListener('click', function() {
        wrapper.style.display = wrapper.style.display === 'block' ? 'none' : 'block';
        optionsButton.classList.toggle('active');
        setupGuideButton.classList.remove('active');
        userGuideButton.classList.remove('active');
        donateButton.classList.remove('active');
        sampleText.style.display = 'none';
    });
    // Toggle the display of the sample text element and the "active" class of the setup guide button on click
    setupGuideButton.addEventListener('click', function() {
		sampleText.innerHTML = "1. Copy the repository link for a GitHub repo in the format of user/repo<br><br>2. Access the options for this extension via the extensions form in the top right<br><br>3. Press the Options button to access the repo form<br><br>4. Paste the repository link into the Repository URL form and save";
        sampleText.style.display = sampleText.style.display === 'block' ? 'none' : 'block';
        setupGuideButton.classList.toggle('active');
        userGuideButton.classList.remove('active');
        donateButton.classList.remove('active');
        optionsButton.classList.remove('active');
        wrapper.style.display = 'none';
    });
    // Toggle the display of the sample text element and the "active" class of the user guide button on click
    userGuideButton.addEventListener('click', function() {
		sampleText.innerHTML = "1. Select an editable region of the webpage and highlight it. <br><br>2. Open the playbook menu via the Alt+` keyboard shortcut. <br><br>3. Navigate via keyboard number shortcuts 1-9 to select the desired folder. <br><br>4. Navigate via keyboard number shortcuts 1-9 to select the desired file. <br><br>5. The contents of the file will be pasted into the active element of the webpage.";
        sampleText.style.display = sampleText.style.display === 'block' ? 'none' : 'block';
        userGuideButton.classList.toggle('active');
        setupGuideButton.classList.remove('active');
        donateButton.classList.remove('active');
        optionsButton.classList.remove('active');
        wrapper.style.display = 'none';
    });
    // Toggle the display of the sample text element and the "active" class of the donate button on click
    donateButton.addEventListener('click', function() {
        sampleText.innerHTML = 'Donation Links: <a href="https://www.buymeacoffee.com/johndufty1997" target="_blank" style="color: black;">Buy me a coffee</a> <br><br>Bitcoin: 12cQfKXZr3SWFbR1PeAqBH682EpHUMR7ft<br><br>This extension was made for free and open source to help Security Professionals expediently triage with OSINT tools. Any donations are appreciated but not essential.';
        sampleText.style.display = sampleText.style.display === 'block' ? 'none' : 'block';
        donateButton.classList.toggle('active');
        setupGuideButton.classList.remove('active');
        userGuideButton.classList.remove('active');
        optionsButton.classList.remove('active');
        wrapper.style.display = 'none';
    });
    // Save the Repository key to local storage and hide the wrapper element and options button on click
    document.getElementById('save').addEventListener('click', function(event) {
        event.preventDefault();
        chrome.storage.local.set({ RepositoryUrl: RepositoryKeyInput.value.trim() }, function() {
        wrapper.style.display = 'none';
        optionsButton.classList.remove('active');
    });
});
});


