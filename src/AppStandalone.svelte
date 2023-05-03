<script lang="ts">
	import { onMount } from 'svelte';
	import {
		type LayoutConfig,
		GoldenLayout,
		ComponentItemConfig,
	} from 'golden-layout';
	import 'golden-layout/dist/css/goldenlayout-base.css';
	import 'golden-layout/dist/css/themes/goldenlayout-dark-theme.css';
	import XAxis from './components/XAxis.svelte';
	import { spawnWithBinaryPartitioning } from './MainLayout';

	let container: HTMLDivElement;
	let myLayout: GoldenLayout;
	let id = 0;

	onMount(() => {
		const config: LayoutConfig = {
			root: {
				type: 'row',
				content: [
					{
						...newElConfig(),
					},
				],
			},
		};

		myLayout = new GoldenLayout(container);
		myLayout.registerComponentFactoryFunction('myComponent', (c, componentState) => {
			new XAxis({
				target: c.element,
				props: { id: componentState.id },
			});
		});
		myLayout.loadLayout(config);
	});

	function newElConfig(): ComponentItemConfig {
		const _id = id++;
		return {
			title: String(_id),
			type: 'component',
			header: {
				popout: false,
			},
			componentType: 'myComponent',
			componentState: { id: _id },
		};
	}

	function addComponent() {
		spawnWithBinaryPartitioning(myLayout, newElConfig());
	}
</script>

<main>
	<button on:click={addComponent}>Add new row with two components</button>
	<div>
		<div bind:this={container} style="width: 100%; height: 100vh;" />
	</div>
</main>

<style>
	main {
		display: flex;
		flex-direction: row;
	}

	main > div {
		width: 100%;
		padding: 2rem;
	}
</style>
