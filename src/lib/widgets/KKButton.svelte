<script lang="ts">
    import type { Snippet } from "svelte";
    import type { HTMLButtonAttributes } from "svelte/elements";

    // Define the component's props interface
    interface Props extends HTMLButtonAttributes {
        preset?: "round" | "plain" | "";
        children?: Snippet;
    }

    // Extract class from props, rest will be in $restProps
    let {
        preset: shape = "",
        class: className = "",
        children,
        ...restProps
    }: Props = $props();
</script>

<button {...restProps} class="kk-button {className} {shape}">
    {@render children?.()}
</button>

<style>
    @import "$lib/style/button.css";
</style>
