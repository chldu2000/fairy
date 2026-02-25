<script lang="ts">
    import { sendMessage } from "$lib/worker.svelte";
    
    function handleSubmit(event: Event) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const input = form.querySelector('input[type="text"]') as HTMLInputElement;
        const message = input.value.trim();
        if (!message) return;

        try {
            sendMessage(message);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }
</script>

<div id="input-layout">
    <form onsubmit={handleSubmit}>
        <input id="message-input" type="text" placeholder="Type your message here..." />
        <input id="submit-button" type="submit" value="Submit" />
    </form>
</div>

<style>
    #input-layout {
        display: flex;
        flex: 1;
        flex-direction: row;
    }

    /* #message-input {
        flex: 1;
    }

    #submit-button {
        flex: 0 0 auto;
    } */
</style>