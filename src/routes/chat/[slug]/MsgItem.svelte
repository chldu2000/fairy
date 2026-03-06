<script lang='ts'>
    import type { Message } from '$lib/types';
    import { marked } from 'marked';

    export let message: Message;
</script>

<div class={`message-wrapper ${message.role}`}>
    {#if message.role === 'assistant'}
        <div class="avatar assistant-avatar">🧿</div>
    {/if}
    <div class={`message-bubble ${message.role} ${message.content.trim().length > 0 ? 'has-content' : 'no-content'}`}>
        <div class="message-content">{@html marked(message.content)}</div>
    </div>
    {#if message.role === 'user'}
        <div class="avatar user-avatar">👤</div>
    {/if}
</div>

<style>
    .message-wrapper.user {
        padding-right: 12px;
    }

    .message-wrapper.assistant {
        padding-left: 12px;
    }

    .message-wrapper {
        display: flex;
        align-items: flex-start;
        margin-bottom: 12px;
        max-width: 100%;
    }

    .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        margin: 0 8px;
        border: 2px solid #e0e0e0;
        background-color: white;
        flex-shrink: 0;
    }

    .assistant-avatar {
        border-color: #e0e0e0;
    }

    .user-avatar {
        border-color: rgb(28, 85, 227);
    }

    .message-wrapper.assistant {
        justify-content: flex-start;
    }

    .message-wrapper.user {
        justify-content: flex-end;
        margin-left: auto;
    }

    .message-bubble {
        max-width: 80%;
        padding: 12px 16px;
        border-radius: 18px;
        position: relative;
        word-wrap: break-word;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .message-bubble.assistant {
        background-color: white;
        color: #333;
    }

    .message-bubble.assistant.has-content::before {
        content: '';
        position: absolute;
        left: -8px;
        top: 16px;
        width: 0;
        height: 0;
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
        border-right: 8px solid white;
    }

    .message-bubble.user {
        background-color: rgb(28, 85, 227);
        color: white;
    }

    .message-bubble.user.has-content::before {
        content: '';
        position: absolute;
        right: -8px;
        top: 16px;
        width: 0;
        height: 0;
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
        border-left: 8px solid rgb(28, 85, 227);
    }

    /* 没有内容时的气泡样式调整 */
    .message-bubble.no-content {
        padding: 0;
        min-height: 0;
        max-height: 0;
        box-shadow: none;
    }

    .message-bubble.no-content .message-content {
        display: none;
    }

    .message-content {
        line-height: 1.4;
    }

    /*
     * Markdown 内容样式优化
     * :global() https://svelte.dev/docs/svelte/@html
     */
    .message-content :global(p) {
        margin: 0 0 8px 0;
    }

    .message-content :global(p:last-child) {
        margin-bottom: 0;
    }

    .message-content :global(a) {
        color: inherit;
        text-decoration: underline;
    }

    .message-content :global(code) {
        background-color: rgba(0, 0, 0, 0.1);
        padding: 2px 4px;
        border-radius: 3px;
        font-size: 0.9em;
    }

    .message-content :global(pre) {
        background-color: rgba(0, 0, 0, 0.1);
        padding: 8px;
        border-radius: 6px;
        overflow-x: auto;
        margin: 8px 0;
    }

    .message-content :global(pre code) {
        background-color: transparent;
        padding: 0;
    }

    /* 响应式设计 */
    @media (max-width: 768px) {
        .message-bubble {
            max-width: 90%;
        }
    }
</style>
