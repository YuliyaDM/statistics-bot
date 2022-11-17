const SWEARSLIST = ["suka", "blyat", "hui", "pizda", "objebaniy", "pizdodrochilnik", "сука", "блять", "скотиняка"];

// suka -> s@ka; blyat - bl@@t; hui - h@i; pizda - p@zda, objectbaniy - ob@@ban@y; pizdodrochilnik - p@zd@dr@ch@ln@k

const RESULT =  SWEARSLIST.map(el => {
    const vowels = "AEOIUYАОУЕЭИЫЮЯ";
    return el
    .split("")
    .map((letter, index) => {
        const lastIndex = el.length - 1;
        // eslint-disable-next-line yoda
        if (vowels.indexOf(letter.toUpperCase()) > -1 && (0 < index && index < lastIndex) ) return "@";
        return letter;
    })
    .join("")
})

console.log(RESULT)