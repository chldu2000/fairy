<script lang="ts">
    import { onMount } from 'svelte';

	// import './layout.css';
    import Sidebar from './Sidebar.svelte';
    import { loadClientSettings, loadChatHistory } from '$lib/store.svelte';

	let { children } = $props();

	onMount(() => {
		console.log('Layout mounted');
		loadClientSettings();
		loadChatHistory();
	});
</script>

<div class="app">
	<!-- <Header /> -->

	<Sidebar />

	<main>
		{@render children()}
	</main>

	

	<!-- <footer>
		<p>
			visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to learn about SvelteKit
		</p>
	</footer> -->
</div>

<style>
	/* body {
		height: 100%;
		margin: 0;
		padding: 0;
	} */

	.app {
		display: flex;
		flex-direction: row;
		width: 100vw;
		height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		width: 100%;
	}
</style>
