import { browser } from '$app/environment';

// 加密算法配置
const ALGORITHM = {
    name: 'AES-GCM',
    length: 256
};

// 密钥用途
const KEY_USAGES: KeyUsage[] = ['encrypt', 'decrypt'];

// 存储密钥的 key
const KEY_STORAGE_KEY = 'fairy-encryption-key';

/**
 * 生成加密密钥
 */
async function generateKey(): Promise<CryptoKey> {
    return crypto.subtle.generateKey(ALGORITHM, true, KEY_USAGES);
}

/**
 * 导出密钥为可存储格式
 */
async function exportKey(key: CryptoKey): Promise<string> {
    const exported = await crypto.subtle.exportKey('jwk', key);
    return JSON.stringify(exported);
}

/**
 * 导入密钥
 */
async function importKey(jwkStr: string): Promise<CryptoKey> {
    const jwk = JSON.parse(jwkStr);
    return crypto.subtle.importKey('jwk', jwk, ALGORITHM, true, KEY_USAGES);
}

/**
 * 获取或生成加密密钥
 */
export async function getEncryptionKey(): Promise<CryptoKey> {
    if (!browser) {
        throw new Error('Crypto operations only available in browser');
    }

    const keyStr = localStorage.getItem(KEY_STORAGE_KEY);

    if (keyStr) {
        try {
            return await importKey(keyStr);
        } catch (error) {
            console.error('Failed to import existing key, generating new one:', error);
            localStorage.removeItem(KEY_STORAGE_KEY);
        }
    }

    // 生成新密钥
    const newKey = await generateKey();
    const newKeyStr = await exportKey(newKey);
    localStorage.setItem(KEY_STORAGE_KEY, newKeyStr);

    return newKey;
}

/**
 * 加密字符串
 */
export async function encrypt(text: string): Promise<string> {
    const key = await getEncryptionKey();
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    // 生成随机初始化向量
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // 加密
    const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        data
    );

    // 组合 iv 和密文，然后编码为 base64
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);

    return btoa(String.fromCharCode(...combined));
}

/**
 * 解密字符串
 */
export async function decrypt(encryptedText: string): Promise<string> {
    const key = await getEncryptionKey();

    // 解码 base64
    const combined = new Uint8Array([...atob(encryptedText)].map(c => c.charCodeAt(0)));

    // 分离 iv 和密文
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);

    // 解密
    const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encrypted
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
}

/**
 * 检查字符串是否已加密
 */
export function isEncrypted(text: string | null): boolean {
    if (!text) return false;
    // 简单检查：加密后的数据是 base64 编码的，包含特定长度
    try {
        const decoded = atob(text);
        return decoded.length > 12; // iv 长度为 12 字节
    } catch {
        return false;
    }
}
