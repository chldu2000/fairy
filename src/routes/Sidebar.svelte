<script lang="ts">
    import { chatHistory, selectedChat, selectChat, createChat, deleteChat } from "$lib/mocked-data.svelte";
    import { goto } from "$app/navigation";
    import { scale } from "svelte/transition";

    function jumpTo(target: number) {
        if (target === -1) {
            // window.location.href = resolve('/settings');
            selectChat(-1);
            goto('/settings');
        } else if (target >= 0) {
            // selectedChatId.set(target);
            const newChat = createChat('New Chat');
            console.log(`Selected chat: ${selectedChat.id}`);
            goto(`/chat/${newChat}`);
        } else {
            console.error('Invalid target for onclick:', target);
        }
    }

    function handleDeleteChat(event: Event, id: number) {
        event.preventDefault();
        event.stopPropagation();

        console.log(`Deleting chat: ${id}`);
        deleteChat(id);
        if (selectedChat.id === id) {
            selectChat(-1);
            goto('/');
        }
    }
</script>

<div class="sidebar">
    <button onclick={ () => jumpTo(0) }>
        New Chat
    </button>
    <div class="chat-list">
        {#each [...chatHistory.sessions].reverse() as chat (chat.id)}
            <a href={`/chat/${chat.id}`} class="chat-item {selectedChat.id === chat.id ? "selected" : ""}" transition:scale>
                <span class="chat-name">{chat.name}</span>
                <button class="icon-button" onclick={ (e) => handleDeleteChat(e, chat.id) }>✕</button>
            </a>
        {/each}
    </div>
    
    <div class="button-group-h-centered">
        <button class="round">+</button>
        <button class="round" onclick={ () => jumpTo(-1) }>⚙</button>
    </div>
    
</div>

<style>
    .sidebar {
        background-color: #2f2f2f;
        width: 20rem;
        height: 100vh;
        display: flex;
        flex-direction: column;
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

    .chat-item.selected,
    .chat-item:hover {
        background-color: yellow;
        color: black;
        /* border: yellow 0.25rem solid; */
    }

    .chat-item.selected .icon-button,
    .chat-item:hover .icon-button {
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

    .icon-button {
        background: transparent;
        border: none;
        color: inherit;
        font-size: 1.5rem;
        cursor: pointer;
        width: 1.5rem;
        height: 1.5rem;
        display: none; /* hide by default */
        align-items: center;
        justify-content: center;
        padding: 0;
        margin: 0;
    }

    button {
        background-color: black;
        color: white;
        /* width: calc(100% - 1rem); */
        height: 2.5rem;
        border-radius: 1.25rem;
        border: grey 0.25rem solid;
        padding: 0 1rem; /* vertical horizontal; rem means relative to font size */
        margin: 0.5rem;
    }

    button.round {
        width: 2.5rem;
        padding: 0 0 ;
    }

    button:hover {
        animation: breath-scale 1s infinite alternate;
        color: black;
    }

    button:active {
        color: white;
    }

    @keyframes breath-scale {
        0% {
            background-color: yellow;
            border: yellow 0.25rem solid;
            transform: scale(1);
        }
        50% {
            transform: scale(1.02);
        }
        100% {
            background-color: #9bbe00;
            border: #9bbe00 0.25rem solid;
            transform: scale(1);
        }
    }
</style>