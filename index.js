require("dotenv").config();
const { Telegraf } = require("telegraf");
const { Statistics, BadWords } = require("./functions");
const { BADWORDS, REPLYMARKUP, COMMANDS, ABOUTCOMMANDS } = require("./secrets");
const TOKEN = process.env.TOKEN;

const Bot = new Telegraf(TOKEN);

Bot.telegram.setMyCommands(ABOUTCOMMANDS.list);

// eslint-disable-next-line prefer-const
let usersArray = [];
const chatMembers = {
  Miksam_13: 0,
  vad22: 0,
  Llairet: 0,
  quartz555: 0,
  ju_dio: 0,
};

Bot.start((ctx) => {
  ctx.reply(COMMANDS.start);
});

Bot.help((ctx) => {
  ctx.reply(ABOUTCOMMANDS.string);
});

Bot.command("hi", (ctx) => {
  ctx.reply(COMMANDS.hi.greetings);
  ctx.replyWithPhoto(COMMANDS.hi.picture);
});

Bot.command("about", (ctx) => {
  ctx.reply(COMMANDS.about.greetings, { parse_mode: "MarkdownV2" });
  ctx.reply(COMMANDS.about.invitation, { parse_mode: "MarkdownV2" });
});

Bot.command("lazymode_v1", (ctx) => {
  ctx.reply(COMMANDS.lazymode_v1, { reply_markup: REPLYMARKUP });
});

Bot.hears(["/activeusers", "/unactiveusers", "/allusers"], (ctx) => {
  const { text } = ctx.message;
  const { id } = ctx.update.message.chat;
  Statistics(
    ABOUTCOMMANDS.userscommands[text],
    id,
    usersArray,
    chatMembers,
    Bot
  );
  usersArray = [];
});

Bot.hears(BADWORDS, (ctx) => {
  BadWords(ctx);
});

Bot.on("message", (ctx) => {
  const { username } = ctx.from;
  for (let a = 0, members = Object.keys(chatMembers); a < members.length; a++) {
    if (members.indexOf(username) === -1) {
      chatMembers[username] = 0;
    }
  }
  usersArray.push(username);
});

Bot.launch();
