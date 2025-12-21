<script lang="ts">
    import '$lib/style/button.css';
    import type { HTMLButtonAttributes } from 'svelte/elements';

    // Define the component's props interface
    interface Props extends HTMLButtonAttributes {
        preset?: 'round' | 'plain' | '';
        children?: any;
    }

    // Extract customClass from props, rest will be in $restProps
    let {
        preset: shape = '',
        class: className = '',
        children,
        ...restProps 
    }: Props = $props();
</script>

<button
    {...restProps}
    class="kk-button {className} {shape === 'round' ? 'round' : ''} {shape === 'plain' ? 'plain' : ''}"
>
    {@render children?.()}
</button>
