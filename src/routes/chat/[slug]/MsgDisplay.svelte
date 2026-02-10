<script lang="ts">
    import { selectedChat } from "$lib/store.svelte";
    import { marked } from "marked";

    // todo: filter out system prompts
    const messages = $derived(selectedChat.session?.messages || []);
</script>

<div id="msg-display-layout">
    Here will be the message display area.
    <div>Messages count: {messages.length}</div>
    <div>Messages:</div>
    <div>
        {#each messages as message}
            <div>{message.role}: {@html marked(message.content)}</div>
        {/each}
    </div>
</div>

<style>
</style>
