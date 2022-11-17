require("dotenv").config();
const { Telegraf } = require("telegraf");
const { HIPICTURE, BADWORDS, OURCHATLINK, OURCHATID } = require("./secrets");
const cron = require("node-cron");
const TOKEN = process.env.TOKEN;

const Bot = new Telegraf(TOKEN);

Bot.telegram.setMyCommands([
  { command: "/start", description: "start bot" },
  { command: "/help", description: "help command" },
  { command: "/about", description: "about team" },
  { command: "/activeusers", description: "sharing active users" },
  { command: "/unactiveusers", description: "sharing unactive users" },
  { command: "/allusers", description: "sharing all statistics" },
  { command: "/lazymode_v1", description: "turning on lazy mode v1" },
]);

let usersObject = [];
const chatMembers = {
  "Miksam_13": 0,
  "vad22": 0,
  "Llairet": 0,
  "quartz555": 0,
  "ju_dio": 0,
};

function Statistics(kinda, ctx) {
  const users = Object.keys(chatMembers);

  for (let a = 0; a < usersObject.length; a++) {
    for (let b = 0; b < users.length; b++) {
      if (users[b] === usersObject[a]) chatMembers[users[b]]++;
    }
  }

  usersObject = [];

  let userAnalytics = "";
  let sortedChatMembers = Object.entries(chatMembers).sort(
    ([, a], [, b]) => b - a
  );

  if (kinda === 1)
    sortedChatMembers = sortedChatMembers.filter((el) => el[1] !== 0);
  if (kinda === -1)
    sortedChatMembers = sortedChatMembers.filter((el) => el[1] === 0);

  sortedChatMembers = sortedChatMembers.reduce(
    (r, [k, v]) => ({ ...r, [k]: v }),
    {}
  );

  Object.keys(sortedChatMembers).forEach((el) => {
    userAnalytics += `*${el.replace("_", "\\_")}* \\- ${
      chatMembers[el]
    } messages \n`;
  });

  if (userAnalytics === "") userAnalytics = "There are not any users here\\.";

  const { id } = ctx.update.message.chat;

  Bot.telegram.sendMessage(id, userAnalytics, {
    parse_mode: "MarkdownV2",
    disable_notification: true,
  });

  console.log("does it even work?");
}

cron.schedule(
  "30 14 * * *",
  () => {
    Statistics(0, OURCHATID);
  },
  {
    scheduled: true,
    timezone: "Europe/Kiev",
  }
);

Bot.command("activeusers", (ctx) => {
  console.log("test");
  Statistics(1, ctx);
});

Bot.command("unactiveusers", (ctx) => {
  Statistics(-1, ctx);
});

Bot.command("allusers", (ctx) => {
  Statistics(0, ctx);
});

Bot.command(["hi", "HI"], async (ctx) => {
  const { id } = ctx.chat;
  await ctx.reply("Hi!");
  await Bot.telegram.sendPhoto(id, HIPICTURE);
});

Bot.command(["about", "ABOUT"], (ctx) =>
  ctx.reply("I haven't added anything here yet.")
);

Bot.command(["team", "TEAM", "Team"], (ctx) => {
  ctx.reply("_*Hi, This bot is created by Miksam, Vadim, Lera and Lijua*_", {
    parse_mode: "MarkdownV2",
  });
  ctx.reply(
    `*You can [go](${OURCHATLINK}) to our chat, and improve this bot*`,
    { parse_mode: "MarkdownV2" }
  );
});

Bot.hears(BADWORDS, async (ctx) => {
  // eslint-disable-next-line camelcase
  const { chat: { id }, message_id, text } = ctx.update.message;
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
          )
            return "@";
          return letter;
        })
        .join("");
    })
    .join(", ");
  await Bot.telegram.deleteMessage(id, message_id);
  await ctx.reply(
    `You can't use the bad words like ||_*${matchedTriggers}*_|| in the chat\\!`,
    { parse_mode: "MarkdownV2" }
  );
});

Bot.start((ctx) =>
  ctx.reply(
    "Hello, my friend! This bot can help you with analysing of messages and getting statistics."
  )
);

Bot.help((ctx) => {
  const commandsList = `/help - list of commands.
/about - about this bot.
/start - start this bot.
/allusers - getting all users.
/unactiveusers - getting unactive users.
/activeusers - getting active users.
/team - getting team members.
/hi - getting greetings of bot.
  `;
  ctx.reply(commandsList);
});

Bot.command("lazymode_v1", (ctx) => {
  const { id } = ctx.update.message.chat;
  Bot.telegram.sendMessage(
    id,
    "You tried the new unofficial command! Okay, so now you can choose the command.",
    {
      reply_markup: {
        keyboard: [
          [{ text: "/start" }, { text: "/about" }, { text: "/help" }],
          [
            { text: "/unactiveusers" },
            { text: "/activeusers" },
            { text: "/getallusers" },
          ],
          [{ text: "/team" }, { text: "/hi" }],
        ],
        resize_keyboard: true,
      },
    }
  );
});

Bot.on("message", async (ctx) => {
  const { userName } = ctx.from;
  for (let a = 0, members = Object.keys(chatMembers); a < members.length; a++) {
    if (members.indexOf(userName) === -1) chatMembers[userName] = 0;
  }
  usersObject.push(userName);
});

Bot.launch();
