const test = require('tape');

const parseLineForNotes = require('./parseLineForNotes');

test('A line with a single one-word fill in should return a tree with 2 nodes', (t) => {
  const text = `In the beginning was the <word>`;
  const expected = [
    {
      type: 'text',
      text: 'In the beginning was the ',
    },
    {
      type: 'fill_in',
      text: 'word',
    }
  ];

  const tree = parseLineForNotes(text);
  t.deepEqual(tree, expected);
  t.end();
});

test('A line with a one-word fill in and a two word fill in with a note at the end should return a tree with 6 nodes.', (t) => {
  const text = `In the beginning was the <word> and the word <was God>. <*>`;
  const expected = [
    {
      type: 'text',
      text: 'In the beginning was the ',
    },
    {
      type: 'fill_in',
      text: 'word',
    },
    {
      type: 'text',
      text: ' and the word ',
    },
    {
      type: 'fill_in',
      text: 'was God',
    },
    {
      type: 'text',
      text: '. ',
    },
    {
      type: 'note',
      lineBreakAfter: true,
    }
  ];

  const tree = parseLineForNotes(text);
  t.deepEqual(tree, expected);
  t.end();
});
