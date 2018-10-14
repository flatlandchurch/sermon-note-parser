const test = require('tape');
const mock = require('mock-require');

const id = 'abc';
mock('getId', () => id);

const parseToTree = require('./parseToTree');

test('When a line has a quote but no further lines, the quote is added as text', (t) => {
  const text = `> Hello world.`;
  const tree = parseToTree(text);

  t.equal(tree.length, 1, 'There should be only one thing in the tree');
  t.equal(tree[0].type, 'text', 'The branch should be of text type');
  t.false(tree[0].lineBreakAfter, 'There should be no line break after');

  t.end();
});

test('When a line has a verse with verse matter, the tree will have verse nodes', (t) => {
  const text = `
  > [1] In the beginning was the Word, and the Word was with God, and the Word was God. [2] He was with God in the beginning. 
  | John | 1 | NIV |
  `;

  const expected = [
    {
      type: 'verse',
      text: 'In the beginning was the Word, and the Word was with God, and the Word was God.',
      ref: { verse: '1', book: 'John', chapter: '1', version: 'NIV' },
      lineBreakAfter: false,
      id,
    },
    {
      type: 'verse',
      text: 'He was with God in the beginning.',
      ref: { verse: '2', book: 'John', chapter: '1', version: 'NIV' },
      lineBreakAfter: true,
      id,
    },
  ];

  const tree = parseToTree(text);

  t.deepEqual(tree, expected);
  t.end();
});

test('A full demo', (t) => {
  const text = `
  # The Word
  God is love. But he's more than that. He is the <word>.
  God's love cannot be <denied by anyone>, and we need to believe that. <*>
  > [1] In the beginning was the Word, and the Word was with God, and the Word was God. [2] He was with God in the beginning. 
  | John | 1 | NIV |
  `;
  const expected = [
    {
      type: 'text',
      text: '# The Word',
      id,
      lineBreakAfter: true,
    },
    {
      type: 'text',
      text: 'God is love. But he\'s more than that. He is the ',
      id,
      lineBreakAfter: false,
    },
    {
      type: 'fill_in',
      text: 'word',
      id,
      lineBreakAfter: false,
    },
    {
      type: 'text',
      text: '.',
      id,
      lineBreakAfter: true,
    },
    {
      type: 'text',
      text: 'God\'s love cannot be ',
      id,
      lineBreakAfter: false,
    },
    {
      type: 'fill_in',
      text: 'denied by anyone',
      id,
      lineBreakAfter: false,
    },
    {
      type: 'text',
      text: ', and we need to believe that. ',
      id,
      lineBreakAfter: false,
    },
    {
      type: 'note',
      id,
      lineBreakAfter: true,
    },
    {
      type: 'verse',
      ref: {
        chapter: '1',
        verse: '1',
        book: 'John',
        version: 'NIV',
      },
      text: 'In the beginning was the Word, and the Word was with God, and the Word was God.',
      id,
      lineBreakAfter: false,
    },
    {
      type: 'verse',
      ref: {
        chapter: '1',
        verse: '2',
        book: 'John',
        version: 'NIV',
      },
      text: 'He was with God in the beginning.',
      id,
      lineBreakAfter: true,
    }
  ];

  const tree = parseToTree(text);
  t.deepEqual(tree, expected);
  t.end();
});
