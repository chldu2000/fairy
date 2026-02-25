<script lang="ts">
    import { onMount } from 'svelte';

	// import './layout.css';
    import Sidebar from './Sidebar.svelte';
    import { loadPreferences, loadChatHistory } from '$lib/store.svelte';

	let { children } = $props();

	onMount(() => {
		console.log('Layout mounted');
		loadPreferences();
		loadChatHistory();
	});
</script>

<div id="app">
	<!-- <Header /> -->
    <aside>
        <Sidebar />
    </aside>

	<main>
		{@render children()}
	</main>
</div>

<style>
	/* body {
		height: 100%;
		margin: 0;
		padding: 0;
	} */

	#app {
		display: flex;
		flex-direction: row;
		width: 100vw;
		height: 100vh;
        gap: 8px;
        padding: 8px;
        box-sizing: border-box; /* 使宽高包含 padding 和 border */
        background-color: grey;
	}

    #app > * { /* sub elements */
        border-radius: 1rem;
        overflow: hidden;
        display: flex;

        background-color: #2f2f2f;
        color: white;
    }

    aside {
        flex: 0 0 auto; /* flex: grow shrink basis */
    }

	main {
		flex: 1; /* 1 1 0 */
	}
</style>
