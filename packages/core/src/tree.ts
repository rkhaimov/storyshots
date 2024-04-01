import { Brand, ChildBrand } from './brand';
import { assert, not } from './utils';

// Tree that has unique IDs in each of its nodes
export type Tree<TNode, TLeaf> =
  | IntermediateNode<TNode, TLeaf>
  | LeafNode<TLeaf>;

export type IntermediateNode<TNode, TLeaf> = {
  type: 'node';
  id: IntermediateNodeID;
  payload: TNode;
  children: Tree<TNode, TLeaf>[];
};

export type LeafNode<TLeaf> = {
  type: 'leaf';
  id: LeafNodeID;
  payload: TLeaf;
};

// Each tree node id is serializable and URI encoding ignorant (meaning that it does not affect its value)
type TreeNodeID = Brand<string, 'TreeNodeID'>;

export type IntermediateNodeID = ChildBrand<TreeNodeID, 'IntermediateNodeID'>;

export type LeafNodeID = ChildBrand<TreeNodeID, 'LeafNodeID'>;

export const TreeOP = {
  toLeafsArray: <TLeaf>(
    nodes: Tree<unknown, TLeaf>[],
  ): Array<LeafNode<TLeaf>> =>
    nodes.flatMap((it) => {
      switch (it.type) {
        case 'node':
          return TreeOP.toLeafsArray(it.children);
        case 'leaf':
          return [it];
      }
    }),
  map: <TALeaf, TANode, TBLeaf, TBNode>(
    tree: Tree<TANode, TALeaf>[],
    transform: {
      node(input: TANode): TBNode;
      leaf(input: TALeaf): TBLeaf;
    },
  ) => {
    return tree.map((node): Tree<TBNode, TBLeaf> => {
      switch (node.type) {
        case 'node':
          return {
            ...node,
            payload: transform.node(node.payload),
            children: TreeOP.map(node.children, transform),
          };
        case 'leaf':
          return {
            ...node,
            payload: transform.leaf(node.payload),
          };
      }
    });
  },
  find: <TLeaf>(
    nodes: Tree<unknown, TLeaf>[],
    id: LeafNodeID,
  ): LeafNode<TLeaf> | undefined => {
    if (nodes.length === 0) {
      return undefined;
    }

    const [head, ...tail] = nodes;

    if (head.type === 'leaf') {
      return head.id === id ? head : TreeOP.find(tail, id);
    }

    const inside = TreeOP.parseInterNodeIDsChain(id).includes(head.id);

    if (not(inside)) {
      return TreeOP.find(tail, id);
    }

    return TreeOP.find(head.children, id);
  },
  parseInterNodeIDsChain: (id: LeafNodeID): IntermediateNodeID[] => {
    const parts = id.split('__').slice(0, -1);

    return parts.reduce((ids, part) => {
      if (ids.length === 0) {
        return [part as IntermediateNodeID];
      }

      const last = ids[ids.length - 1];

      return [...ids, `${last}__${part}` as IntermediateNodeID];
    }, [] as IntermediateNodeID[]);
  },
  createIntermediateNode: <TNode, TLeaf>(
    id: string,
    payload: TNode,
    children: Tree<TNode, TLeaf>[],
  ): IntermediateNode<TNode, TLeaf> => {
    const parent = createTreeNodeID(id) as IntermediateNodeID;

    return {
      id: parent,
      type: 'node',
      payload,
      children: withUniqueIDs(parent, children),
    };
  },
  createLeafNode: <TLeaf>(id: string, payload: TLeaf): LeafNode<TLeaf> => ({
    id: createTreeNodeID(id) as LeafNodeID,
    type: 'leaf',
    payload,
  }),
  ensureIsLeafID: (test: string) => ensureIsTreeNodeID(test) as LeafNodeID,
};

function ensureIsTreeNodeID(test: string): TreeNodeID {
  assert(not(test.includes(' ')));

  assert(
    test === encodeURIComponent(test),
    `The string "${test}" contains specific characters that do not survive URI encoding.`,
  );

  return test as LeafNodeID;
}

function withUniqueIDs<TNode, TLeaf>(
  parent: IntermediateNodeID,
  children: Tree<TNode, TLeaf>[],
): Tree<TNode, TLeaf>[] {
  return children.map((child) => {
    switch (child.type) {
      case 'node':
        return {
          ...child,
          id: `${parent}__${child.id}` as IntermediateNodeID,
          children: withUniqueIDs(parent, child.children),
        };
      case 'leaf':
        return {
          ...child,
          id: `${parent}__${child.id}` as LeafNodeID,
        };
    }
  });
}

function createTreeNodeID(from: string) {
  const formatted = from.split(' ').join('_').toLowerCase();

  return ensureIsTreeNodeID(formatted);
}
