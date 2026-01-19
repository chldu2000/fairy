import { settings, selectedChat, saveChatSession } from './store.svelte';

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
        saveChatSession(selectedChat.session);
    }
}