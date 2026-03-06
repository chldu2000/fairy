<script lang="ts">
    import { preferences, savePreference, providers, personas } from "$lib/store.svelte";

    function handleModelChange(event: Event, level: 'provider' | 'persona') {
        const selectElement = event.target as HTMLOptionElement;
        // console.log(`Changing ${level} to: ${selectElement.value}`);
        if (level === 'provider') {
            preferences.provider = selectElement.value;
            savePreference('provider', selectElement.value);
        } else {
            preferences.persona = selectElement.value;
            savePreference('persona', selectElement.value);
        }
        console.log(`Selected ${level} changed to: ${preferences[level]}`);
    }
</script>

<div id="model-switch">
    <div id="provider-select">
        <span>Provider:</span>
        <select
            bind:value={preferences.provider}
            onchange={(e) => handleModelChange(e, 'provider')}
        >
            {#each Array.from(providers.keys()) as key (key)}
                <option value={key}>{key}</option>
            {/each}
        </select>
    </div>
    <div id="persona-select">
        <span>Persona:</span>
        <select
            bind:value={preferences.persona}
            onchange={(e) => handleModelChange(e, 'persona')}
        >
            {#each Array.from(personas.keys()) as key (key)}
                <option value={key}>{key}</option>
            {/each}
        </select>
    </div>
</div>

<style>
    #model-switch {
        background-color: #f0f0f0;
        color: black;
        display: flex;
        flex: 1;
        flex-direction: row;
    }

    #provider-select, #persona-select {
        margin: 0 1rem;
    }
</style>