function base32decode(secret) {
    const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let bits = "";
    let decoded = [];
  
    for (let i = 0; i < secret.length; i++) {
      const val = base32chars.indexOf(secret.charAt(i).toUpperCase());
      if (val === -1) continue; // Ignore invalid characters
      bits += val.toString(2).padStart(5, "0");
    }
  
    for (let i = 0; i + 8 <= bits.length; i += 8) {
      decoded.push(parseInt(bits.substr(i, 8), 2));
    }
  
    return new Uint8Array(decoded);
  }

async function hmacSha1(key, data) {
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      key,
      { name: "HMAC", hash: { name: "SHA-1" } },
      false,
      ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", cryptoKey, data);
    return new Uint8Array(signature);
  }

async function totp(secret) {
    const decodedSecret = base32decode(secret);
    const time = Math.floor(Date.now() / 30000); // 30-second interval
    const timeBytes = new ArrayBuffer(8);
    const dataView = new DataView(timeBytes);
    dataView.setUint32(4, time, false); // Big-endian
  
    const hmacResult = await hmacSha1(decodedSecret, new Uint8Array(timeBytes));
    const offset = hmacResult[19] & 0x0F;
    const binary =
      ((hmacResult[offset] & 0x7F) << 24) |
      ((hmacResult[offset + 1] & 0xFF) << 16) |
      ((hmacResult[offset + 2] & 0xFF) << 8) |
      (hmacResult[offset + 3] & 0xFF);
    const otp = binary % 1000000;
    return otp.toString().padStart(6, "0");
}
