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

<div class="chat-container">
    <ModelSwitch />

    <div>chat slug : {slug}</div>
    <MsgDisplay />
    <MsgInput />
</div>

<style>
    .chat-container {
        display: flex;
        flex-direction: column;
        flex: 1;

        background-color: white;
    }
</style>