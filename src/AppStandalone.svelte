<script lang="ts">
	import { onMount } from 'svelte';
	import {
		type LayoutConfig,
		GoldenLayout,
		RowOrColumnItemConfig,
		RowOrColumn,
	} from 'golden-layout';
	import 'golden-layout/dist/css/goldenlayout-base.css';
	import 'golden-layout/dist/css/themes/goldenlayout-dark-theme.css';
	import XAxis from './components/XAxis.svelte';

	let container: HTMLDivElement;
	let myLayout: GoldenLayout;

	onMount(() => {
		const config: LayoutConfig = {
			root: {
				type: 'row',
				content: [
					{
						type: 'component',
						componentType: 'myComponent',
						componentState: { id: 1 },
					},
					{
						type: 'column',
						content: [
							{
								type: 'component',
								componentType: 'myComponent',
								componentState: { id: 1 },
							},
							{
								type: 'row',
								content: [
									{
										type: 'component',
										componentType: 'myComponent',
										componentState: { id: 1 },
									},
								],
							},
						],
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

	let isVSplit = true;
	function addComponent() {
		const ty = isVSplit ? 'row' : 'column';
		console.log(ty);

		const newRowConfig: RowOrColumnItemConfig = {
			type: ty,
			content: [
				{
					type: 'component',
					componentType: 'myComponent',
					componentState: { id: Math.floor(Math.random() * 1000) },
				},
			],
		};

		const typeId = isVSplit ? 4 : 5;

    let a = myLayout.focusedComponentItem;
    (a.parent.parent as RowOrColumn).addItem(newRowConfig);
    myLayout.focusComponent()
		// myLayout.addItemAtLocation(newRowConfig, [
		// (myLayout.rootItem as RowOrColumn).addItem(newRowConfig);

		isVSplit = !isVSplit;
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
