const cuid = require('cuid');

const parseVerse = require('./parseVerse');
const parseVerseMatter = require('./parseVerseMatter');
const parseLineForNotes = require('./parseLineForNotes');

const TEXT = 'text';
const NOTE = 'note';
const VERSE = 'verse';

const breakLines = (input) => input.split('\n').filter((i) => i).map((i) => i.trim());
const lineHasQuoteCharacter = (line) => line[0] === '>';
const lineHasVerseMatter = (line) => line.split('|').filter((i) => i).length === 3;

module.exports = (input) => {
  const tree = [];
  const lines = breakLines(input);
  let lineNumber = 0;

  while (lineNumber < lines.length) {
    const line = lines[lineNumber];

    if (lineHasQuoteCharacter(line)) {

      if ((lineNumber + 1) === lines.length) {
        tree.push({
          type: TEXT,
          text: line,
          lineBreakAfter: false,
          id: cuid(),
        });

        lineNumber += 1;
        continue;
      }

      const nextLine = lines[lineNumber + 1];
      if (lineHasVerseMatter(nextLine)) {
        const baseVerseMatter = parseVerseMatter(nextLine);
        const verses = parseVerse(line);

        tree.push(...verses.map((verse, idx) => ({
          type: VERSE,
          text: verse.text,
          ref: Object.assign({}, verse.ref, baseVerseMatter),
          lineBreakAfter: idx === (verses.length - 1),
          id: cuid(),
        })));

        lineNumber += 2;
        continue;
      } else {
        tree.push({
          type: TEXT,
          text: line,
          lineBreakAfter: true,
          id: cuid(),
        });

        lineNumber += 1;
        continue;
      }
    }

    const textLine = parseLineForNotes(line);
    tree.push(...textLine.map((t, idx) => Object.assign({}, t, {
      id: cuid(),
      lineBreakAfter: t.type !== NOTE ? idx === (textLine.length - 1) : t.lineBreakAfter,
    })));

    lineNumber += 1;
  }

  if (tree[tree.length - 1].text) {
    return tree;
  }

  return tree.slice(0, -1);
};
