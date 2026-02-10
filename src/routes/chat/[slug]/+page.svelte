<script lang="ts">
    import { page } from "$app/state";
    // import { selectChat } from "$lib/mocked-data.svelte";
    import ModelSwitch from "./ModelSwitch.svelte";
    import MsgDisplay from "./MsgDisplay.svelte";
    import MsgInput from "./MsgInput.svelte";
    import { chatHistory, deselectChatSession, selectChatSession } from "$lib/store.svelte";
    import { goto } from "$app/navigation";

    const slug = $derived(page.params.slug);

    $effect(() => {
        const sessionId = Number(slug);
        // console.log(`Slug: ${slug}`)
        if (chatHistory.has(sessionId)) {
            console.log(`Selecting chat session: ${sessionId}`);
            selectChatSession(sessionId);
        } else {
            console.warn(`Chat session not found: ${sessionId}, redirecting to home.`);
            goto('/');
        }
    });
</script>

<div id="chat-layout">
    <div id="model-switch-area">
        <ModelSwitch />
    </div>
    

    <div>chat slug : {slug}</div>
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
        margin: 0.75rem;
    }

    #model-switch-area {
        display: flex;
        flex : 0 0 auto;
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
    }
</style>