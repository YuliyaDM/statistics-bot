const SWEARSLIST = [
  "suka",
  "blyat",
  "hui",
  "pizda",
  "objebaniy",
  "pizdodrochilnik",
  "сука",
  "блять",
  "скотиняка",
];

const RESULT = SWEARSLIST.map((el) => {
  const vowels = "AEOIUYАОУЕЭИЫЮЯ";
  return el
    .split("")
    .map((letter, index) => {
      const lastIndex = el.length - 1;
      // eslint-disable-next-line yoda
      if (
        vowels.indexOf(letter.toUpperCase()) > -1 &&
        index > 0 &&
        index < lastIndex
      )
        return "@";
      return letter;
    })
    .join("");
});

console.log(RESULT);
