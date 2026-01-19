import { SvelteMap } from "svelte/reactivity";
import type { ChatSession, Settings } from "./types";

async function openIDB(): Promise<IDBDatabase> {
    return new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open('fairy-db', 1);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains('settings')) {
                db.createObjectStore('settings', { keyPath: 'key' });
            }
            if (!db.objectStoreNames.contains('chatHistory')) {
                db.createObjectStore('chatHistory', { keyPath: 'id' });
            }
        };
        request.onsuccess = () => {
            resolve(request.result);
        };
        request.onerror = () => {
            reject(request.error);
        };
    });
}

async function idbGet(storeName: string, key: IDBValidKey): Promise<object> {
    const db = await openIDB();
    return new Promise<object>((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const request = transaction.objectStore(storeName).get(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function idbGetAll(storeName: string): Promise<object[]> {
    const db = await openIDB();
    return new Promise<object[]>((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const request = transaction.objectStore(storeName).getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function idbPut(storeName: string, value: object): Promise<void> {
    const db = await openIDB();
    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const request = transaction.objectStore(storeName).put(value);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

async function idbDelete(storeName: string, key: IDBValidKey): Promise<void> {
    const db = await openIDB();
    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const request = transaction.objectStore(storeName).delete(key);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export const settings = $state(
    {
        providers: {},
        personas: {},
        selectedProvider: '',
        selectedPersona: ''
    }
) as Settings;

const defaultSettings : Settings = {
    providers: {
        'OpenAI': {
            apiSource: 'openai-compatible',
            endpoint: 'https://api.openai.com',
            apiKey: null,
            model: 'gpt-4'
        },
        'Local Ollama': {
            apiSource: 'ollama',
            endpoint: 'http://localhost:11434',
            apiKey: null,
            model: 'llama2'
        },
        'Test': {
            apiSource: 'openai-compatible',
            endpoint: 'http://127.0.0.1:1234',
            apiKey: null,
            model: 'qwen/qwen3-vl-4b'
        }
    },
    personas: {
        'Default': {
            description: 'A helpful assistant.',
            systemPrompt: 'You are a helpful assistant.'
        }
    },
    selectedProvider: 'Test',
    selectedPersona: 'Default'
};

export async function loadClientSettings() {
    console.log('loadClientSettings');
    try {
        const record = await idbGet('settings', 'clientSettings') as { key: string, value: Settings };
        if (record && record.value) {
            const storedSettings = record.value;
            settings.providers = storedSettings.providers;
            settings.personas = storedSettings.personas;
            settings.selectedProvider = storedSettings.selectedProvider;
            settings.selectedPersona = storedSettings.selectedPersona;
        } else {
            settings.providers = defaultSettings.providers;
            settings.personas = defaultSettings.personas;
            settings.selectedProvider = defaultSettings.selectedProvider;
            settings.selectedPersona = defaultSettings.selectedPersona;
        }
    } catch (e) {
        console.error('Error loading settings from IndexedDB:', e);
    }
}

export async function saveClientSettings() {
    console.log('saveClientSettings');
    try {
        const snapshot = $state.snapshot(settings);
        await idbPut('settings', { key: 'clientSettings', value: snapshot });
    } catch (e) {
        console.error('Error saving settings to IndexedDB:', e);
    }
}

export const selectedChat = $state({
    id: -1,
    session: {} as ChatSession
}) as { id: number, session: ChatSession };

export const chatHistory = $state(new SvelteMap<number, ChatSession>()) as SvelteMap<number, ChatSession>;

export function deselectChatSession() {
    selectedChat.id = -1;
    selectedChat.session = {} as ChatSession;
}

export async function loadChatHistory() {
    console.log('loadChatHistory');
    try {
        const storedHistory = await idbGetAll('chatHistory') as ChatSession[];
        for (const session of storedHistory) {
            chatHistory.set(session.id, session);
        }
        // deselectChatSession();
    } catch (e) {
        console.error('Error loading chat history from IndexedDB:', e);
    }
}

export async function saveChatSession(session: ChatSession) {
    try {
        const snapshot = $state.snapshot(session);
        await idbPut('chatHistory', snapshot);
    } catch (e) {
        console.error('Error saving chat session to IndexedDB:', e);
    }
}

export function selectChatSession(id: number) {
    if (chatHistory.has(id)) {
        selectedChat.id = id;
        selectedChat.session = chatHistory.get(id) as ChatSession;
    }
}

export async function createChatSession(name: string): Promise<number> {
    try {
        const newId = chatHistory.size > 0 ? Math.max(...chatHistory.keys()) + 1 : 0;
        const newSession: ChatSession = {
            id: newId,
            name,
            messages: [{ role: 'system', content: settings.personas[settings.selectedPersona].systemPrompt }]
        };
        chatHistory.set(newId, newSession);
        await saveChatSession(newSession);
        selectChatSession(newId);
        return newId;
    } catch (e) {
        console.error('Error creating chat session:', e);
        return -1;
    }
}

export async function deleteChatSession(id: number) {
    try {
        chatHistory.delete(id);
        await idbDelete('chatHistory', id);
        if (selectedChat.id === id) {
            deselectChatSession();
        }
    } catch (e) {
        console.error('Error deleting chat session:', e);
    }
}
