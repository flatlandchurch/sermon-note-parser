const { cloneDeep } = require('lodash');

module.exports = (line) => {
  const verses = [];
  const regexpr = /\[([\d]*)]/;
  let wordNumber = 0;

  const cleanedLine = line.replace(/>/g, '').trim();

  const words = cleanedLine.split(' ');

  let verse = {};

  while (wordNumber < words.length) {
    const word = words[wordNumber];
    const test = regexpr.exec(word);

    if (test) {
      if (verse.text) {
        verses.push(cloneDeep(verse));
        verse = {};
        verse.ref = { verse: test[1] };

        wordNumber += 1;
        continue;
      } else {
        verse.ref = { verse: test[1] };

        wordNumber += 1;
        continue;
      }
    }

    const text = verse.text || [];

    verse.text = [...text, word];

    wordNumber += 1;
  }

  verses.push(verse);

  return verses.map((v) => ({
    ref: v.ref,
    text: v.text.join(' '),
  }));
};
