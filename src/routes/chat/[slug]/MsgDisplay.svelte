<script lang="ts">
    import { selectedChat } from "$lib/store.svelte";

    // todo: filter out system prompts
    const messages = $derived(selectedChat.session?.messages || []);
</script>

<div>
    Here will be the message display area.
    <div>Messages count: {messages.length}</div>
    <div>Messages:</div>
    <div>
        {#each messages as message}
            <div>{message.role}: {message.content}</div>
        {/each}
    </div>
</div>
