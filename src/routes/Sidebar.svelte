<script lang="ts">
    import { chatList, selectedChatId } from "$lib/mocked-data";
    import { goto } from "$app/navigation";

    function onclick(target: number) {
        if (target === -1) {
            // window.location.href = resolve('/settings');
            selectedChatId.set(null);
            goto('/settings');
        } else if (target >= 0) {
            // selectedChatId.set(target);
            console.log("Selected chat:", $selectedChatId);
            goto(`/chat/${target}`);
        } else {
            console.error("Invalid target for onclick:", target);
        }
    }
</script>

<div class="sidebar">
    <button onclick={ () => onclick(0) }>
        New Chat
    </button>
    <div class="chat-list">
        {#each chatList as chat}
            <a href={`/chat/${chat.id}`} class="chat-item {$selectedChatId === chat.id ? 'selected' : ''}">
                {chat.name}
            </a>
        {/each}
    </div>
    <button onclick={ () => onclick(-1) }>Settings</button>
</div>

<style>
    .sidebar {
        background-color: #2f2f2f;
        width: 20rem;
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
        height: 2rem;
        border-radius: 1rem;
        padding: 0 1rem;
        margin: 0.5rem;

        text-decoration: none;
        text-align: left;
        line-height: 2rem; /* line height = element height -> vertically center text */
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .chat-item.selected {
        background-color: yellow;
        color: black;
        /* border: yellow 0.25rem solid; */
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

    button:hover {
        animation: breath-scale 0.5s infinite alternate;
        color: black;
    }

    button:active {
        color: white;
    }

    @keyframes breath-scale {
        from {
            background-color: yellow;
            border: yellow 0.25rem solid;
            transform: scale(1);
        }
        to {
            background-color: #9bbe00;
            border: #9bbe00 0.25rem solid;
            transform: scale(1.05);
        }
    }
</style>