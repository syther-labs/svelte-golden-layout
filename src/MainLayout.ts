import { ComponentItem, ComponentItemConfig, ContentItem, GoldenLayout, RowOrColumn, Stack, VirtualLayout } from "golden-layout";

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

export function spawnWithBinaryPartitioning(lm: VirtualLayout, componentConfig: ComponentItemConfig) {
  const container = lm.focusedComponentItem
    ? binarySplitAt(lm.focusedComponentItem)
    : freeSlot(lm.rootItem);
  const idx = container.addItem(componentConfig);
  lm.focusComponent(container.contentItems[idx].contentItems[0] as ComponentItem);
}