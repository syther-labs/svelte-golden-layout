<script lang="ts">
	import { ComponentItemConfig, LayoutConfig, ResolvedLayoutConfig, VirtualLayout } from 'golden-layout';
	import './lib/css/themes/goldenlayout-light-theme.css';

	import GoldenLayout from './lib';
	import Chart from './components/Chart.svelte';
	import { spawnWithBinaryPartitioning } from './MainLayout';

	let display = true;
	let rows = 2;

	let chartCount = 1;
	const components = { Chart };

	let layout: LayoutConfig;
	let saved: ResolvedLayoutConfig = undefined;

	let goldenLayout: VirtualLayout;

	$: layout = {
		root: {
			type: 'column',
			content: [
				{
					type: 'component',
					title: String(1),
					componentType: 'Chart',
					componentState: {
						chartId: 1,
					},
				},
			],
		},
	};

	function handleSave() {
		saved = goldenLayout.saveLayout();
	}

	function handleRestore() {
		layout = saved as unknown as LayoutConfig;
	}

	function addChart() {
		chartCount = chartCount + 1;
    const config = {
			title: String(chartCount),
			type: 'component',
			componentType: 'Chart',
			// isClosable: false,
			// reorderEnabled: false,
			componentState: {
				chartId: chartCount,
			},
		} as ComponentItemConfig;

		spawnWithBinaryPartitioning(goldenLayout, config);
		// goldenLayout.addItemAtLocation(config, [{ typeId: 7 }]);
	}
</script>

<main>
	<div>
		<h1>Config</h1>
		<p>
			<input type="checkbox" bind:checked={display} /> display
			<input type="number" min="0" max="10" bind:value={rows} /> columns
			<button on:click={addChart}>Add Chart</button>
			<button on:click={handleSave}>Save Layout</button>
			<button on:click={handleRestore} disabled={saved === undefined}>Restore Layout</button>
		</p>
		<h2>Saved Layout</h2>
		{#if saved !== undefined}
			<pre>{JSON.stringify(saved, undefined, 2)}</pre>
		{:else}
			<p>(none)</p>
		{/if}
	</div>
	<div>
		<h1>Demo</h1>
		<div class="layout-container">
			{#if display}
				<GoldenLayout config={layout} bind:goldenLayout let:componentType let:componentState>
					<svelte:component this={components[componentType]} {...componentState} />
				</GoldenLayout>
			{/if}
		</div>
	</div>
</main>

<style>
	main {
		display: flex;
		flex-direction: row;
	}

	main > div {
		width: 50%;
		padding: 2rem;
	}

	input[type='number'] {
		width: 3.5em;
	}

	.layout-container {
		height: 800px;

		border: 1px solid black;
	}
</style>
