const test = require('tape');
const mock = require('mock-require');

const id = 'abc';
mock('./getId', () => id);

const group = require('./groupTreeByLines');

test('Tree should be grouped by line', (t) => {
  const tree = [
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
    },
  ];

  const expected = [
    {
      type: 'line',
      nodes: [
        {
          type: 'text',
          text: '# The Word',
          id,
          lineBreakAfter: true,
        },
      ],
    },
    {
      type: 'line',
      nodes: [
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
      ],
    },
    {
      type: 'line',
      nodes: [
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
      ],
    },
    {
      type: 'line',
      nodes: [
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
      ],
    },
  ];

  const actual = group(tree);
  t.deepEqual(actual, expected);
  t.end();
});
