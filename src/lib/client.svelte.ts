import type { Settings } from "./types";

export const settings = $state(
    {
        providers: {},
        personas: {},
        selectedProvider: '',
        selectedPersona: ''
    }
) as Settings;

export const selectedChat = $state({
    id: -1
}) as { id: number };

const defaultSettings : Settings = {
    providers: {
        'Default OpenAI': {
            apiSource: 'openai-compatible',
            endpoint: 'https://api.openai.com/v1',
            apiKey: null,
        },
        'Local Ollama': {
            apiSource: 'ollama',
            endpoint: 'http://localhost:11434',
            apiKey: null,
        }
    },
    personas: {
        'Default': {
            description: 'You are a helpful assistant.',
            systemPrompt: 'You are a helpful assistant.'
        }
    },
    selectedProvider: 'Default OpenAI',
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
