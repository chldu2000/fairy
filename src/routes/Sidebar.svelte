<script lang="ts">
    import { chatList, selectedChatId, createChat } from "$lib/mocked-data";
    import { goto } from "$app/navigation";

    function jumpTo(target: number) {
        if (target === -1) {
            // window.location.href = resolve('/settings');
            selectedChatId.set(null);
            goto('/settings');
        } else if (target >= 0) {
            // selectedChatId.set(target);
            const newChat = createChat("New Chat");
            console.log("Selected chat:", $selectedChatId);
            goto(`/chat/${newChat}`);
        } else {
            console.error("Invalid target for onclick:", target);
        }
    }
</script>

<div class="sidebar">
    <button onclick={ () => jumpTo(0) }>
        New Chat
    </button>
    <div class="chat-list">
        {#each $chatList as chat}
            <a href={`/chat/${chat.id}`} class="chat-item {$selectedChatId === chat.id ? 'selected' : ''}">
                {chat.name}
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
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .chat-item.selected, .chat-item:hover {
        background-color: yellow;
        color: black;
        /* border: yellow 0.25rem solid; */
    }

    .button-group-h-centered {
        display: flex;
        flex-direction: row;
        justify-content: center;
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