<script>
	import '../app.css';
	import '../style.css';
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';

	let { children } = $props();
</script>

<Header />
<Sidebar />
<main class="main-content">
	{@render children()}
</main>

