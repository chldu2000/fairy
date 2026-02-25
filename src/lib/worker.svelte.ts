import { browser } from '$app/environment';
import { providers, preferences, selectedChat, saveChatSession } from './store.svelte';

export async function sendMessage(message: string) {
    if (selectedChat.session) {
        selectedChat.session.messages.push({ role: 'user', content: message });
        const response = 'This is a mocked response';
        selectedChat.session.messages.push({ role: 'assistant', content: response });
    }
}

export async function sendMessage_Test(message: string) {
    // Warning: Avoid calling `fetch` eagerly during server-side rendering — put your `fetch` calls inside `onMount` or a `load` function instead
    if (!browser) return;

    if (selectedChat.session) {
        selectedChat.session.messages.push({ role: 'user', content: message });
        const url = '/api'; // use local API proxy
        const body = {
            target: `${providers.get(preferences.provider)?.endpoint}/v1/chat/completions`,
            model: providers.get(preferences.provider)?.model,
            messages: selectedChat.session.messages,
            temperature: 0.7,
            stream: false,
        }
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        }
        if (providers.get(preferences.provider)?.apiKey) {
            headers['Authorization'] = `Bearer ${providers.get(preferences.provider)?.apiKey}`;
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