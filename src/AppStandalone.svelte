<script lang="ts">
	import { onMount } from 'svelte';
	import {
		type LayoutConfig,
		GoldenLayout,
		RowOrColumn,
		ComponentItemConfig,
		ContentItem,
		Stack,
		ComponentItem,
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
					// {
					// 	type: 'column',
					// 	content: [
					// 		{
					// 			...newElConfig(),
					// 		},
					// 		{
					// 			type: 'row',
					// 			content: [
					// 				{
					// 					...newElConfig(),
					// 				},
					// 			],
					// 		},
					// 	],
					// },
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

	function findNearestAncestor(
		predicate: (item: ContentItem) => boolean,
		start: ContentItem,
	): ContentItem | undefined {
		let current = start;
		while (current) {
			if (predicate(current)) return current;
			else current = current.parent;
		}
	}

	function findNearestDescendants(
		predicate: (item: ContentItem) => boolean,
		start: ContentItem,
	): ContentItem | undefined {
		// Check the current item
		if (predicate(start)) {
			return start;
		}

		// Iterate through all children
		for (const child of start.contentItems) {
			const foundChild = findNearestDescendants(predicate, child);
			if (foundChild) return foundChild;
		}

		// No matching child found
		return undefined;
	}

	function binarySplitAt(component: ComponentItem): RowOrColumn {
		const stack = findNearestAncestor((it) => it.isStack, component) as Stack;
		const stackParent = stack.parent as RowOrColumn;
		const stackIndex = stackParent.contentItems.findIndex((i) => i == stack);

		// split the item stack into a container and a stack
		const newRowColumnContainer = stackParent.newItem(
			{
				type: stackParent.isRow ? 'column' : 'row',
				content: [],
			},
			stackIndex,
		) as RowOrColumn;

		// add the stack first
		stackParent.removeChild(stack, true);
		newRowColumnContainer.addChild(stack, 0);

		return newRowColumnContainer;
	}

	function freeSlot(item: ContentItem): RowOrColumn {
		return findNearestDescendants((it) => it.isRow || it.isColumn, item) as RowOrColumn;
	}

	function addComponent() {
		const container = myLayout.focusedComponentItem
			? binarySplitAt(myLayout.focusedComponentItem)
			: freeSlot(myLayout.rootItem);
		const newEl = newElConfig();
		const idx = container.addItem(newEl);
		myLayout.focusComponent(container.contentItems[idx].contentItems[0] as ComponentItem);
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
