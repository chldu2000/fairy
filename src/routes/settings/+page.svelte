<script lang="ts">
    import { deselectChatSession } from "$lib/store.svelte";
    import Providers from "./Providers.svelte";

    import { providers, personas, preferences } from "$lib/store.svelte";

    deselectChatSession();

    let activeTab: string = 'providers';
    const tabs: string[] = ['providers', 'personas', 'test'];

    function changeTab(tab: string) {
        activeTab = tab;
    }
</script>


<div id="settings-layout">
    <!-- <div>
        settings window
    </div> -->

    <div class="tabs-bar">
        {#each tabs as tab (tab)}
            <button onclick={() => changeTab(tab)} class="tab {activeTab === tab ? 'active' : ''}">
                <span>{tab}</span>
            </button>
        {/each}
    </div>
    <div id="tab-content">
        {#if activeTab === 'providers'}
            <Providers providers={providers} />
        {/if}
        {#if activeTab === 'personas'}
            <div>Personas content</div>
        {/if}
    </div>
</div>


<style>
    @import '$lib/style/animation.css';

    #settings-layout {
        flex: 1;
        flex-direction: column;
    }

    .tabs-bar {
        background-color: black;
        /* height: 2.5rem; */
        border: grey 3px solid;
        border-radius: 5rem;
        margin-top: 0.75rem;
        margin-left: 1.5rem;
        /* transform: skewX(-30deg); */

        position: relative; /* 为子元素的 z-index 提供上下文(参考系) */
        display: inline-flex;
    }

    .tab {
        background-color: black;
        color: white;
        height: 2rem;
        width: 9rem;
        border-radius: 0.5rem;
        border: none;
        padding: 0 3rem;
        cursor: pointer;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        /* transition: all 0.2s ease; */

        z-index: 1;
    }

    .tab.active {
        /* background-color: yellow; */
        /* box-shadow: 0 0 0 6px yellow; */
        animation: breath 1.25s infinite alternate;
        color: black;
        mask-image: url($lib/images/tab-center.png);
        mask-size: 100% 100%;
        mask-repeat: no-repeat;
        mask-position: center;

        /* filter: drop-shadow(0 0 6px yellow); */

        transform: scale(1.25);

        /* clip-path:; */

        z-index: 2;
    }

    .tab.active span {
        transform: scale(0.8);
    }

    .tab:first-child {
        border-radius: 1.25rem 0.5rem 0.5rem 1.25rem;
    }

    .tab:first-child.active {
        border-radius: 0 0 0 0;
        mask-image: url($lib/images/tab-side.png);
        mask-size: 100% 100%;
        mask-repeat: no-repeat;
        mask-position: center;
    }

    .tab:last-child {
        border-radius: 0.5rem 1.25rem 1.25rem 0.5rem;
    }

    .tab:last-child.active {
        border-radius: 0 0 0 0;
        mask-image: url($lib/images/tab-side.png);
        mask-size: 100% 100%;
        mask-repeat: no-repeat;
        transform: rotate(180deg) scale(1.25);
        transform-origin: center;
    }

    .tab:last-child.active span {
        transform: rotate(-180deg) scale(0.8);
        transform-origin: center;
    }
</style>