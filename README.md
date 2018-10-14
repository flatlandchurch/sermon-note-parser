# Sermon Note Parser

At [Flatland Church](https://flatlandchurch.com) we want to provide our people the ability to take notes during our Sunday morning service as well as online afterward.

One of the challenges we were faced with was a reusable format for notes that can be written like [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) but can contain fill-in notes, spots to take free notes, as well as a special format to indicate Bible verses.

The resulting parser creates a tree with 4 possible node types: `text`, `fill_in`, `note`, and `verse`.

## Note Tree
A note tree node will consist of the following values:

| Property | Description | Present On |
| --- | --- | --- |
| `type` | The type the node belongs to, one of: `text`, `fill_in`, `note`, or `verse`  | `text`, `fill_in`, `note`, `verse` |
| `text` | The content of the node, be it a line of text, the answer to fill-in, or verse content | `text`, `fill_in`, `verse` |
| `lineBreakAfter` | Whether a line break was present in the original document following this node. Always `true` for `note` | `text`, `fill_in`, `note`, `verse` |
| `id` | A unique identifier of each node. This is useful for matching saved user generated data to the document. | `text`, `fill_in`, `note`, `verse` |
| `ref` | Data related to the verse in question. | `verse` |

**Verse Ref**

| Property | Description | 
| --- | --- |
| `book` | The book of the Bible the verse comes from |
| `chapter` | The chapter of the book of the Bible the verse comes from |
| `verse` | The verse of the book of the Bible |
| `version` | The version of the Bible the verse is quoting |

**Example:**

```
[
    {
        type: 'text',
        text: '1. The most important thing to remember is ',
        id: 'abc123',
        lineBreakAfter: false,
    },
    {
        type: 'fill_in',
        text: 'Jesus',
        id: 'abc231',
        lineBreakAfter: false,
    },
    {
        type: 'note',
        id: 'abc312',
        lineBreakAfter: true,
    },
    {
        type: 'verse',
        id: 'abc213',
        lineBreakAfter: true,
        text: 'but whose delight is in the law of the LORD, and who meditates on his law day and night.',
        ref: {
            book: 'Psalm',
            chapter: 1,
            verse: 2,
        },
    },
]
```

## Note Text Format

Our note text format (the input text) is designed to be able to work with standard markdown, so any additions we've created for fill-ins, notes, and verses should not clash with a standard markdown document.

### Fill In
In order to put a fill-in-the-blank note into your text, simply enclose it with angle brackets:

```
1. The most important thing to remember is <Jesus> loves you
```

### Note
Notes can be added anywhere in the document. A note is simply an asterisk (*) enclosed with angle brackets:

```
There are many times throughout the Bible where we see God's in action. <*>
```

Something to note here is that while you are free to use the resulting tree any way you like, for our use case we've made a business rule that notes will always be followed by a line break. Thus the `lineBreakAfter` prop will be set to `true` any time a note is present.

### Verse
Verses are the most complicated of the bunch. In order to get the most bang for your buck you'll need to precede each verse with it's verse number enclosed in square brackets `[14]`. You'll also want to follow up your verse with what we call Verse Matter on the following line: `| Book | Chapter | Version |`. Here's an example:

```
[1] Blessed is the one who does not walk in step with the wicked or stand in the way that sinners take or sit in the company of mockers, [2] but whose delight is in the law of the LORD, and who meditates on his law day and night.
| Psalm | 1 | NIV |
```
