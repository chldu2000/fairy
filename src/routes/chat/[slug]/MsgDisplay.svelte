<script lang="ts">
    import { selectedChat } from "$lib/store.svelte";
    import MsgItem from "./MsgItem.svelte";

    // filter out system messages
    const messages = $derived(
        Array.from(selectedChat.session?.messages || []).filter(message => message.role !== 'system')
    )

    // waiting for assistant response
    const isWaiting = $derived(() => {
        return messages.length > 0 &&
               messages[messages.length - 1].role === 'assistant' &&
               messages[messages.length - 1].content === '';
    });

    let messagesContainer: HTMLDivElement;
    let lastMessageContent = '';
    let lastMessageCount = 0;

    // 监听 messages 变化，滚动到最下面
    $effect(() => {
        console.log(messages.length, lastMessageCount)

        const shouldScroll = () => {
            if (messages.length === 0 || !messagesContainer) {
                lastMessageCount = 0;
                lastMessageContent = '';
                return false;
            }

            const lastMessage = messages[messages.length - 1];
            const hasMessageCountChanged = messages.length !== lastMessageCount;
            const hasLastMessageContentChanged = lastMessage && lastMessage.content !== lastMessageContent;

            return hasMessageCountChanged || hasLastMessageContentChanged;
        };

        if (shouldScroll()) {
            lastMessageCount = messages.length;
            lastMessageContent = messages[messages.length - 1]?.content ?? '';

            requestAnimationFrame(() => {
                if (messagesContainer) {
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }
            });
        }
    });
</script>

<div id="msg-display-layout">
    <!-- Here will be the message display area. -->
    <div id="messages-container" bind:this={messagesContainer}>
        {#each messages as message, index (index)}
            <MsgItem {message} />
        {/each}
        {#if isWaiting()}
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
        flex: 1;
        flex-direction: column;
    }

    #messages-container {
        flex: 1;
        overflow-y: auto;
        padding: 8px;
        min-height: 0; /* 确保flex子元素可以收缩 */
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
