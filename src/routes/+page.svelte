<script lang="ts">
    import { deselectChatSession } from '$lib/store.svelte';
	
	deselectChatSession();
</script>

<svelte:head>
	<title>Fairy</title>
	<meta name="description" content="A chatbot demo" />
</svelte:head>

<section>
	<h1>
		Talk with Fairy~
	</h1>

	<p>Set up your API, and...</p>

	<p>Start by create/select a chat from the sidebar~</p>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
		background-color: #2f2f2f;
		color: white;
	}

	h1 {
		width: 100%;
		text-align: center;
	}
</style>
