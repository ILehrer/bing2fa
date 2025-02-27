document.addEventListener('DOMContentLoaded', function() {
    const secretInput = document.getElementById('secretInput');
    const saveButton = document.getElementById('saveButton');
    const message = document.getElementById('message');
    const existingSecretMessage = document.getElementById('existingSecretMessage');

    async function storeSecret(secret) {
        await chrome.storage.local.set({ "_bing_2fa_key": secret });
    }

    async function loadExistingSecret() {
        const result = await chrome.storage.local.get("_bing_2fa_key");
        if (result._bing_2fa_key) {
            existingSecretMessage.style.display = "block";
        }
    }

    loadExistingSecret();

    saveButton.addEventListener('click', async function() {
        message.textContent = "";
        const secret = secretInput.value;
        await storeSecret(secret);
        message.textContent = "Secret saved. Please be aware of the security risks.";
        existingSecretMessage.style.display = "block";
    });
});
