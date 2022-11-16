require("dotenv").config();
const { Telegraf } = require("telegraf");
const { HIPICTURE, BADWORDS } = require("./secrets");
const cron = require("node-cron");
const TOKEN = process.env.TOKEN;

const Bot = new Telegraf(TOKEN);

Bot.telegram.setMyCommands([
  { command: "/start", description: "start bot" },
  { command: "/help", description: "help command" },
  { command: "/about", description: "about team" },
  { command: "/activeusers", description: "sharing active users" },
  { command: "/unactiveusers", description: "sharing unactive users" },
  { command: "/getallusers", description: "sharing all statistics" },
  { command: "/lazymode_v1", description: "turning on lazy mode v1" },
]);

let usersObject = [];
const chatMembers = {
  Miksam: 0,
  Вадим: 0,
  Valeria: 0,
  "Богдан Гришин": 0,
  Lijua: 0,
};

function Statistics(kinda) {
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

  Object.keys(sortedChatMembers).map((el) => {
    userAnalytics += `${el} - ${chatMembers[el]} messages \n`;
    return el;
  });

  if (!userAnalytics) return "There are not any users here.";

  return userAnalytics;
}

cron.schedule(
  "30 14 * * *",
  () => {
    const chatId = -1001866210959;
    const result = Statistics(0);

    Bot.telegram.sendMessage(chatId, result);
  },
  {
    scheduled: true,
    timezone: "Europe/Kiev",
  }
);

Bot.command("activeusers", (ctx) => {
  const result = Statistics(1);
  ctx.reply(result);
});

Bot.command("unactiveusers", (ctx) => {
  const result = Statistics(-1);
  ctx.reply(result);
});

Bot.command("getallusers", (ctx) => {
  const result = Statistics(0);
  ctx.reply(result);
});

Bot.command(["hi", "HI"], async (ctx) => {
  await ctx.reply("Hi!");
  await Bot.telegram.sendPhoto(ctx.chat.id, HIPICTURE);
});

Bot.command(["about", "ABOUT"], (ctx) =>
  ctx.reply("I haven't added anything here yet.")
);

Bot.command(["team", "TEAM", "Team"], (ctx) => {
  ctx.reply("_*Hi, This bot is created by Miksam, Vadim, Lera and Lijua*_", {
    parse_mode: "MarkdownV2",
  });
  ctx.reply(
    "*You can [go](https://t.me/+6RWoidohAtMzNjMy) to our chat, and improve this bot*",
    { parse_mode: "MarkdownV2" }
  );
});

Bot.hears(BADWORDS, async (ctx) => {
  const chatId = ctx.update.message.chat.id;
  const messageId = ctx.update.message.message_id;
  const messageText = ctx.update.message.text;
  const triggers = messageText.match(BADWORDS).map((el) => el.toLowerCase());
  await Bot.telegram.deleteMessage(chatId, messageId);
  await ctx.reply(
    `You can't use the bad words like ||_*${[...new Set(triggers)].join(
      ", "
    )}*_|| in the chat\\!`,
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
  const chatId = ctx.update.message.chat.id;
  Bot.telegram.sendMessage(
    chatId,
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

Bot.on("message", (ctx) => {
  const userName = ctx.from.first_name;
  for (let a = 0, members = Object.keys(chatMembers); a < members.length; a++) {
    if (members.indexOf(userName) === -1) chatMembers[userName] = 0;
  }
  usersObject.push(userName);
});

Bot.launch();
