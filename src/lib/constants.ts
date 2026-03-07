import type { Provider, Persona } from "./types";
import { ProviderType } from "./types";

export const providerApiEndpoints: Record<
    ProviderType,
    { baseUrl: string; endpoint: string }
> = {
    [ProviderType.OpenAICompatible]: {
        baseUrl: "https://api.openai.com",
        endpoint: "/v1/chat/completions",
    },
};

export const defaultProvider: Provider = {
    name: "LMStudio OpenAI Compatible API",
    apiType: ProviderType.OpenAICompatible,
    baseUrl: "http://127.0.0.1:1234",
    endpoint: providerApiEndpoints[ProviderType.OpenAICompatible].endpoint,
    apiKey: null,
    model: "qwen/qwen3-vl-4b",
};

export const defaultPersona: Persona = {
    name: "Assistant",
    description: "A helpful assistant.",
    systemPrompt: "You are a helpful assistant.",
};
