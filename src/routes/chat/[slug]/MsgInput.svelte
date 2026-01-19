<script lang="ts">
    // import { sendMessage, sendMessage_Test } from "$lib/store.svelte";
    async function handleSubmit(event: Event) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const input = form.querySelector('input[type="text"]') as HTMLInputElement;
        const message = input.value.trim();
        if (!message) return;

        // 动态加载 sendMessage，避免 SSR 阶段 eager fetch 警告
        const worker = await import('$lib/worker.svelte');
        await worker.sendMessage_Test(message);
        // TODO: handle errors, clear input on component mount, etc.
        input.value = '';
    }
</script>

<div>
    <form onsubmit={handleSubmit}>
        <input type="text" placeholder="Type your message here..." />
        <input type="submit" value="Submit" />
    </form>
</div>