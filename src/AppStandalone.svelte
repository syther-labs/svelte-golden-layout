<script lang="ts">
	import { onMount } from 'svelte';
	import {
		type LayoutConfig,
		GoldenLayout,
		RowOrColumnItemConfig,
		RowOrColumn,
		ComponentItemConfig,
		ContentItem,
	} from 'golden-layout';
	import 'golden-layout/dist/css/goldenlayout-base.css';
	import 'golden-layout/dist/css/themes/goldenlayout-dark-theme.css';
	import XAxis from './components/XAxis.svelte';

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
					{
						type: 'column',
						content: [
							{
								...newElConfig(),
							},
							{
								type: 'row',
								content: [
									{
										...newElConfig(),
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

	function newElConfig(): ComponentItemConfig {
		const _id = id++;
		return {
			title: String(_id),
			type: 'component',
			componentType: 'myComponent',
			componentState: { id: _id },
		};
	}

	function findClosestParent(
		predicate: (item: ContentItem) => boolean,
		start: ContentItem,
	): ContentItem | undefined {
		let current = start;
		while (current) {
			if (predicate(current)) return current;
			else current = current.parent;
		}
	}

	function findClosestChildren(
		predicate: (index: number, item: ContentItem) => boolean,
		start: ContentItem = myLayout.rootItem,
	): ContentItem | undefined {
		// First iterate through all children from last to first
		for (let i = start.contentItems.length - 1; i >= 0; i--) {
			const child = start.contentItems[i];
			if (predicate(i, child)) {
				return child;
			}
		}

		// If not matched, then dive deeper from last to first
		for (let i = start.contentItems.length - 1; i >= 0; i--) {
			const child = start.contentItems[i];
			const result = findClosestChildren(predicate, child);
			if (result) {
				return result;
			}
		}

		return undefined;
	}

	let isVSplit = true;
	function addComponent() {
		const ty = isVSplit ? 'row' : 'column';
		console.log(ty);

		const newRowConfig: RowOrColumnItemConfig = {
			type: ty,
			content: [
				{
					...newElConfig(),
				},
			],
		};

		const typeId = isVSplit ? 4 : 5;

    // find the point from which to add
    let startNode = myLayout.rootItem;
    if (myLayout.focusedComponentItem) 
      startNode = findClosestParent(i => i.isRow || i.isColumn, myLayout.focusedComponentItem) ?? myLayout.rootItem;

		(startNode as RowOrColumn).addItem(newRowConfig);

		// myLayout.focusComponent();
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
