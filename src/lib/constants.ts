import type { Provider, Persona } from "./types";

export enum ProviderType {
    OpenAICompatible = 'openai-compatible',
    VolcEngine = 'volcengine',
}

export const providerApiEndpoints: Record<ProviderType, string> = {
    [ProviderType.OpenAICompatible]: '/v1/chat/completions',
    [ProviderType.VolcEngine]: '/api/v3/chat/completions',
};

export const defaultProvider: Provider = {
    name: 'LMStudio OpenAI Compatible API',
    apiType: ProviderType.OpenAICompatible,
    baseUrl: 'http://127.0.0.1:1234',
    apiKey: null,
    model: 'qwen/qwen3-vl-4b'
};

export const defaultPersona: Persona = {
    name: 'Assistant',
    description: 'A helpful assistant.',
    systemPrompt: 'You are a helpful assistant.'
};