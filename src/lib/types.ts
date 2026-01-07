export type Provider = {
    apiSource: 'openai-compatible' | 'ollama';
    endpoint: string;
    apiKey: string | null;
}

export type Persona = {
    description: string;
    systemPrompt: string;
    icon?: string;
}

export type Settings = {
    providers: Record<string, Provider>;
    personas: Record<string, Persona>;
    selectedProvider: string;
    selectedPersona: string;
}

// export type Chat = {
// };
