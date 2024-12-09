const NIL = {};

class Node {
  constructor(value) {
    this.id = Math.random().toString(36).substr(2, 9);
    this.value = value;
    this.color = 'red';
    this.left = NIL;
    this.right = NIL;
    this.parent = NIL;
  }
}

NIL.id = null;
NIL.value = null;
NIL.color = 'black';
NIL.left = null;
NIL.right = null;
NIL.parent = null;

export function insertNode(root, value) {
  const newNode = new Node(value);

  let y = NIL;
  let x = root;

  while (x !== NIL && x !== null) {
    y = x;
    if (newNode.value < x.value) {
      x = x.left;
    } else {
      x = x.right;
    }
  }

  newNode.parent = y;

  if (y === NIL || y === null) {
    root = newNode;
  } else if (newNode.value < y.value) {
    y.left = newNode;
  } else {
    y.right = newNode;
  }

  newNode.left = NIL;
  newNode.right = NIL;
  newNode.color = 'red';

  root = fixInsert(root, newNode);
  return root;
}

function fixInsert(root, k) {
  while (k.parent.color === 'red') {
    if (k.parent === k.parent.parent.left) {
      let uncle = k.parent.parent.right;
      if (uncle.color === 'red') {
        k.parent.color = 'black';
        uncle.color = 'black';
        k.parent.parent.color = 'red';
        k = k.parent.parent;
      } else {
        if (k === k.parent.right) {
          k = k.parent;
          root = leftRotate(root, k);
        }
        k.parent.color = 'black';
        k.parent.parent.color = 'red';
        root = rightRotate(root, k.parent.parent);
      }
    } else {
      let uncle = k.parent.parent.left;
      if (uncle.color === 'red') {
        k.parent.color = 'black';
        uncle.color = 'black';
        k.parent.parent.color = 'red';
        k = k.parent.parent;
      } else {
        if (k === k.parent.left) {
          k = k.parent;
          root = rightRotate(root, k);
        }
        k.parent.color = 'black';
        k.parent.parent.color = 'red';
        root = leftRotate(root, k.parent.parent);
      }
    }
  }
  root.color = 'black';
  return root;
}

export function deleteNode(root, value) {
  let z = searchNode(root, value);
  if (z === NIL || z === null) return root;

  let y = z;
  let yOriginalColor = y.color;
  let x;

  if (z.left === NIL) {
    x = z.right;
    root = transplant(root, z, z.right);
  } else if (z.right === NIL) {
    x = z.left;
    root = transplant(root, z, z.left);
  } else {
    y = treeMinimum(z.right);
    yOriginalColor = y.color;
    x = y.right;
    if (y.parent === z) {
      x.parent = y;
    } else {
      root = transplant(root, y, y.right);
      y.right = z.right;
      y.right.parent = y;
    }
    root = transplant(root, z, y);
    y.left = z.left;
    y.left.parent = y;
    y.color = z.color;
  }

  if (yOriginalColor === 'black') {
    root = fixDelete(root, x);
  }

  return root;
}

function transplant(root, u, v) {
  if (u.parent === NIL || u.parent === null) {
    root = v;
  } else if (u === u.parent.left) {
    u.parent.left = v;
  } else {
    u.parent.right = v;
  }
  v.parent = u.parent;
  return root;
}

function fixDelete(root, x) {
  while (x !== root && x.color === 'black') {
    if (x === x.parent.left) {
      let w = x.parent.right;
      if (w.color === 'red') {
        w.color = 'black';
        x.parent.color = 'red';
        root = leftRotate(root, x.parent);
        w = x.parent.right;
      }
      if (w.left.color === 'black' && w.right.color === 'black') {
        w.color = 'red';
        x = x.parent;
      } else {
        if (w.right.color === 'black') {
          w.left.color = 'black';
          w.color = 'red';
          root = rightRotate(root, w);
          w = x.parent.right;
        }
        w.color = x.parent.color;
        x.parent.color = 'black';
        w.right.color = 'black';
        root = leftRotate(root, x.parent);
        x = root;
      }
    } else {
      let w = x.parent.left;
      if (w.color === 'red') {
        w.color = 'black';
        x.parent.color = 'red';
        root = rightRotate(root, x.parent);
        w = x.parent.left;
      }
      if (w.left.color === 'black' && w.right.color === 'black') {
        w.color = 'red';
        x = x.parent;
      } else {
        if (w.left.color === 'black') {
          w.right.color = 'black';
          w.color = 'red';
          root = leftRotate(root, w);
          w = x.parent.left;
        }
        w.color = x.parent.color;
        x.parent.color = 'black';
        w.left.color = 'black';
        root = rightRotate(root, x.parent);
        x = root;
      }
    }
  }
  x.color = 'black';
  return root;
}

function treeMinimum(x) {
  while (x.left !== NIL) {
    x = x.left;
  }
  return x;
}

export function searchNode(root, value) {
  let current = root;
  while (current !== NIL && current !== null) {
    if (value === current.value) {
      return current;
    } else if (value < current.value) {
      current = current.left;
    } else {
      current = current.right;
    }
  }
  return null;
}

function leftRotate(root, x) {
  let y = x.right;
  x.right = y.left;
  if (y.left !== NIL) {
    y.left.parent = x;
  }
  y.parent = x.parent;
  if (x.parent === NIL || x.parent === null) {
    root = y;
  } else if (x === x.parent.left) {
    x.parent.left = y;
  } else {
    x.parent.right = y;
  }
  y.left = x;
  x.parent = y;
  return root;
}

function rightRotate(root, y) {
  let x = y.left;
  y.left = x.right;
  if (x.right !== NIL) {
    x.right.parent = y;
  }
  x.parent = y.parent;
  if (y.parent === NIL || y.parent === null) {
    root = x;
  } else if (y === y.parent.right) {
    y.parent.right = x;
  } else {
    y.parent.left = x;
  }
  x.right = y;
  y.parent = x;
  return root;
}

export { NIL };

export function searchNodeWithSteps(root, value) {
  let current = root;
  const steps = [];

  while (current !== NIL && current !== null) {
    steps.push(current);
    if (value === current.value) {
      return { found: true, steps };
    } else if (value < current.value) {
      current = current.left;
    } else {
      current = current.right;
    }
  }

  return { found: false, steps };
}

