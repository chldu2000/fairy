<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLButtonAttributes } from 'svelte/elements';

    // Define the component's props interface
    interface Props extends HTMLButtonAttributes {
        preset?: 'round' | 'plain' | '';
        children?: Snippet;
    }

    // Extract class from props, rest will be in $restProps
    let {
        preset: shape = '',
        class: className = '',
        children,
        ...restProps
    }: Props = $props();
</script>

// TODO: 更复杂、贴近ZZZ游戏内按钮的样式，组合图标和文字
<button {...restProps} class="f-button {className} {shape}">
    {@render children?.()}
</button>

<style>
    @import '$lib/style/button.css';
</style>
