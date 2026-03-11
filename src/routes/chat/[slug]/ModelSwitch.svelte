<script lang="ts">
    import {
        preferences,
        savePreference,
        providers,
        personas,
    } from '$lib/store.svelte';

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
        <span class="select-label">Provider:</span>
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
        <span class="select-label">Persona:</span>
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
        /*background-color: black;*/
        color: white;
        display: flex;
        flex: 1;
        flex-direction: row;
        margin-top: 0.5rem;
        height: fit-content;
        /*border: grey 3px solid;*/
        /*border-radius: 1.25rem;*/
        align-items: center;
    }

    #provider-select,
    #persona-select {
        margin: 0 1rem;
    }

    select {
        background-color: black;
        color: white;
        border-radius: 1.25rem;
        border: grey 3px solid;
        /*width: 16rem;*/
        max-width: max-content;
        height: 2.5rem;
        padding-left: 1.5rem;
        padding-right: 1.5rem;
        text-align: left;
        cursor: pointer;
    }

    select:hover {
        border-color: #9bbe00;
    }

    select:focus {
        outline: none;
        border-color: #9bbe00;
        /*box-shadow: 0 0 0 2px rgba(155, 190, 0, 0.3);*/
    }
</style>
