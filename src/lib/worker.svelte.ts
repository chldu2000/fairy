import { browser } from '$app/environment';
import { ProviderType } from './types';
import { providerApiEndpoints } from './constants';
import {
    providers,
    preferences,
    selectedChat,
    saveChatSession,
    personas,
} from './store.svelte';

// TODO: rename to OpenAI worker/adapter/client, add other provider workers as needed
export async function sendMessage(message: string) {
    if (!browser) return;

    const currentSession = selectedChat.session;
    if (currentSession) {
        if (currentSession.messages.length === 0) {
            // 如果是新会话，添加系统提示
            const systemPrompt = 
                personas.get(preferences.persona)?.systemPrompt || '';
            currentSession.messages.push({
                role: 'system',
                content: systemPrompt,
            });
            // 使用用户消息的前 20 个字符作为会话名称
            currentSession.name = message.slice(0, 20);
        }
        // 添加用户消息
        currentSession.messages.push({ role: 'user', content: message });

        // 添加空的助手消息，用于实时更新
        const assistantMessageIndex = currentSession.messages.length;
        currentSession.messages.push({ role: 'assistant', content: '' });

        const url = '/api'; // use local API proxy
        const provider = providers.get(preferences.provider);
        const targetBaseUrl = provider?.baseUrl || '';
        const targetEndpoint =
            provider?.endpoint ||
            providerApiEndpoints[provider?.apiType || ProviderType.OpenAICompatible]
                .endpoint;
        const body = {
            target: `${targetBaseUrl}${targetEndpoint}`,
            model: provider?.model,
            messages: currentSession.messages,
            temperature: 0.7,
            stream: true, // 使用流式传输
        };

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (provider?.apiKey) {
            headers['Authorization'] = `Bearer ${provider.apiKey}`;
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: headers,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // 处理流式响应
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });

                    // 解析 SSE 格式的响应
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || ''; // 保留不完整的最后一行

                    for (const line of lines) {
                        const trimmed = line.trim();
                        if (trimmed.startsWith('data:')) {
                            const dataStr = trimmed.slice(5).trim();
                            if (dataStr === '[DONE]') {
                                // 流式传输结束
                                await saveChatSession(currentSession);
                                return;
                            }

                            try {
                                const data = JSON.parse(dataStr);
                                if (data.choices && data.choices.length > 0) {
                                    const delta = data.choices[0].delta;
                                    if (delta.content) {
                                        // 实时更新助手消息内容
                                        currentSession.messages[
                                            assistantMessageIndex
                                        ].content += delta.content;
                                    }
                                }
                            } catch (e) {
                                console.error('Error parsing streaming data:', e);
                            }
                        }
                    }
                }

                // 保存完整会话
                await saveChatSession(currentSession);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            // 处理错误，可能需要显示错误消息给用户
            currentSession.messages[assistantMessageIndex].content =
                `Error: ${(error as Error).message}`;
        }
    }
}
