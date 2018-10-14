module.exports = (line) => {
  const refs = line.split('|').filter((i) => i).map((l) => l.trim());
  return {
    book: refs[0],
    chapter: refs[1],
    version: refs[2],
  };
};
