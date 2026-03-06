export enum ProviderType {
  OpenAICompatible = "openai-compatible",
}

export type Provider = {
  name: string;
  apiType: ProviderType;
  baseUrl: string;
  endpoint: string;
  apiKey: string | null;
  model: string;
};

export type Persona = {
  name: string;
  description: string;
  systemPrompt: string;
  icon?: string;
};

export type Preferences = {
  provider: string;
  persona: string;
};

export type Settings = {
  providers: Record<string, Provider>;
  personas: Record<string, Persona>;
  selectedProvider: string;
  selectedPersona: string;
};

export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
  // timestamp: string;
};

export type ChatSession = {
  id: number;
  name: string;
  messages: Message[];
};
