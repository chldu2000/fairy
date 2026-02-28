import { SvelteMap } from "svelte/reactivity";
import { type Provider, type ChatSession, type Persona, type Preferences } from "./types";
import { defaultProvider, defaultPersona } from "./constants";

const DB_VERSION = 2; // TODO: bump this when DB schema changes

async function openIDB(): Promise<IDBDatabase> {
    return new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open('fairy-db', DB_VERSION);
        request.onupgradeneeded = () => {
            const db = request.result;
            // if (!db.objectStoreNames.contains('settings')) { // 分开存储 provider 和 persona
            //     db.createObjectStore('settings', { keyPath: 'key' });
            // }
            if (!db.objectStoreNames.contains('providers')) {
                db.createObjectStore('providers', { keyPath: 'name' });
            }
            if (!db.objectStoreNames.contains('personas')) {
                db.createObjectStore('personas', { keyPath: 'name' });
            }
            if (!db.objectStoreNames.contains('preferences')) {
                db.createObjectStore('preferences', { keyPath: 'key' });
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

export const providers = $state(new SvelteMap<string, Provider>()) as SvelteMap<string, Provider>;
export const personas = $state(new SvelteMap<string, Persona>()) as SvelteMap<string, Persona>;
export const preferences = $state({
    provider: '',
    persona: '',
}) as Preferences;

export async function loadPreferences() {
    console.log('loadPreferences')
    try {
        const storedProviders = await idbGetAll('providers') as Provider[];
        if (storedProviders.length > 0) {
            for (const provider of storedProviders) {
                providers.set(provider.name, provider);
            }
        } else {
            providers.set(defaultProvider.name, defaultProvider);
            await saveProvider(defaultProvider);
        }

        const storedPersonas = await idbGetAll('personas') as Persona[];
        if (storedPersonas.length > 0) {
            for (const persona of storedPersonas) {
                personas.set(persona.name, persona);
            }
        } else {
            personas.set(defaultPersona.name, defaultPersona);
            await savePersona(defaultPersona);
        }

        const storedProviderSelection = await idbGet('preferences', 'provider') as { key: string, value: string };
        if (storedProviderSelection) {
            preferences.provider = storedProviderSelection.value;
        } else {
            preferences.provider = defaultProvider.name;
            await savePreference('provider', defaultProvider.name);
        }

        const storedPersonaSelection = await idbGet('preferences', 'persona') as { key: string, value: string };
        if (storedPersonaSelection) {
            preferences.persona = storedPersonaSelection.value;
        } else {
            preferences.persona = defaultPersona.name;
            await savePreference('persona', defaultPersona.name);
        }
    } catch (error) {
        console.error('Error loading data from IndexedDB:', error);
    }
}

export async function saveProvider(provider: Provider) {
    console.log('saveProvider', provider.name);
    try {
        await idbPut('providers', provider);
        providers.set(provider.name, provider);
    } catch (e) {
        console.error('Error saving provider to IndexedDB:', e);
    }
}

export async function savePersona(persona: Persona) {
    console.log('savePersona', persona.name);
    try {
        await idbPut('personas', persona);
        personas.set(persona.name, persona);
    } catch (e) {
        console.error('Error saving persona to IndexedDB:', e);
    }
}

export async function savePreference(key: string, value: string) {
    console.log('savePreference', key, value);
    if (key !== 'provider' && key !== 'persona') {
        console.error('Invalid preference key:', key);
        return;
    } else if (key === 'provider' && !providers.has(value)) {
        console.error('Trying to set provider preference to non-existent provider:', value);
        return;
    } else if (key === 'persona' && !personas.has(value)) {
        console.error('Trying to set persona preference to non-existent persona:', value);
        return;
    }

    try {
        await idbPut('preferences', { key, value });
        preferences[key] = value;
    } catch (e) {
        console.error('Error saving preference to IndexedDB:', e);
    }
}

export const selectedChat = $state({
    id: -1,
    session: {} as ChatSession
}) as { id: number, session: ChatSession };

export const chatHistory = $state(new SvelteMap<number, ChatSession>) as SvelteMap<number, ChatSession>;

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
        // 更新 chatHistory 中的会话数据，确保切换会话时能看到最新消息
        chatHistory.set(session.id, snapshot);
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
        const systemPrompt = personas.get(preferences.persona)?.systemPrompt || defaultPersona.systemPrompt;
        
        const newSession: ChatSession = {
            id: newId,
            name,
            messages: [{ role: 'system', content: systemPrompt }]
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
