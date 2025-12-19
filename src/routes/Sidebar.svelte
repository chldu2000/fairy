<script lang="ts">
    import { chatList } from "$lib/mocked-data";
    import { goto } from "$app/navigation";

    function onclick(target: number) {
        if (target === -1) {
            // window.location.href = resolve('/settings');
            goto('/settings');
        } else if (target >= 0) {
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
            <div class="chat-item">{chat.name}</div>
        {/each}
    </div>
    <button onclick={ () => onclick(-1) }>Settings</button>
</div>

<style>
    .sidebar {
        background-color: #2f2f2f;
        display: flex;
        flex-direction: column;
    }

    .chat-item {
        list-style: none;
        background-color: grey;
        color: white;
        height: 1.8rem;
        border-radius: 0.9rem;
        margin: 0.5rem;
        text-align: center;
    }

    button {
        background-color: black;
        color: white;
        width: calc(100% - 1rem);
        height: 2.5rem;
        border-radius: 1.25rem;
        border: grey 0.25rem solid;
        padding: 0 1rem; /* vertical horizontal; rem means relative to font size */
        margin: 0.5rem;
    }

    button:hover {
        animation: breath 1s infinite alternate;
        color: black;
    }

    button:active {
        color: white;
    }

    @keyframes breath {
        from {
            background-color: yellow;
            border: yellow 0.25rem solid;
        }
        to {
            background-color: #9bbe00;
            border: #9bbe00 0.25rem solid;
        }
    }
</style>