<script lang="ts">
    import { deselectChatSession, saveClientSettings } from "$lib/store.svelte";

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
            <div>Providers content</div>
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
        border: grey 4px solid;
        border-radius: 5rem;
        margin: 0.75rem;
        /* transform: skewX(-30deg); */

        position: relative; /* 为子元素的 z-index 提供上下文(参考系?) */
        display: inline-flex;
    }

    .tab {
        background-color: black;
        color: white;
        height: 2.5rem;
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


    .tab span {
        /* transform: skewX(20deg); */
    }

    .tab.active {
        background-color: yellow;
        box-shadow: 0 0 0 6px yellow; /* x y blur color */
        animation: breath-shadow 2s infinite alternate;
        color: black;

        /* clip-path:; */

        z-index: 2;
    }

    .tab:first-child {
        border-radius: 1.25rem 0.5rem 0.5rem 1.25rem;
    }

    .tab:last-child {
        border-radius: 0.5rem 1.25rem 1.25rem 0.5rem;
    }
</style>