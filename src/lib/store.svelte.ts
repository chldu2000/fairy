import { SvelteMap } from "svelte/reactivity";
import type { ChatSession, Settings } from "./types";

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

export function initClientSettings() {
    console.log('initClientSettings');
    // load settings from localStorage
    const storedSettings = localStorage.getItem('clientSettings');
    if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        settings.providers = parsedSettings.providers;
        settings.personas = parsedSettings.personas;
        settings.selectedProvider = parsedSettings.selectedProvider;
        settings.selectedPersona = parsedSettings.selectedPersona;
    } else {
        // load default settings
        settings.providers = defaultSettings.providers;
        settings.personas = defaultSettings.personas;
        settings.selectedProvider = defaultSettings.selectedProvider;
        settings.selectedPersona = defaultSettings.selectedPersona;
    }
}

export function saveClientSettings() {
    console.log('saveClientSettings');
    // save settings to localStorage
    localStorage.setItem('clientSettings', JSON.stringify(settings));
}

export const selectedChat = $state({
    id: -1,
    session: {} as ChatSession
}) as { id: number, session: ChatSession };

export const chatHistory = $state(new SvelteMap<number, ChatSession>()) as Map<number, ChatSession>;

export function loadChatHistory() {
    console.log('loadChatHistory');
    const storedHistory = localStorage.getItem('chatHistory');
    if (storedHistory) {
        const parsedHistory: Record<number, ChatSession> = JSON.parse(storedHistory);
        for (const [id, session] of Object.entries(parsedHistory)) {
            chatHistory.set(Number(id), session);
        }
    }
    selectedChat.id = -1;
    selectedChat.session = {} as ChatSession;
}

export function saveChatHistory() {
    console.log('saveChatHistory');
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

export function selectChatSession(id: number) {
    if (chatHistory.has(id)) {
        selectedChat.id = id;
        selectedChat.session = chatHistory.get(id) as ChatSession;
    }
}

export function createChatSession(name: string): number {
    const newId = chatHistory.size > 0 ? Math.max(...chatHistory.keys()) + 1 : 0;
    const newSession: ChatSession = {
        id: newId,
        name,
        messages: [{ role: 'system', content: settings.personas[settings.selectedPersona].systemPrompt }]
    };
    chatHistory.set(newId, newSession);
    saveChatHistory();
    return newId;
}

export function deleteChatSession(id: number) {
    chatHistory.delete(id);
    saveChatHistory();
}

export function sendMessage(message: string) {
    if (selectedChat.session) {
        selectedChat.session.messages.push({ role: 'user', content: message });
        const response = 'This is a mocked response';
        selectedChat.session.messages.push({ role: 'assistant', content: response });
    }
}

export async function sendMessage_Test(message: string) {
    if (selectedChat.session) {
        selectedChat.session.messages.push({ role: 'user', content: message });
        const url = '/api'; // use local API proxy
        const body = {
            target: `${settings.providers[settings.selectedProvider].endpoint}/v1/chat/completions`,
            model: settings.providers[settings.selectedProvider].model,
            messages: selectedChat.session.messages,
            temperature: 0.7,
            stream: false,
        }
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        }
        if (settings.providers[settings.selectedProvider].apiKey) {
            headers['Authorization'] = `Bearer ${settings.providers[settings.selectedProvider].apiKey}`;
        }
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: headers
        });
        const data = await response.json();
        const assistantRole = data.choices[0].message.role;
        const assistantMessage = data.choices[0].message.content;
        selectedChat.session.messages.push({ role: assistantRole, content: assistantMessage });
        saveChatHistory();
    }
}
