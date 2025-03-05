<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div data-theme="cupcake" class="min-h-screen">
	{@render children()}
</div>
