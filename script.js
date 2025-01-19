// Szyfr Cezara
function caesarCipher(text, shift, decrypt = false) {
    if (decrypt) shift = -shift;
    return text.split('').map(char => {
        if (/[a-z]/.test(char)) {
            const code = char.charCodeAt(0);
            return String.fromCharCode(((code - 97 + shift + 26) % 26) + 97);
        } else if (/[A-Z]/.test(char)) {
            const code = char.charCodeAt(0);
            return String.fromCharCode(((code - 65 + shift + 26) % 26) + 65);
        } else {
            return char;
        }
    }).join('');
}

function encryptCaesar() {
    const text = document.getElementById('caesarInput').value;
    const shift = parseInt(document.getElementById('caesarShift').value);
    document.getElementById('caesarOutput').value = caesarCipher(text, shift);
}

function decryptCaesar() {
    const text = document.getElementById('caesarInput').value;
    const shift = parseInt(document.getElementById('caesarShift').value);
    document.getElementById('caesarOutput').value = caesarCipher(text, shift, true);
}

// Szyfr Polibiusza
const polibiusTable = {
    A: '11', B: '12', C: '13', D: '14', E: '15',
    F: '21', G: '22', H: '23', I: '24', J: '24', K: '25',
    L: '31', M: '32', N: '33', O: '34', P: '35',
    Q: '41', R: '42', S: '43', T: '44', U: '45',
    V: '51', W: '52', X: '53', Y: '54', Z: '55'
};
const polibiusReverse = Object.fromEntries(Object.entries(polibiusTable).map(([k, v]) => [v, k]));

function encryptPolibius() {
    const text = document.getElementById('polibiusInput').value.toUpperCase();
    document.getElementById('polibiusOutput').value = text.split('').map(char => polibiusTable[char] || char).join(' ');
}

function decryptPolibius() {
    const text = document.getElementById('polibiusInput').value.split(' ');
    document.getElementById('polibiusOutput').value = text.map(code => polibiusReverse[code] || code).join('');
}

// Szyfr Vigenère'a
function vigenereCipher(text, key, decrypt = false) {
    key = key.toUpperCase();
    let keyIndex = 0;
    return text.split('').map(char => {
        if (/[a-zA-Z]/.test(char)) {
            const isUpper = char === char.toUpperCase();
            const base = isUpper ? 65 : 97;
            const shift = key.charCodeAt(keyIndex % key.length) - 65;
            keyIndex++;
            return String.fromCharCode(((char.charCodeAt(0) - base + (decrypt ? -shift : shift) + 26) % 26) + base);
        } else {
            return char;
        }
    }).join('');
}

function encryptVigenere() {
    const text = document.getElementById('vigenereInput').value;
    const key = document.getElementById('vigenereKey').value;
    document.getElementById('vigenereOutput').value = vigenereCipher(text, key);
}

function decryptVigenere() {
    const text = document.getElementById('vigenereInput').value;
    const key = document.getElementById('vigenereKey').value;
    document.getElementById('vigenereOutput').value = vigenereCipher(text, key, true);
}

// Szyfr RSA
// Funkcja do potęgowania modulo (dla dużych liczb)
function modularExponentiation(base, exponent, modulus) {
    let result = 1;
    base = base % modulus;
    while (exponent > 0) {
        if (exponent % 2 === 1) { // Jeśli wykładnik jest nieparzysty
            result = (result * base) % modulus;
        }
        exponent = Math.floor(exponent / 2); // Dzielenie wykładnika przez 2
        base = (base * base) % modulus;
    }
    return result;
}

// Szyfrowanie RSA
function encryptRSA() {
    const text = document.getElementById('rsaInput').value;
    const [e, n] = document.getElementById('rsaPublicKey').value.split(',').map(Number);

    if (isNaN(e) || isNaN(n)) {
        alert("Podaj poprawny klucz publiczny w formacie e,n");
        return;
    }

    const encrypted = text.split('').map(char => {
        const charCode = char.charCodeAt(0);
        return modularExponentiation(charCode, e, n);
    });

    document.getElementById('rsaOutput').value = encrypted.join(' ');
}

// Deszyfrowanie RSA
function decryptRSA() {
    const text = document.getElementById('rsaInput').value.split(' ').map(Number);
    const [d, n] = document.getElementById('rsaPrivateKey').value.split(',').map(Number);

    if (isNaN(d) || isNaN(n)) {
        alert("Podaj poprawny klucz prywatny w formacie d,n");
        return;
    }

    const decrypted = text.map(code => {
        const charCode = modularExponentiation(code, d, n);
        return String.fromCharCode(charCode);
    });

    document.getElementById('rsaOutput').value = decrypted.join('');
}
