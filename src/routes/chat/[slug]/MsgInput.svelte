<script lang="ts">
    import { sendMessage, sendMessage_Test } from "$lib/store.svelte";

    function handleSubmit(event: Event) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const input = form.querySelector('input[type="text"]') as HTMLInputElement;
        const message = input.value.trim();
        if (message) {
            sendMessage_Test(message);
            input.value = '';
        }
    }
</script>

<div>
    <form onsubmit={handleSubmit}>
        <input type="text" placeholder="Type your message here..." />
        <input type="submit" value="Submit" />
    </form>
    
</div>