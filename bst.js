// Binary Search Trees //

class Node {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

class Tree {
    constructor(array) {
        this.root = this.buildTree(array);
    }

    buildTree(array) {
        const sorted = [...new Set(array)].sort((a, b) => a - b);
        return this.#buildBalanced(sorted, 0, sorted.length - 1);
    }

    #buildBalanced(arr, start, end) {
        if (start > end) return null;
        const mid = Math.floor((start + end) / 2);
        const node = new Node(arr[mid]);
        node.left = this.#buildBalanced(arr, start, mid - 1);
        node.right = this.#buildBalanced(arr, mid + 1, end);
        return node;
    }

    includes(value) {
        let current = this.root;
        while (current !== null) {
            if (value === current.data) return true;
            current = value < current.data ? current.left : current.right;
        }
        
        return false;
    }

    insert(value) {
        const newNode = new Node(value);
        if (this.root === null) { this.root = newNode; return; }
        let current = this.root;
        while (true) {
            if (value === current.data) return;
            if (value < current.data) {
                if (current.left === null) { current.left = newNode; return; }
                current = current.left;
            } else {
                if (current.right === null) { current.right = newNode; return; }
                current = current.right;
            }
        }
    }

    deleteItem(value) {
        this.root = this.#deleteNode(this.root, value);
    }

    #deleteNode(node, value) {
        if (node === null) return null;
        if (value < node.data) {
            node.left = this.#deleteNode(node.left, value);
        } else if (value > node.data) {
            node.right = this.#deleteNode(node.right, value);
        } else {
            if (node.left === null) return node.right;
            if (node.right === null) return node.left;
            let successor = node.right;
            while (successor.left !== null) successor = successor.left;
            node.data = successor.data;
            node.right = this.#deleteNode(node.right, successor.data);
        }
        
        return node;
    }

    levelOrderForEach(callback) {
        if (typeof callback !== 'function') throw new Error("A callback is required");
        if (this.root === null) return;
        const queue = [this.root];
        while (queue.length > 0) {
            const node = queue.shift();
            callback(node.data);
            if (node.left !== null) queue.push(node.left);
            if (node.right !== null) queue.push(node.right);
        }
    }

    inOrderForEach(callback) {
        if (typeof callback !== 'function') throw new Error("A callback is required");
        this.#inOrder(this.root, callback);
    }

    #inOrder(node, callback) {
        if (node === null) return;
        this.#inOrder(node.left, callback);
        callback(node.data);
        this.#inOrder(node.right, callback);
    }

    preOrderForEach(callback) {
        if (typeof callback !== 'function') throw new Error("A callback is required");
        this.#preOrder(this.root, callback);
    }

    #preOrder(node, callback) {
        if (node === null) return;
        callback(node.data);
        this.#preOrder(node.left, callback);
        this.#preOrder(node.right, callback);
    }

    postOrderForEach(callback) {
        if (typeof callback !== 'function') throw new Error("A callback is required");
        this.#postOrder(this.root, callback);
    }

    #postOrder(node, callback) {
        if (node === null) return;
        this.#postOrder(node.left, callback);
        this.#postOrder(node.right, callback);
        callback(node.data);
    }

    height(value) {
        const node = this.#findNode(this.root, value);
        if (node === null) return undefined;
        return this.#heightOf(node);
    }

    #heightOf(node) {
        if (node === null) return -1;
        return 1 + Math.max(this.#heightOf(node.left), this.#heightOf(node.right));
    }

    depth(value) {
        let current = this.root;
        let depth = 0;
        while (current !== null) {
            if (value === current.data) return depth;
            current = value < current.data ? current.left : current.right;
            depth++;
        }

        return undefined;
    }

    isBalanced() {
        return this.#checkBalance(this.root) !== -Infinity;
    }

    #checkBalance(node) {
        if (node === null) return -1;
        const leftHeight = this.#checkBalance(node.left);
        const rightHeight = this.#checkBalance(node.right);
        if (leftHeight === -Infinity || rightHeight === -Infinity) return -Infinity;
        if (Math.abs(leftHeight - rightHeight) > 1) return -Infinity;
        return 1 + Math.max(leftHeight, rightHeight);
    }

    rebalance() {
        const values = [];
        this.inOrderForEach(val => values.push(val));
        this.root = this.buildTree(values);
    }

    #findNode(node, value) {
        if (node === null) return null;
        if (value === node.data) return node;
        if (value < node.data) return this.#findNode(node.left, value);
        return this.#findNode(node.right, value);
    }
}

const prettyPrint = (node, prefix = '', isLeft = true) => {
    if (node === null || node === undefined) return;
    prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
    console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
    prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
}

module.exports = { Tree, prettyPrint };