const lastSubmissionTime = localStorage.getItem('submitTime');
const currentTime = Date.now();

(async function() {
if (!lastSubmissionTime || (currentTime - parseInt(lastSubmissionTime)) > 10000) {
    // Find the 2FA input field by ID
    const inputField = document.getElementById("token");

    if (inputField) {
        localStorage.setItem('submitTime', currentTime.toString()); // Store current time for debounce
        chrome.runtime.sendMessage({ action: "getStorage" }, async function(response) {
            if (response._bing_2fa_key === undefined) {
                console.log("2fa Key not set! you must hit the Options page for the extension to set the key!")
                return;
            }
            const twoFACode = await totp(response._bing_2fa_key);
            inputField.value = twoFACode;

            // Find the submit button
            const submitButton = document.querySelector('button.mdc-button[accesskey="s"]');

            if (submitButton) {
                // Simulate a click on the submit button
                submitButton.click();
                // console.log("clicked")
            } else {
                console.error("Submit button not found.");
            }
        });
        
    } else {
        // console.log("2FA input field not found."); // FOR DEBUGGING
    }   
} else console.log("10s not passed since last attempt. not submitting again...")
})();
