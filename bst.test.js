const { Tree } = require('./bst');

let tree;

beforeEach(() => {
    tree = new Tree ([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
});

describe('buildTree()', () => {
    test('root is the middle element of the sorted unique array', () => {
        expect(tree.root.data).toBe(8);
    });

    test('removes duplicates', () => {
        const values = [];
        tree.inOrderForEach(v => values.push(v));
        const unique = [...new Set(values)];
        expect(values).toEqual(unique);
    });

    test('inOrder traversal produces sorted output', () => {
        const values = [];
        tree.inOrderForEach(v => values.push(v));
        const sorted = [...values].sort((a, b) => a - b);
        expect(values).toEqual(sorted);
    });
});

// includes

describe('includes()', () => {
    test('return true for a value that exists', () => {
        expect(tree.includes(23)).toBe(true);
    });

    test('returns false for a value that does not exist', () => {
        expect(tree.includes(999)).toBe(false);
    });

    test('returns true for the root value', () => {
        expect(tree.includes(tree.root.data)).toBe(true);
    });
});

// insert

describe('insert()', () => {
    test('inserts a new value into the tree', () => {
        tree.insert(100);
        expect(tree.includes(100)).toBe(true);
    });

    test('does not insert duplicate values', () => {
        const before = [];
        tree.inOrderForEach(v => before.push(v));

        tree.insert(23);

        const after = [];
        tree.inOrderForEach(v => after.push(v));

        expect(after).toEqual(before);
    });

    test('inserted value lands in the correct BST position', () => {
        tree.insert(6);
        const values = [];
        tree.inOrderForEach(v => values.push(v));
        const sixIndex = values.indexOf(6);
        expect(values[sixIndex - 1]).toBe(5);
        expect(values[sixIndex + 1]).toBe(7);
    });
});

// deleteItem

describe('deleteItem()', () => {
    test('removes a leaf node', () => {
        tree.deleteItem(1);
        expect(tree.includes(1)).toBe(false);
    });

    test('remove a node with one children', () => {
        tree.insert(2);
        tree.deleteItem(1);
        expect(tree.includes(1)).toBe(false);
        expect(tree.includes(2)).toBe(true);
    });

    test('removes a node with two children', () => {
        tree.deleteItem(8);
        expect(tree.includes(8)).toBe(false);

        const values = [];
        tree.inOrderForEach(v => values.push(v));
        const sorted = [...values].sort((a, b) => a - b);
        expect(values).toEqual(sorted);
    });

    test('does nothing if value does not exist', () => {
        const before = [];
        tree.inOrderForEach(v => before.push(v));
        tree.deleteItem(999);
        const after = [];
        tree.inOrderForEach(v => after.push(v));
        expect(after).toEqual(before);
    });
});

// traversals

describe('traversals', () => {
    test('levelOrderForEach visits root first', () => {
        const values = [];
        tree.levelOrderForEach(v => values.push(v));
        expect(values[0]).toBe(tree.root.data);
    });

    test('inOrderForEach produces sorted output', () => {
        const values = [];
        tree.inOrderForEach(v => values.push(v));
        expect(values).toEqual([...values].sort((a, b) => a - b));
    });

    test('preOrderForEach visits root first', () => {
        const values = [];
        tree.preOrderForEach(v => values.push(v));
        expect(values[0]).toBe(tree.root.data);
    });

    test('postOrderForEach visits root last', () => {
        const values = [];
        tree.postOrderForEach(v => values.push(v));
        expect(values[values.length - 1]).toBe(tree.root.data)
    });

    test('all traversals visit every node exactly once', () => {
        const level = [], in0 = [], pre = [], post = [];
        tree.levelOrderForEach(v => level.push(v));
        tree.inOrderForEach(v => in0.push(v));
        tree.preOrderForEach(v => pre.push(v));
        tree.postOrderForEach(v => post.push(v));

        expect(level.sort()).toEqual(in0.sort());
        expect(pre.sort()).toEqual(post.sort());
    });

    test('throws if no callback provided', () => {
        expect(() => tree.levelOrderForEach()).toThrow("A callback is required");
        expect(() => tree.inOrderForEach()).toThrow("A callback is required");
        expect(() => tree.preOrderForEach()).toThrow("A callback is required");
        expect(() => tree.postOrderForEach()).toThrow("A callback is required");
    });
});

// height

describe('height()', () => {
    test('a leaf node has height 0', () => {
        expect(tree.height(6345)).toBe(0);
    });

    test('returns undefined for a value not in the tree', () => {
        expect(tree.height(999)).toBeUndefined();
    });

    test('root has the greatest height', () => {
        const rootHeight = tree.height(tree.root.data);
        const values = [];
        tree.inOrderForEach(v => values.push(v));

        const allHeight = values.map(v => tree.height(v));
        expect(Math.max(...allHeight)).toBe(rootHeight);
    });
});

// depth

describe('depth()', () => {
    test('root has depth 0', () => {
        expect(tree.depth(tree.root.data)).toBe(0);
    });

    test('returns undefined for a value not in the tree', () => {
        expect(tree.depth(999)).toBeUndefined();
    });

    test('depth increases as we go deeper', () => {
        const rootDepth = tree.depth(tree.root.data);
        const childDepth = tree.depth(tree.root.left.data);
        expect(childDepth).toBeGreaterThan(rootDepth);
    });
});

// isBalanced & rebalance

describe('isBalanced() and rebalance()', () => {
    test('freshly built tree is balanced', () => {
        expect(tree.isBalanced()).toBe(true);
    });
 
    test('tree becomes unbalanced after inserting many large values', () => {
        tree.insert(1000);
        tree.insert(2000);
        tree.insert(3000);
        tree.insert(4000);
        tree.insert(5000);
        expect(tree.isBalanced()).toBe(false);
    });
    
    test('rebalance() restores balance', () => {
        tree.insert(1000);
        tree.insert(2000);
        tree.insert(3000);
        tree.insert(4000);
        tree.insert(5000);
        tree.rebalance();
        expect(tree.isBalanced()).toBe(true);
    });
    
    test('rebalance() keeps all values intact', () => {
        tree.insert(1000);
        tree.insert(2000);
    
        const before = [];
        tree.inOrderForEach(v => before.push(v));
    
        tree.rebalance();
    
        const after = [];
        tree.inOrderForEach(v => after.push(v));
    
        expect(after).toEqual(before); 
    });
});