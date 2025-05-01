function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

document.getElementById('cypherForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const mensagem = document.getElementById('mensagem').value;

    const textToEncrypt = JSON.stringify({ nome, email, mensagem });
    const encoder = new TextEncoder();
    const keyString = "12345678901234567890123456789012"; // 32 caracteres
    const iv = crypto.getRandomValues(new Uint8Array(16));

    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(keyString),
        { name: "AES-CBC" },
        false,
        ["encrypt"]
    );

    const encrypted = await crypto.subtle.encrypt(
        { name: "AES-CBC", iv },
        key,
        encoder.encode(textToEncrypt)
    );

    const payload = {
        data: arrayBufferToBase64(encrypted),
        iv: arrayBufferToBase64(iv)
    };

    const res = await fetch('backend.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const json = await res.json();
    document.getElementById('resposta').textContent = json.message;
});
