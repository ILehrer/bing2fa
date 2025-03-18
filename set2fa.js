const elemObserver = (selector, callback) => {
  const observer = new MutationObserver((mutations) => {
    const element = document.querySelector(selector);
    if (element) {
      observer.disconnect();
      callback(element);
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
};

elemObserver("#verify_totp", async (elem) => {
	// Verify OTP modal form exists
	
	// Prompt user for whether he wants the extension to use this 2fa key
	const conf = confirm("would you like bing2fa to autofill 2fa using this key?");
	if (!conf) return;

	// Find the 2fa key
	const keyElem = elem.querySelector(".otpkey");
	const otpKey = keyElem.textContent;

	// Save this key to storage
	chrome.runtime.sendMessage({action: "setStorage", key: otpKey}, async function(_resp) {
		// Input the code into the confirmation box
		const codeInputElem = elem.querySelector("#code");
		const code = await totp(otpKey);
		codeInputElem.textContent = code;

		// We could auto-confirm here, but it's likely a bad idea
		// in case the user wants to save this to their authenticator as well
	});
	
});
