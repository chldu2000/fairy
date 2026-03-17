<script lang="ts">
    import { selectedChat } from '$lib/store.svelte';
    import MsgItem from './MsgItem.svelte';

    // filter out system messages
    const messages = $derived(
        Array.from(selectedChat.session?.messages || []).filter(
            (message) => message.role !== 'system',
        ),
    );

    // Derived state for last message
    const lastMessage = $derived(messages.length > 0 ? messages[messages.length - 1] : null);
    const lastMessageContent = $derived(lastMessage?.content ?? '');
    const lastMessageRole = $derived(lastMessage?.role ?? '');

    // waiting for assistant response (initial state with empty content)
    const isWaiting = $derived(() => {
        return (
            lastMessageRole === 'assistant' && lastMessageContent === ''
        );
    });

    // Track message changes for both typing indicator and scrolling
    let isTyping = $state(false);
    let typingTimeout: ReturnType<typeof setTimeout> | null = null;
    let previousContent = '';
    let previousCount = 0;

    // Detect message changes and handle both typing indicator and scrolling
    let messagesContainer: HTMLDivElement;

    $effect(() => {
        const currentCount = messages.length;
        const currentContent = lastMessageContent;
        const hasCountChanged = currentCount !== previousCount;
        const hasContentChanged = currentContent !== previousContent;

        // Handle typing indicator
        if (currentCount > 0 && lastMessageRole === 'assistant' && currentContent !== '') {
            if (hasContentChanged) {
                isTyping = true;

                // Reset typing timeout
                if (typingTimeout) {
                    clearTimeout(typingTimeout);
                }
                typingTimeout = setTimeout(() => {
                    isTyping = false;
                }, 1000);
            }
        } else if (lastMessageRole === 'user') {
            isTyping = false;
            if (typingTimeout) {
                clearTimeout(typingTimeout);
                typingTimeout = null;
            }
        }

        // Handle scrolling
        if ((hasCountChanged || hasContentChanged) && messagesContainer) {
            requestAnimationFrame(() => {
                if (messagesContainer) {
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }
            });
        }

        // Update tracking variables
        previousCount = currentCount;
        previousContent = currentContent;
    });

    // Cleanup timeout on unmount
    $effect(() => {
        return () => {
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
        };
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
    {#if isTyping}
        <div class="loading-indicator">
            <span class="ellipsis">
                <span>.</span>
                <span>.</span>
                <span>.</span>
            </span>
        </div>
    {/if}
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
        0%,
        100% {
            opacity: 0.5;
        }
        50% {
            opacity: 1;
        }
    }

    /* 跑马灯样式的加载指示器 */
    .loading-indicator {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 8px;
        background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.05));
        border-top: 1px solid rgba(0, 0, 0, 0.1);
    }

    .ellipsis {
        display: flex;
        align-items: center;
        gap: 2px;
        font-size: 24px;
        color: #666;
    }

    .ellipsis span {
        animation: ellipsis 1.5s infinite;
    }

    .ellipsis span:nth-child(1) {
        animation-delay: 0s;
    }

    .ellipsis span:nth-child(2) {
        animation-delay: 0.3s;
    }

    .ellipsis span:nth-child(3) {
        animation-delay: 0.6s;
    }

    @keyframes ellipsis {
        0%, 100% {
            opacity: 0.3;
            transform: translateY(0);
        }
        50% {
            opacity: 1;
            transform: translateY(-3px);
        }
    }
</style>
