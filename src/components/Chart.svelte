<script lang="ts">
	import { LayoutConfig, ResolvedLayoutConfig, VirtualLayout } from 'golden-layout';
	import '../lib/css/themes/goldenlayout-dark-theme.css';

	import GoldenLayout from '../lib';
	import ChartPane from './ChartPane.svelte';
	import XAxis from './XAxis.svelte';

	export let chartId: number;
	let paneCount = 1;

	const components = { ChartPane };

	let layout: LayoutConfig;
	let saved: ResolvedLayoutConfig = undefined;

	let goldenLayout: VirtualLayout;

	$: layout = {
		root: {
			type: 'column',
			isClosable: false,
			content: [
				{
					type: 'component',
					title: 'Main Pane',
					isClosable: false,
					componentType: 'ChartPane',
					reorderEnabled: false,
					componentState: {},
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

	function addPane() {
		paneCount = paneCount + 1;
		goldenLayout.addItemAtLocation(
			{
				type: 'component',
        // id: 
				// title: String(paneCount),
				header: { show: false },
				reorderEnabled: false,
				componentType: 'ChartPane',
				componentState: {},
			},
			[{ typeId: 7 }],
		);
	}
</script>

<main>
	<div>
		<h1>Chart #{chartId} config</h1>
		<p>
			<button on:click={addPane}>Add Indicator Pane</button>
			<!-- <button on:click={handleSave}>Save Layout</button>
			<button on:click={handleRestore} disabled={saved === undefined}>Restore Layout</button> -->
		</p>
		<!-- <h2>Saved Layout</h2>
		{#if saved !== undefined}
			<pre>{JSON.stringify(saved, undefined, 2)}</pre>
		{:else}
			<p>(none)</p>
		{/if} -->
	</div>
	<div class="layout-container">
		<GoldenLayout config={layout} bind:goldenLayout let:componentType let:componentState>
			<svelte:component this={components[componentType]} {...componentState} />
		</GoldenLayout>
		<XAxis id={chartId} />
	</div>
</main>

<style>
	main {
		display: flex;
		flex-direction: row;
		height: 100%;
	}

	main > div {
		background-color: #fff;
		height: 100%;
		width: 50%;
	}

	.layout-container {
		height: 100%;
		display: flex;
		flex-direction: column;
		border: 1px solid black;
	}
</style>
