// Wait for the DOM content to load before executing the script
document.addEventListener('DOMContentLoaded', function() {
    // Get references to HTML elements
    var wrapper = document.getElementById('wrapper');
    var apiKeyInput = document.getElementById('api_key');
    var optionsButton = document.getElementById('options');
    var toggleVisibilityButton = document.getElementById('toggle_visibility');
    var setupGuideButton = document.getElementById('setup_guide');
    var userGuideButton = document.getElementById('user_guide');
    var donateButton = document.getElementById('donate');
    var sampleText = document.getElementById('sampleText');
    // Retrieve the API key from local storage and set the value of the input field if it exists
    chrome.storage.local.get('api_key', function(data) {
        if (data.api_key) {
            apiKeyInput.value = data.api_key;
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
		sampleText.innerHTML = "1. Go to https://www.virustotal.com/gui/home/search and create an account if you don't already have one.<br><br>2. Once you've signed in, click the link to your API key located in the top right corner of the page.<br><br>3. Copy your API key by clicking \"Copy API key\".<br><br>4. Locate the SUS extension button under the extension menu (the puzzle piece icon) and click on it.<br><br>5. Click \"Options\" in the extension menu to open the settings page.<br><br>6. Paste your API key in the designated form and click \"Save\" to apply your changes.";
        sampleText.style.display = sampleText.style.display === 'block' ? 'none' : 'block';
        setupGuideButton.classList.toggle('active');
        userGuideButton.classList.remove('active');
        donateButton.classList.remove('active');
        optionsButton.classList.remove('active');
        wrapper.style.display = 'none';
    });
    // Toggle the display of the sample text element and the "active" class of the user guide button on click
    userGuideButton.addEventListener('click', function() {
		sampleText.innerHTML = "1. Begin by selecting the desired IP, hash, or domain ensuring that only the relevant text is highlighted. It's important to note that hashes must be in MD5, SHA-1 or SHA-256 formats and URLs must only contain the domain segment.<br><br>2. Once you've highlighted the text, initiate the search by using the shortcut key combination, ALT+C. Do not select anything else while this is processing.<br><br>3. Wait until the text is no longer highlighted, indicating that the search has been completed. Note also that the shortcut key can be modified manually by accessing chrome://extensions/shortcuts.<br><br>4. The API response will be stored within the clipboard, allowing for quick and easy access to the information in JSON format. This information can be quickly pasted into a given form for expedient ticket closure.";
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
    // Save the API key to local storage and hide the wrapper element and options button on click
    document.getElementById('save').addEventListener('click', function(event) {
        event.preventDefault();
    chrome.storage.local.set({ 'api_key': apiKeyInput.value }, function() {
        wrapper.style.display = 'none';
        optionsButton.classList.remove('active');
    });
});
    // Toggle the visibility of the API key input field and the "active" class of the toggle visibility button on click
toggleVisibilityButton.addEventListener('click', function() {
    apiKeyInput.type = apiKeyInput.type === 'password' ? 'text' : 'password';
    toggleVisibilityButton.classList.toggle('active');
});
});


