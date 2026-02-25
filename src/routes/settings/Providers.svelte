<script lang="ts">
    import type { Provider } from '$lib/types';
    import type { SvelteMap } from 'svelte/reactivity';

    type Props = {
        providers: SvelteMap<string, Provider>;
    };

    let { providers }: Props = $props();
</script>

<div>Providers content</div>
{#each providers.entries() as [name, provider] }
    <div>
        <div>{name}</div>
        <div>apiType: {provider.apiType}</div>
        <div>Endpoint: {provider.endpoint}</div>
        <div>Model: {provider.model}</div>
    </div>
{/each}