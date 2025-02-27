document.addEventListener('DOMContentLoaded', function() {
    const secretInput = document.getElementById('secretInput');
    const saveButton = document.getElementById('saveButton');
    const message = document.getElementById('message');
  
    async function storeSecret(secret) {
      await chrome.storage.local.set({ "_bing_2fa_key": secret });
    }
  
    saveButton.addEventListener('click', async function() {
      message.textContent = "";
      const secret = secretInput.value;
      await storeSecret(secret);
      message.textContent = "Secret saved. Please be aware of the security risks.";
    });
  });