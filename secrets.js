const fs = require("fs");

const PICTURE1 = "wallpaperaccess.com/full/1122438.jpg";
const BADWORDSDICTIONARY = JSON.parse(fs.readFileSync("swears.json")).join("|");
const BADWORDS = new RegExp(BADWORDSDICTIONARY, "gmi");

module.exports = {
    PICTURE1: PICTURE1,
    BADWORDS: BADWORDS,
}