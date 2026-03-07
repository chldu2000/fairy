import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
    const rawBody = await request.json();

    const url = rawBody.target;
    const body = {
        model: rawBody.model,
        messages: rawBody.messages,
        stream: rawBody.stream || false,
        temperature: rawBody.temperature || 0.7,
    };

    console.log("[Proxy] Forwarding request to:", url);
    console.log("[Proxy] Stream mode:", body.stream);

    try {
        // 只保留需要的 headers，排除 content-length、host 等
        const headers: Record<string, string> = {};
        const skipHeaders = [
            "content-length",
            "host",
            "connection",
            "transfer-encoding",
        ];

        request.headers.forEach((value, key) => {
            if (!skipHeaders.includes(key.toLowerCase())) {
                headers[key] = value;
            }
        });

        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw error(
                response.status,
                `Error from provider: ${response.statusText}`,
            );
        }

        // 如果是流式响应，直接转发
        if (body.stream) {
            console.log("[Proxy] Streaming response");
            return new Response(response.body, {
                status: response.status,
                headers: {
                    "Content-Type":
                        response.headers.get("Content-Type") || "text/event-stream",
                    "Cache-Control": "no-cache",
                    Connection: "keep-alive",
                },
            });
        } else {
            // 非流式响应，解析为 JSON
            const data = await response.json();
            return new Response(JSON.stringify(data), {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }
    } catch (err) {
        console.error("[Proxy] Error forwarding request:", err);
        throw error(500, "Internal Server Error");
    }
};
