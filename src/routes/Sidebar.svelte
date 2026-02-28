<script lang="ts">
    import { goto } from "$app/navigation";
    import { scale } from "svelte/transition";
    import KKButton from "$lib/widgets/KKButton.svelte";
    import { chatHistory, selectedChat, createChatSession, deleteChatSession } from "$lib/store.svelte";

    const chatListItems = $derived(
        Array.from(chatHistory.entries())
            .map(([id, session]) => ({
                id,
                name: session.name
            }))
            .reverse()
    );

    async function jumpTo(target: number) {
        if (target === -1) {
            // window.location.href = resolve('/settings');
            // selectChat(-1);
            goto('/settings');
        } else if (target >= 0) {
            // selectedChatId.set(target);
            const newChatId = await createChatSession('Unnamed Chat');
            console.log(`Created chat: ${newChatId}`);
            goto(`/chat/${newChatId}`);
        } else {
            console.error('Invalid target for onclick:', target);
        }
    }

    function handleDeleteChat(event: Event, id: number) {
        event.preventDefault();
        event.stopPropagation();

        console.log(`Deleting chat: ${id}`);
        deleteChatSession(id);
    }
</script>

<div class="sidebar">
    <KKButton onclick={ () => jumpTo(0) }>
        New Chat
    </KKButton>
    <div class="chat-list">
        {#each chatListItems as chat (chat.id)}
            <a href={`/chat/${chat.id}`} class="chat-item {selectedChat.id === chat.id ? "selected" : ""}" transition:scale>
                <span class="chat-name">{chat.name}</span>
                <KKButton preset="plain" class="auto-hide" onclick={ (e) => handleDeleteChat(e, chat.id) }>✕</KKButton>
            </a>
        {/each}
    </div>
    
    <div class="button-group-h-centered">
        <KKButton preset="round">+</KKButton>
        <KKButton preset="round" onclick={ () => jumpTo(-1) }>⚙</KKButton>
    </div>

</div>

<style>
    @import '$lib/style/animation.css';

    .sidebar {
        width: 20rem;
        /* height: 100vh; */
        display: flex;
        flex-direction: column;
        /* border-right: 3px solid gray; */
        /* margin: 4px; */
        /* padding: 4px; */
        /* border-radius: 1rem; */
    }

    .chat-list {
        flex: 1; /* take up all available space */
        display: flex;
        flex-direction: column;
        overflow-y: auto; /* enable vertical scrolling if content overflows */
    }

    .chat-item {
        background-color: grey;
        color: white;

        /* width: 15rem; */
        min-height: 2rem;
        border-radius: 1rem;
        padding: 0 1rem;
        margin: 0.5rem;
        flex-shrink: 0;;

        text-decoration: none;
        text-align: left;
        line-height: 2rem; /* line height = element height -> vertically center text */
        /* white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis; */

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .chat-item :global(.auto-hide) {
        display: none; /* hide icon buttons if parent is not selected */
    }

    .chat-item.selected,
    .chat-item:hover {
        /* background-color: yellow; */
        color: black;
        /* border: yellow 0.25rem solid; */
        animation: breath 2s infinite alternate;
    }

    .chat-item.selected :global(.auto-hide),
    .chat-item:hover :global(.auto-hide) {
        display: flex; /* show icon buttons if parent is selected */
    }

    .chat-name {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .button-group-h-centered {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
</style>