import { SvelteMap } from "svelte/reactivity";
import {
    type Provider,
    type ChatSession,
    type Persona,
    type Preferences,
} from "./types";
import { defaultProvider, defaultPersona } from "./constants";
import { encrypt, decrypt, isEncrypted } from "./crypto.svelte";

const DB_VERSION = 3; // 升级数据库版本，支持加密功能

async function openIDB(): Promise<IDBDatabase> {
    return new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open("fairy-db", DB_VERSION);
        request.onupgradeneeded = (event) => {
            const db = request.result;
            const oldVersion = event.oldVersion;

            // if (!db.objectStoreNames.contains('settings')) { // 分开存储 provider 和 persona
            //     db.createObjectStore('settings', { keyPath: 'key' });
            // }
            if (!db.objectStoreNames.contains("providers")) {
                db.createObjectStore("providers", { keyPath: "name" });
            }
            if (!db.objectStoreNames.contains("personas")) {
                db.createObjectStore("personas", { keyPath: "name" });
            }
            if (!db.objectStoreNames.contains("preferences")) {
                db.createObjectStore("preferences", { keyPath: "key" });
            }
            if (!db.objectStoreNames.contains("chatHistory")) {
                db.createObjectStore("chatHistory", { keyPath: "id" });
            }

            if (oldVersion < 3) {
                // 版本 3 增加加密支持，但不需要修改 object store 结构
                console.log('Database upgraded to version 3 (encryption support)');
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
        const transaction = db.transaction(storeName, "readonly");
        const request = transaction.objectStore(storeName).get(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function idbGetAll(storeName: string): Promise<object[]> {
    const db = await openIDB();
    return new Promise<object[]>((resolve, reject) => {
        const transaction = db.transaction(storeName, "readonly");
        const request = transaction.objectStore(storeName).getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function idbPut(storeName: string, value: object): Promise<void> {
    const db = await openIDB();
    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(storeName, "readwrite");
        const request = transaction.objectStore(storeName).put(value);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

async function idbDelete(storeName: string, key: IDBValidKey): Promise<void> {
    const db = await openIDB();
    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(storeName, "readwrite");
        const request = transaction.objectStore(storeName).delete(key);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export const providers = $state(new SvelteMap<string, Provider>()) as SvelteMap<
    string,
    Provider
>;
export const personas = $state(new SvelteMap<string, Persona>()) as SvelteMap<
    string,
    Persona
>;
export const preferences = $state({
    provider: "",
    persona: "",
}) as Preferences;

export async function loadPreferences() {
    console.log("loadPreferences");
    try {
        const storedProviders = (await idbGetAll("providers")) as Provider[];
        if (storedProviders.length > 0) {
            for (const provider of storedProviders) {
                // 解密 API key（如果已加密）
                if (provider.apiKey && !isEncrypted(provider.apiKey)) {
                    // 旧数据（明文），需要加密后重新存储
                    console.log(`Migrating API key for provider: ${provider.name}`);
                    const encryptedKey = await encrypt(provider.apiKey);
                    const updatedProvider = { ...provider, apiKey: encryptedKey };
                    await idbPut("providers", updatedProvider);
                    // 内存中的版本保持明文以便使用
                    providers.set(provider.name, provider);
                } else if (provider.apiKey && isEncrypted(provider.apiKey)) {
                    // 已加密的数据，解密后存储在内存中
                    try {
                        const decryptedKey = await decrypt(provider.apiKey);
                        providers.set(provider.name, { ...provider, apiKey: decryptedKey });
                    } catch (error) {
                        console.error(`Failed to decrypt API key for provider ${provider.name}:`, error);
                        providers.set(provider.name, { ...provider, apiKey: null });
                    }
                } else {
                    // 没有 API key 的 provider
                    providers.set(provider.name, provider);
                }
            }
        } else {
            providers.set(defaultProvider.name, defaultProvider);
            await saveProvider(defaultProvider);
        }

        const storedPersonas = (await idbGetAll("personas")) as Persona[];
        if (storedPersonas.length > 0) {
            for (const persona of storedPersonas) {
                personas.set(persona.name, persona);
            }
        } else {
            personas.set(defaultPersona.name, defaultPersona);
            await savePersona(defaultPersona);
        }

        const storedProviderSelection = (await idbGet(
            "preferences",
            "provider",
        )) as { key: string; value: string };
        if (storedProviderSelection) {
            preferences.provider = storedProviderSelection.value;
        } else {
            preferences.provider = defaultProvider.name;
            await savePreference("provider", defaultProvider.name);
        }

        const storedPersonaSelection = (await idbGet("preferences", "persona")) as {
            key: string;
            value: string;
        };
        if (storedPersonaSelection) {
            preferences.persona = storedPersonaSelection.value;
        } else {
            preferences.persona = defaultPersona.name;
            await savePreference("persona", defaultPersona.name);
        }
    } catch (error) {
        console.error("Error loading data from IndexedDB:", error);
    }
}

export async function saveProvider(provider: Provider) {
    console.log("saveProvider", provider.name);
    try {
        // 加密 API key（如果是明文）
        const providerToSave = { ...provider };
        if (providerToSave.apiKey && !isEncrypted(providerToSave.apiKey)) {
            providerToSave.apiKey = await encrypt(providerToSave.apiKey);
        }

        const providerSnapshot = $state.snapshot(providerToSave);
        await idbPut("providers", providerSnapshot);

        // 内存中的版本保持明文以便使用
        providers.set(provider.name, provider);
    } catch (e) {
        console.error("Error saving provider to IndexedDB:", e);
    }
}

export async function savePersona(persona: Persona) {
    console.log("savePersona", persona.name);
    try {
        const personaSnapshot = $state.snapshot(persona);
        await idbPut("personas", personaSnapshot);
        personas.set(persona.name, personaSnapshot);
    } catch (e) {
        console.error("Error saving persona to IndexedDB:", e);
    }
}

export async function deletePersona(name: string) {
    console.log("deletePersona", name);
    try {
        await idbDelete("personas", name);
        personas.delete(name);

        // 如果删除的是当前选中的 persona，需要更新 preferences
        if (preferences.persona === name) {
            const remainingPersonas = Array.from(personas.keys());
            if (remainingPersonas.length > 0) {
                await savePreference("persona", remainingPersonas[0]);
            }
        }
    } catch (e) {
        console.error("Error deleting persona from IndexedDB:", e);
    }
}

export async function savePreference(key: string, value: string) {
    console.log("savePreference", key, value);
    if (key !== "provider" && key !== "persona") {
        console.error("Invalid preference key:", key);
        return;
    } else if (key === "provider" && !providers.has(value)) {
        console.error(
            "Trying to set provider preference to non-existent provider:",
            value,
        );
        return;
    } else if (key === "persona" && !personas.has(value)) {
        console.error(
            "Trying to set persona preference to non-existent persona:",
            value,
        );
        return;
    }

    try {
        await idbPut("preferences", { key, value });
        preferences[key] = value;
    } catch (e) {
        console.error("Error saving preference to IndexedDB:", e);
    }
}

export async function deleteProvider(name: string) {
    console.log("deleteProvider", name);
    try {
        await idbDelete("providers", name);
        providers.delete(name);

        // 如果删除的是当前选中的 provider，需要更新 preferences
        if (preferences.provider === name) {
            const remainingProviders = Array.from(providers.keys());
            if (remainingProviders.length > 0) {
                await savePreference("provider", remainingProviders[0]);
            }
        }
    } catch (e) {
        console.error("Error deleting provider from IndexedDB:", e);
    }
}

export const selectedChat = $state({
    id: -1,
    session: {} as ChatSession,
}) as { id: number; session: ChatSession };

export const chatHistory = $state(
    new SvelteMap<number, ChatSession>(),
) as SvelteMap<number, ChatSession>;

export function deselectChatSession() {
    selectedChat.id = -1;
    selectedChat.session = {} as ChatSession;
}

export async function loadChatHistory() {
    console.log("loadChatHistory");
    try {
        const storedHistory = (await idbGetAll("chatHistory")) as ChatSession[];
        for (const session of storedHistory) {
            chatHistory.set(session.id, session);
        }
        // deselectChatSession();
    } catch (e) {
        console.error("Error loading chat history from IndexedDB:", e);
    }
}

export async function saveChatSession(session: ChatSession) {
    try {
        const snapshot = $state.snapshot(session);
        await idbPut("chatHistory", snapshot);
        // 更新 chatHistory 中的会话数据，确保切换会话时能看到最新消息
        chatHistory.set(session.id, snapshot);
    } catch (e) {
        console.error("Error saving chat session to IndexedDB:", e);
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
        const newId =
            chatHistory.size > 0 ? Math.max(...chatHistory.keys()) + 1 : 0;
        // const systemPrompt = personas.get(preferences.persona)?.systemPrompt || defaultPersona.systemPrompt;

        const newSession: ChatSession = {
            id: newId,
            name,
            messages: [],
        };
        chatHistory.set(newId, newSession);
        await saveChatSession(newSession);
        selectChatSession(newId);
        return newId;
    } catch (e) {
        console.error("Error creating chat session:", e);
        return -1;
    }
}

export async function deleteChatSession(id: number) {
    try {
        chatHistory.delete(id);
        await idbDelete("chatHistory", id);
        if (selectedChat.id === id) {
            deselectChatSession();
        }
    } catch (e) {
        console.error("Error deleting chat session:", e);
    }
}
