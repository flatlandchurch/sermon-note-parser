const { cloneDeep } = require('lodash');

module.exports = (tree) => {
  const response = [];

  let currentLine = [];

  tree.forEach((node) => {
    currentLine.push(node);

    if (node.lineBreakAfter) {
      response.push({
        type: 'line',
        nodes: cloneDeep(currentLine),
      });
      currentLine = [];
    }
  });

  if (currentLine.length) {
    response.push({
      type: 'line',
      nodes: cloneDeep(currentLine),
    });
  }

  return response;
};
