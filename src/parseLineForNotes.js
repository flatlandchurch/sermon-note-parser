const FILL_IN = 'fill_in';
const TEXT = 'text';
const NOTE = 'note';

module.exports = (line) => {
  const response = [];

  let currentWord = '';
  let parsingFillIn = false;
  let char = 0;

  while (char < line.length) {
    const v = line[char];

    const isNoteChar = v === '*' && parsingFillIn;

    const prevExists = (char - 1) >= 0;
    const nextExists = (char + 1) < line.length;

    const prevCharIsNoteEnclosure = prevExists && line[char - 1] === '<';
    const nextCharIsNoteEnclosue = nextExists && line[char + 1] === '>';

    if (v === '<') {
      parsingFillIn = true;

      response.push({
        type: TEXT,
        text: currentWord,
      });

      currentWord = '';

      char += 1;
      continue;
    }

    if (isNoteChar && prevCharIsNoteEnclosure && nextCharIsNoteEnclosue) {
      response.push({
        type: NOTE,
        lineBreakAfter: true,
      });

      char += 2;
      continue;
    }

    if (v === '>' && parsingFillIn) {
      parsingFillIn = false;

      response.push({
        type: FILL_IN,
        text: currentWord,
      });

      currentWord = '';

      char += 1;
      continue;
    }

    currentWord += v;

    char += 1;
  }

  if (currentWord) {
    response.push({
      type: parsingFillIn ? FILL_IN : TEXT,
      text: currentWord,
    });
  }

  return response;
};
