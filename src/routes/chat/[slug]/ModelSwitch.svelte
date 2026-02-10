<script lang="ts">
    import { settings, saveClientSettings } from "$lib/store.svelte";

    function handleModelChange(event: Event, level: 'provider' | 'persona') {
        const selectElement = event.target as HTMLOptionElement;
        // console.log(`Changing ${level} to: ${selectElement.value}`);
        if (level === 'provider') {
            settings.selectedProvider = selectElement.value;
        } else {
            settings.selectedPersona = selectElement.value;
        }
        saveClientSettings();
        console.log(`Selected ${level} changed to: ${settings.selectedProvider}`);
    }
</script>

<div class="model-switch">
    <div class="provider-select">
        <span>Provider:</span>
        <select
            bind:value={settings.selectedProvider}
            onchange={(e) => handleModelChange(e, 'provider')}
        >
            {#each Object.keys(settings.providers) as model}
                <option value={model}>{model}</option>
            {/each}
        </select>
    </div>
    <div class="persona-select">
        <span>Persona:</span>
        <select
            bind:value={settings.selectedPersona}
            onchange={(e) => handleModelChange(e, 'persona')}
        >
            {#each Object.keys(settings.personas) as persona}
                <option value={persona}>{persona}</option>
            {/each}
        </select>
    </div>
</div>

<style>
    .model-switch {
        background-color: #f0f0f0;
        color: black;
        display: flex;
        flex: 1;
        flex-direction: row;
    }

    .provider-select, .persona-select {
        margin: 0 1rem;
    }
</style>