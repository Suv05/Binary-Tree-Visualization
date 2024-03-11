
// Represents the node in the tree. Will be displayed as a small circle in the browser.
// x, y --> x, y co-ordinates of the center of circle
// r    --> radius of the circle
// ctx  --> context of the canvas
// data --> data to be displayed (Only number)

class Node {
  constructor(x, y, r, ctx, data) {
    // left child of a node
    this.leftNode = null;
    // right child of a node
    this.rightNode = null;

    // draw function-for drawing the node
    this.draw = function () {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.closePath();
      ctx.strokeText(data, x, y);
    };

    //getters
    this.getData = function () { return data; };
    this.getX = function () { return x; };
    this.getY = function () { return y; };
    this.getRadius = function () { return r; };

    // Returns coordinate for the left child
    // Go back 3 times radius in x axis and 
    // go down 3 times radius in y axis
    this.leftCoordinate = function () {
      return { cx: (x - (3 * r)), cy: (y + (3 * r)) };
    };
    // Same as above but for right child        
    this.rightCoordinate = function () {
      return { cx: (x + (3 * r)), cy: (y + (3 * r)) };
    };
  }
}

// Draws a line from one circle(node) to another circle (node) 
class Line {
  constructor() {
    // Takes 
    // x,y      - starting x,y coordinate
    // toX, toY - ending x,y coordinate
    this.draw = function (x, y, toX, toY, r, ctx) {
      let moveToX = x;
      let moveToY = y + r;
      let lineToX = toX;
      let lineToY = toY - r;
      ctx.beginPath();
      ctx.moveTo(moveToX, moveToY);
      ctx.lineTo(lineToX, lineToY);
      ctx.stroke();
    };
  }
}

// Represents the btree logic
class BTree {
  constructor() {
    let c = document.getElementById('my-canvas');
    let ctx = c.getContext('2d');
    let line = new Line();
    this.root = null;

    let self = this;

    // Getter for root
    this.getRoot = function () { return this.root; };

    // Adds element to the tree
    this.add = function (data) {
      // If root exists, then recursively find the place to add the new node
      if (this.root) {
        this.recursiveAddNode(this.root, null, null, data);
      } else {
        // If not, the add the element as a root 
        this.root = this.addAndDisplayNode(200, 20, 15, ctx, data);
        return;
      }
    };
    // Recurively traverse the tree and find the place to add the node
    this.recursiveAddNode = function (node, prevNode, coordinateCallback, data) {
      if (!node) {
        // This is either node.leftCoordinate or node.rightCoordinate
        let xy = coordinateCallback();
        let newNode = this.addAndDisplayNode(xy.cx, xy.cy, 15, ctx, data);
        line.draw(prevNode.getX(), prevNode.getY(), xy.cx, xy.cy, prevNode.getRadius(), ctx);
        return newNode;
      }
      else {
        if (data <= node.getData()) {
          node.left = this.recursiveAddNode(node.left, node, node.leftCoordinate, data);
        }
        else {
          node.right = this.recursiveAddNode(node.right, node, node.rightCoordinate, data);
        }
        return node;
      }
    };

    // Adds the node to the tree and calls the draw function
    this.addAndDisplayNode = function (x, y, r, ctx, data) {
      let node = new Node(x, y, r, ctx, data);
      node.draw();
      return node;
    };
    this.remove = function (data) {
      this.root = this.recursiveRemoveNode(this.root, data);
    };

    this.recursiveRemoveNode = function (node, data) {
      if (!node) {
        return null; // Value not found
      }
      
      if (data === node.getData()) {
        // Node found, now remove it
        if (!node.leftNode && !node.rightNode) {
          // Case 1: Node has no children
          return null;
        } else if (!node.leftNode) {
          // Case 2: Node has only right child
          return node.rightNode;
        } else if (!node.rightNode) {
          // Case 3: Node has only left child
          return node.leftNode;
        } else {
          // Case 4: Node has both children
          let minRightNode = this.findMin(node.rightNode);
          node.data = minRightNode.data;
          node.rightNode = this.recursiveRemoveNode(node.rightNode, minRightNode.data);
          return node;
        }
      } else if (data < node.getData()) {
        // Search in the left subtree
        node.leftNode = this.recursiveRemoveNode(node.leftNode, data);
      } else {
        // Search in the right subtree
        node.rightNode = this.recursiveRemoveNode(node.rightNode, data);
      }
      
      return node;
    };

    this.findMin = function (node) {
      while (node.leftNode) {
        node = node.leftNode;
      }
      return node;
    };
    
  }
}
/////////////////////////////////
let addToTree = function() {
  input = document.getElementById('tree-input');
  value = parseInt(input.value);
  if(value)
    btree.add(value);
  else
    alert("Wrong input");
};
/////////////////////////////////
let btree = new BTree();

////////////////////////////////
let removeToTree = function() {
  let input = document.getElementById('tree-input');
  let value = parseInt(input.value);
  
  if (value) {
    btree.remove(value);
  } else {
    alert("Wrong input");
  }
};
