<script lang="ts">
    import { page } from '$app/state';
    import ModelSwitch from './ModelSwitch.svelte';
    import MsgDisplay from './MsgDisplay.svelte';
    import MsgInput from './MsgInput.svelte';
    import { chatHistory, selectChatSession } from '$lib/store.svelte';
    import { goto } from '$app/navigation';
    import { resolve } from '$app/paths';

    let previousSlug: string | null = null;
    const slug = $derived(page.params.slug);
    const chat_name = $derived(chatHistory.get(Number(slug))?.name ?? '');

    $effect(() => {
        // prevents effect being triggered when current chat session changes
        if (slug && slug !== previousSlug) {
            previousSlug = slug;
            const sessionId = Number(slug);
            if (chatHistory.has(sessionId)) {
                console.log(`Selecting chat session: ${sessionId}`);
                selectChatSession(sessionId);
            } else {
                console.warn(
                    `Chat session not found: ${sessionId}, redirecting to home.`,
                );
                goto(resolve('/'));
            }
        }
    });
</script>

<div id="chat-layout">
    <div id="model-switch-area">
        <ModelSwitch />
    </div>
    <div id="chat-name">{chat_name}</div>

    <div id="split-line"></div>

    <div id="msg-display-area">
        <MsgDisplay />
    </div>
    <div id="msg-input-area">
        <MsgInput />
    </div>
</div>

<style>
    #chat-layout {
        display: flex;
        flex-direction: column;
        flex: 1;
        margin-left: 0.5rem;
        margin-right: 0.5rem;
    }

    #model-switch-area {
        display: flex;
        flex: 0 0 auto;
    }

    #chat-name {
        font-size: 1.5rem;
        font-weight: bold;
        margin: 0.4rem 1rem;
    }

    #split-line {
        border-top: 2px solid gray;
        margin: 0 1rem 0.2rem 1rem;
        box-shadow: 0 0.2rem 0.4rem #0f0f0f;
        position: relative;
        z-index: 10;
    }

    #msg-display-area {
        display: flex;
        flex: 1;
        /* flex-direction: column; */
        overflow-y: auto;
    }

    #msg-input-area {
        display: flex;
        flex: 0 0 auto;
        box-shadow: 0 -0.2rem 0.4rem #0f0f0f;
        position: relative;
        z-index: 10;
    }
</style>
