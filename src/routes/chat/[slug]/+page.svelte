<script lang="ts">
    import { page } from "$app/state";
    import { selectChat } from "$lib/mocked-data.svelte";
    import ModelSwitch from "./ModelSwitch.svelte";

    const slug = $derived(page.params.slug);

    $effect(() => {
        selectChat(Number(slug));
    });
</script>

<div class="chat-container">
    <ModelSwitch />

    <div>chat slug : {slug}</div>
</div>

<style>
    .chat-container {
        display: flex;
        flex-direction: column;
        flex: 1;
    }
</style>