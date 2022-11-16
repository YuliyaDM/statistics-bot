const { swears } = require('./swears')

const HIPICTURE = 'wallpaperaccess.com/full/1122438.jpg'
const BADWORDSDICTIONARY = swears.join('|')
const BADWORDS = new RegExp(BADWORDSDICTIONARY, 'gmi')

module.exports = {
  HIPICTURE,
  BADWORDS
}
