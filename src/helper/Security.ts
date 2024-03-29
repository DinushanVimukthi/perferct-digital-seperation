import CryptoJS from "crypto-js"

const APP_SECRET_KEY = import.meta.env.VITE_APP_SECRET_KEY

const encryptText = (text: string) => {
    return CryptoJS.AES.encrypt(text, APP_SECRET_KEY as string).toString();
}

const decryptText = (text: string) => {

    return CryptoJS.AES.decrypt(text, APP_SECRET_KEY as string).toString(CryptoJS.enc.Utf8);
}

const compareText = (text: string, encryptedText: string) => {
    return text === decryptText(encryptedText);
}

export { encryptText, decryptText ,compareText}