<script lang="ts">
	import Header from './Header.svelte';
	// import './layout.css';
    import ModelSwitch from './ModelSwitch.svelte';
    import Sidebar from './Sidebar.svelte';

	let { children } = $props();
</script>

<div class="app">
	<!-- <Header /> -->

	<Sidebar />

	<div class="chat-container">
		<ModelSwitch />
		<main>
			{@render children()}
		</main>
	</div>

	

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
		min-height: 100vh;
	}

	.chat-container {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
