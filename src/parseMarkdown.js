const { pick } = require('lodash');
const Markdown = require('markdown-it');

const openRegex = /([a-zA-Z]+)_open/;
const closeRegex = /([a-zA-Z]+)_close/;

const opens = (type) => openRegex.exec(type);
const closes = (type) => closeRegex.exec(type);

const attributesToObject = (attrs) => attrs.reduce((acc, attr) => {
  acc[attr[0]] = attr[1];
  return acc;
}, {});

const parseChildren = (children) => {
  const tree = [];
  const PROPS = ['type', 'content'];

  let i = 0;
  const currentOpenElements = [];

  let enclosingElements = [];
  let enclosedElements = [];

  while (i < children.length) {
    const node = children[i];

    if (opens(node.type)) {
      tree.push({
        marks: [...enclosingElements.reverse()],
        nodes: enclosedElements.map((el) => pick(el, PROPS)),
      });

      enclosedElements = [];

      currentOpenElements.push({
        element: node.tag,
        attrs: node.attrs && attributesToObject(node.attrs),
      });
      i += 1;
      continue;
    }

    if (closes(node.type)) {
      const lastEl = currentOpenElements.pop();
      enclosingElements.push(lastEl);

      if (currentOpenElements.length) {
        i += 1;
        continue;
      } else {
        tree.push(...enclosedElements
          .map((el) => pick(el, PROPS))
          .map((branch) => Object.assign({}, branch, {
            marks: [...enclosingElements.reverse()],
          })));

        enclosedElements = [];
        enclosingElements = [];

        i += 1;
        continue;
      }
    }

    enclosedElements.push(node);

    i += 1;
  }

  if (enclosedElements.length) {
    tree.push(...enclosedElements
      .map((el) => pick(el, PROPS))
      .map((branch) => Object.assign({}, branch, {
        marks: [...enclosingElements.reverse()],
      })));
  }

  return tree;
};

module.exports = (text) => {
  const md = new Markdown();
  const mdTree = md.parse(text, {});
  const elementTree = [];

  let i = 0;
  const currentOpenElements = [];

  let enclosedElements = [];
  let enclosingElements = [];

  while (i < mdTree.length) {
    const node = mdTree[i];

    if (opens(node.type)) {
      currentOpenElements.push({
        element: node.tag,
      });
      i += 1;
      continue;
    }

    if (closes(node.type)) {
      const lastEl = currentOpenElements.pop();
      enclosingElements.push(lastEl);

      if (currentOpenElements.length) {
        i += 1;
        continue;
      } else {
        elementTree.push({
          marks: [...enclosingElements.reverse()],
          nodes: parseChildren(enclosedElements[0].children),
          type: 'block',
        });

        enclosedElements = [];
        enclosingElements = [];

        i += 1;
        continue;
      }
    }

    enclosedElements.push(node);

    i += 1;
  }

  return elementTree;
};