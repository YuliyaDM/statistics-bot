const { BADWORDS } = require("./secrets");

function Statistics(kinda, id, usersArr, chatMemb, Bot) {
  const users = Object.keys(chatMemb);

  for (let a = 0; a < usersArr.length; a++) {
    for (let b = 0; b < users.length; b++) {
      if (users[b] === usersArr[a]) {
        chatMemb[users[b]]++;
      }
    }
  }

  let userAnalytics = "";
  let sortedChatMembers = Object.entries(chatMemb).sort(
    ([, a], [, b]) => b - a
  );

  if (kinda === 1) {
    sortedChatMembers = sortedChatMembers.filter((el) => el[1] !== 0);
  }
  if (kinda === -1) {
    sortedChatMembers = sortedChatMembers.filter((el) => el[1] === 0);
  }

  sortedChatMembers = sortedChatMembers.reduce(
    (r, [k, v]) => ({ ...r, [k]: v }),
    {}
  );

  Object.keys(sortedChatMembers).forEach((el) => {
    userAnalytics += `*${el.replace("_", "\\_")}* \\- ${
      chatMemb[el]
    } messages \n`;
  });

  if (userAnalytics === "") {
    userAnalytics = "There are not any users here\\.";
  }

  Bot.telegram.sendMessage(id, userAnalytics, {
    parse_mode: "MarkdownV2",
    disable_notification: true,
  });

  console.log("does it even work?");
}

function BadWords(ctx) {
  // eslint-disable-next-line camelcase
  const { text } = ctx.update.message;
  const triggers = text.match(BADWORDS).map((el) => el.toLowerCase());
  const matchedTriggers = [...new Set(triggers)]
    .map((el) => {
      return el
        .split("")
        .map((letter, index) => {
          const vowelsRegexp = /[AOEYIUАЕЭОУИЫЯЮ]/gim;
          const lastIndex = el.length - 1;
          const letterVowel = letter.match(vowelsRegexp);
          const vowelEl = el.match(vowelsRegexp);
          if (
            (letterVowel && index > 0 && index < lastIndex) ||
            (vowelEl.length === 1 && letter === vowelEl[0]) ||
            "AaАа".indexOf(letter) !== -1
          ) {
            return "@";
          }
          return letter;
        })
        .join("");
    })
    .join(", ");
  ctx.deleteMessage();
  ctx.reply(
    `You can't use the bad words like ||_*${matchedTriggers}*_|| in the chat\\!`,
    { parse_mode: "MarkdownV2" }
  );
}

module.exports = { Statistics, BadWords };
