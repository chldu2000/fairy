import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    const rawBody = await request.json();

    const url = rawBody.target;
    const body = {
        model: rawBody.model,
        messages: rawBody.messages,
        stream: rawBody.stream || false,
        temperature: rawBody.temperature || 0.7
    };

    console.log('[Proxy] Forwarding request to:', url);

    try {
        // 只保留需要的 headers，排除 content-length、host 等
        const headers: Record<string, string> = {};
        const skipHeaders = ['content-length', 'host', 'connection', 'transfer-encoding'];
        
        request.headers.forEach((value, key) => {
            if (!skipHeaders.includes(key.toLowerCase())) {
                headers[key] = value;
            }
        });

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            throw error(response.status, `Error from provider: ${response.statusText}`);
        }
        const data = await response.json();
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch(err){
        console.error('Error in proxy handler:', err);
        throw error(500, 'Internal Server Error');
    }
    
};