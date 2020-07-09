const test = require('tape');

const parse = require('./parseMarkdown');

test('Parse markdown', (t) => {
  const text = `
  # The Word
  
  God is **love**. But he's more than that. He is the <word>.
  God's love cannot be <denied by anyone>, and we need to believe that. <*>
  
  > [1] In the beginning was the Word, and the Word was with God, and the Word was God. [2] He was with God in the beginning. 
  | John | 1 | NIV |
  
  What do you do when the [world](https://example.com) caves in?
  `;
  const expected = [
    {
      marks: [
        {
          element: 'h1'
        }
      ],
      nodes: [
        {
          type: 'text',
          content: 'The Word',
          marks: []
        }
      ],
      type: 'block'
    },
    {
      marks: [
        {
          element: 'p'
        }
      ],
      nodes: [
        {
          type: 'text',
          content: 'God is love. But he\'s more than that. He is the <word>.',
          marks: []
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
      ],
      type: 'block'
    },
    {
      marks: [
        {
          'element': 'blockquote'
        },
        {
          'element': 'p'
        }
      ],
      nodes: [
        {
          type: 'text',
          content: '[1] In the beginning was the Word, and the Word was with God, and the Word was God. [2] He was with God in the beginning.',
          marks: []
        },
        {
          type: 'softbreak',
          content: '',
          marks: []
        },
        {
          type: 'text',
          content: '| John | 1 | NIV |',
          marks: []
        }
      ],
      type: 'block'
    },
    {
      marks: [
        {
          element: 'p'
        }
      ],
      nodes: [
        {
          marks: [],
          nodes: [
            {
              type: 'text',
              content: 'What do you do when the '
            }
          ]
        },
        {
          type: 'text',
          content: 'world',
          marks: [
            {
              element: 'a',
              attrs: {
                href: 'https://example.com'
              }
            }
          ]
        },
        {
          type: 'text',
          content: ' caves in?',
          marks: []
        }
      ],
      type: 'block'
    }
  ];

  const tree = parse(text);

  t.deepEqual(tree, expected);
  t.end();
});
