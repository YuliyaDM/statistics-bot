const { swears } = require("./swears");

const HIPICTURE = "wallpaperaccess.com/full/1122438.jpg";
const OURCHATLINK = "https://t.me/+6RWoidohAtMzNjMy";
const BADWORDSDICTIONARY = swears.join("|");
const BADWORDS = new RegExp(BADWORDSDICTIONARY, "gmi");
const OURCHATID = -1001866210959;

module.exports = {
  HIPICTURE,
  BADWORDS,
  OURCHATLINK,
  OURCHATID,
};
