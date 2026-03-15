<script lang="ts">
    import {
        preferences,
        savePreference,
        providers,
        personas,
    } from '$lib/store.svelte';

    let providerDropdownOpen = false;
    let personaDropdownOpen = false;

    function handleProviderChange(value: string) {
        preferences.provider = value;
        savePreference('provider', value);
        providerDropdownOpen = false;
        console.log(`Selected provider changed to: ${preferences.provider}`);
    }

    function handlePersonaChange(value: string) {
        preferences.persona = value;
        savePreference('persona', value);
        personaDropdownOpen = false;
        console.log(`Selected persona changed to: ${preferences.persona}`);
    }

    // 点击外部关闭下拉菜单
    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest('#provider-select')) {
            providerDropdownOpen = false;
        }
        if (!target.closest('#persona-select')) {
            personaDropdownOpen = false;
        }
    }

    // 只在浏览器环境中监听点击事件
    if (typeof window !== 'undefined') {
        window.addEventListener('click', handleClickOutside);
    }
</script>

<div id="model-switch">
    <div id="provider-select" class="dropdown-container">
        <span class="select-label">Provider:</span>
        <div class="dropdown">
            <button
                class="dropdown-button"
                on:click={() => providerDropdownOpen = !providerDropdownOpen}
                aria-haspopup="true"
                aria-expanded={providerDropdownOpen}
            >
                <span class="button-text">{preferences.provider}</span>
                <span class="arrow" class:rotated={providerDropdownOpen}>&#9660;</span>
            </button>
            {#if providerDropdownOpen}
                <ul class="dropdown-list" role="listbox">
                    {#each Array.from(providers.keys()) as key (key)}
                        <li
                            class="dropdown-item {key === preferences.provider ? 'selected' : ''}"
                            role="option"
                            aria-selected={key === preferences.provider}
                            on:click={() => handleProviderChange(key)}
                            on:keydown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleProviderChange(key);
                                }
                            }}
                            tabIndex="0"
                        >
                            {key}
                        </li>
                    {/each}
                </ul>
            {/if}
        </div>
    </div>
    <div id="persona-select" class="dropdown-container">
        <span class="select-label">Persona:</span>
        <div class="dropdown">
            <button
                class="dropdown-button"
                on:click={() => personaDropdownOpen = !personaDropdownOpen}
                aria-haspopup="true"
                aria-expanded={personaDropdownOpen}
            >
                <span class="button-text">{preferences.persona}</span>
                <span class="arrow" class:rotated={personaDropdownOpen}>&#9660;</span>
            </button>
            {#if personaDropdownOpen}
                <ul class="dropdown-list" role="listbox">
                    {#each Array.from(personas.keys()) as key (key)}
                        <li
                            class="dropdown-item {key === preferences.persona ? 'selected' : ''}"
                            role="option"
                            aria-selected={key === preferences.persona}
                            on:click={() => handlePersonaChange(key)}
                            on:keydown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handlePersonaChange(key);
                                }
                            }}
                            tabIndex="0"
                        >
                            {key}
                        </li>
                    {/each}
                </ul>
            {/if}
        </div>
    </div>
</div>

<style>
    @import '$lib/style/animation.css';

    #model-switch {
        color: white;
        display: flex;
        flex: 1;
        flex-direction: row;
        margin-top: 0.5rem;
        height: fit-content;
        align-items: center;
    }

    .dropdown-container {
        margin: 0 1rem;
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .select-label {
        margin-right: 0.5rem;
    }

    .dropdown-button {
        background-color: black;
        color: white;
        border-radius: 1.25rem;
        border: grey 3px solid;
        height: 2.5rem;
        padding-left: 1.25rem;
        padding-right: 0.75rem;
        /* text-align: left; */
        cursor: pointer;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        display: inline-flex;
        align-items: center;
        min-width: 10rem;
        justify-content: space-between;
        /* gap: 0.75rem; */
    }

    .button-text {
        flex: 1;
        text-align: left;
    }

    .arrow {
        font-size: 0.75em;
        transition: transform 0.2s ease;
        /* line-height: 1; */
    }

    .arrow.rotated {
        transform: rotate(180deg);
    }

    .dropdown-button:hover {
        color: black;
        animation: breath 2s infinite alternate;
    }

    .dropdown-button:focus {
        outline: 2px solid #9bbe00;
        outline-offset: 2px;
    }

    .dropdown-list {
        position: absolute;
        top: calc(100% + 0.5rem);
        /* left: 0; */
        background-color: #2f2f2f;
        border: #2f2f2f 3px solid;
        border-radius: 1.25rem;
        list-style: none;
        padding: 0;
        margin: 0;
        min-width: 10rem;
        z-index: 1000;
    }

    .dropdown-item {
        padding: 0.75rem 1.5rem;
        cursor: pointer;
        white-space: nowrap;
        border-radius: 1.25rem;
    }

    .dropdown-item.selected,
    .dropdown-item:hover {
        color: black;
        animation: breath 2s infinite alternate;
    }
</style>
