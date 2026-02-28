<script lang="ts">
    import { selectedChat } from "$lib/store.svelte";
    import { marked } from "marked";

    // filter out system messages
    const messages = $derived(
        Array.from(selectedChat.session?.messages || []).filter(message => message.role !== 'system')
    )

    // is assistant currently 'typing'
    const isTyping = $derived(() => {
        return messages.length > 0 &&
               messages[messages.length - 1].role === 'assistant' &&
               messages[messages.length - 1].content === '';
    });
</script>

<div id="msg-display-layout">
    <!-- Here will be the message display area. -->
    <!-- <div>Messages count: {messages.length}</div> -->
    <!-- <div>Messages:</div> -->
    <div id="messages-container">
        {#each messages as message, index}
            <div class={`message ${message.role}`}>
                <span class="role">{message.role}:</span>
                <span class="content">{@html marked(message.content)}</span>
            </div>
        {/each}
        {#if isTyping()}
            <div class="message assistant typing">
                <span class="role">assistant:</span>
                <span class="content">
                    <span class="typing-indicator">✍️ 正在输入...</span>
                </span>
            </div>
        {/if}
    </div>
</div>

<style>
    #msg-display-layout {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    #messages-container {
        flex: 1;
        overflow-y: auto;
        padding: 8px;
        min-height: 0; /* 确保flex子元素可以收缩 */
    }

    .message {
        margin-bottom: 8px;
        padding: 4px;
        border-radius: 4px;
    }

    .message.user {
        background-color: black;
    }

    .message.assistant {
        background-color: black;
    }

    .role {
        font-weight: bold;
        margin-right: 8px;
    }

    .content {
        white-space: pre-wrap;
    }

    .typing {
        color: #888;
        font-style: italic;
    }

    .typing-indicator {
        animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 1; }
    }
</style>
