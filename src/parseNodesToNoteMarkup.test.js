const test = require('tape');

const parse = require('./parseNodesToNoteMarkup');

test('When a block node with a fill in is present, the node is split at the fill in and fill in node added', (t) => {
  const tree = [
    {
      type: 'text',
      content: 'God is love. But he\'s more than that. He is the <word>.',
      marks: [
        {
          element: 'strong',
        }
      ]
    },
    {
      type: 'softbreak',
      content: '',
      marks: []
    },
    {
      type: 'text',
      content: 'God\'s love cannot be <denied by anyone>, and we need to believe that. <*>',
      marks: []
    }
  ];
  const expected = [
    {
      type: 'text',
      content: 'God is love. But he\'s more than that. He is the ',
      marks: [],
    },
    {
      type: 'fill_in',
      content: 'word',
    },
    {
      type: 'text',
      content: '.',
      marks: [],
    },
    {
      type: 'softbreak',
      content: '',
      marks: [],
    },
    {
      type: 'text',
      content: 'God\'s love cannot be ',
      marks: [],
    },
    {
      type: 'fill_in',
      content: 'denied by anyone',
    },
    {
      type: 'text',
      content: ', and we need to believe that. <*>',
      marks: [],
    }
  ];

  const parsedTree = parse(tree);
  t.deepEqual(parsedTree, expected);
  t.end();
});
