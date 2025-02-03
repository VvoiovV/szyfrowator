// Funkcja sprawdzająca, czy znak należy do polskiego alfabetu
function isPolishLetter(char) {
    return /[a-ząćęłńóśźż]/i.test(char);
}

// Funkcja szyfru Cezara z obsługą polskich znaków
function caesarCipher(text, shift, decrypt = false) {
    if (decrypt) shift = -shift;

    const polishAlphabet = 'aąbcćdeęfghijklłmnńoópqrsśtuvwxyzźż';
    const alphabetLength = polishAlphabet.length;

    return text.split('').map(char => {
        const isUpper = char === char.toUpperCase();
        const lowerChar = char.toLowerCase();

        if (isPolishLetter(lowerChar)) {
            const index = polishAlphabet.indexOf(lowerChar);
            const newIndex = (index + shift + alphabetLength) % alphabetLength;
            const newChar = polishAlphabet[newIndex];
            return isUpper ? newChar.toUpperCase() : newChar;
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

// Szyfr Polibiusza z polskimi literami
const polibiusTable = {
    A: '11', Ą: '12', B: '13', C: '14', Ć: '15', D: '21',
    E: '22', Ę: '23', F: '24', G: '25', H: '31', I: '32',
    J: '32', K: '33', L: '34', Ł: '35', M: '41', N: '42',
    Ń: '43', O: '44', Ó: '45', P: '51', Q: '52', R: '53',
    S: '54', Ś: '55', T: '61', U: '62', W: '63', X: '64',
    Y: '65', Z: '71', Ź: '72', Ż: '73'
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
    const polishAlphabet = 'aąbcćdeęfghijklłmnńoópqrsśtuvwxyzźż';
    const alphabetLength = polishAlphabet.length;
    key = key.toLowerCase();
    let keyIndex = 0;

    return text.split('').map(char => {
        const isUpper = char === char.toUpperCase();
        const lowerChar = char.toLowerCase();

        if (isPolishLetter(lowerChar)) {
            const charIndex = polishAlphabet.indexOf(lowerChar);
            const shift = polishAlphabet.indexOf(key[keyIndex % key.length]);
            const newIndex = (charIndex + (decrypt ? -shift : shift) + alphabetLength) % alphabetLength;
            keyIndex++;
            const newChar = polishAlphabet[newIndex];
            return isUpper ? newChar.toUpperCase() : newChar;
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

// RSA (bez zmian)
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

// Funkcja do potęgowania modulo dla RSA
function modularExponentiation(base, exponent, modulus) {
    let result = 1;
    base = base % modulus;
    while (exponent > 0) {
        if (exponent % 2 === 1) {
            result = (result * base) % modulus;
        }
        exponent = Math.floor(exponent / 2);
        base = (base * base) % modulus;
    }
    return result;
}


// Funkcja pomocnicza: Sprawdzanie, czy liczba jest pierwsza
function isPrime(num) {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}

// Funkcja pomocnicza: Obliczanie największego wspólnego dzielnika (GCD)
function gcd(a, b) {
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}

// Funkcja pomocnicza: Obliczanie odwrotności modularnej
function modularInverse(e, phi) {
    let [m0, x0, x1] = [phi, 0, 1];
    while (e > 1) {
        const q = Math.floor(e / phi);
        [e, phi] = [phi, e % phi];
        [x0, x1] = [x1 - q * x0, x0];
    }
    return x1 < 0 ? x1 + m0 : x1;
}

// Generator kluczy RSA
function generateRSAKeys() {
    // Wygeneruj dwie małe liczby pierwsze (dla uproszczenia)
    let p, q;
    do {
        p = Math.floor(Math.random() * 50) + 50; // Liczby pierwsze między 50 a 100
    } while (!isPrime(p));
    do {
        q = Math.floor(Math.random() * 50) + 50;
    } while (!isPrime(q) || q === p);

    // Oblicz n i phi
    const n = p * q;
    const phi = (p - 1) * (q - 1);

    // Wybierz e
    let e = 3;
    while (gcd(e, phi) !== 1) {
        e += 2; // Szukaj kolejnej nieparzystej liczby
    }

    // Oblicz d
    const d = modularInverse(e, phi);

    // Zwróć klucze
    return {
        publicKey: [e, n],
        privateKey: [d, n]
    };
}

// Wyświetlenie kluczy w konsoli (możesz podłączyć to do interfejsu strony)
const rsaKeys = generateRSAKeys();
console.log("Public Key:", rsaKeys.publicKey);
console.log("Private Key:", rsaKeys.privateKey);

function generateAndDisplayKeys() {
    const rsaKeys = generateRSAKeys();
    document.getElementById("publicKey").textContent = `(${rsaKeys.publicKey[0]}, ${rsaKeys.publicKey[1]})`;
    document.getElementById("privateKey").textContent = `(${rsaKeys.privateKey[0]}, ${rsaKeys.privateKey[1]})`;
}

