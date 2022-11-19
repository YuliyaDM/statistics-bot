/* eslint-disable camelcase */
require('dotenv').config();
const { Telegraf } = require('telegraf');
const { Statistics, BadWords } = require('./functions');
const {
  BADWORDS,
  REPLYMARKUP,
  COMMANDS,
  ABOUTCOMMANDS,
  CREATORSIMAGES,
} = require('./secrets');
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

Bot.command('hi', (ctx) => {
  ctx.reply(COMMANDS.hi.greetings);
  ctx.replyWithPhoto(COMMANDS.hi.picture);
});

Bot.command('about', (ctx) => {
  ctx.reply(COMMANDS.about.greetings, { parse_mode: 'MarkdownV2' });
  ctx.reply(COMMANDS.about.invitation, { parse_mode: 'MarkdownV2' });
});

Bot.command('lazymode_v1', (ctx) => {
  ctx.reply(COMMANDS.lazymode_v1, { reply_markup: REPLYMARKUP });
});

Bot.hears(['/activeusers', '/unactiveusers', '/allusers'], (ctx) => {
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

Bot.inlineQuery('team', (ctx) => {
  const results = Object.keys(CREATORSIMAGES).map((el, index) => {
    console.log('parse mode is fucking HTML');
    return {
      type: 'article',
      id: String(index),
      document_file_id: String(index),
      title: CREATORSIMAGES[el].name,
      description: `${CREATORSIMAGES[el].name} is one of the creators.`,
      input_message_content: {
        message_text: CREATORSIMAGES[el].caption,
        parse_mode: 'HTML',
      },
      url: CREATORSIMAGES[el].siteLink,
      thumb_url: CREATORSIMAGES[el].photoLink,
      thumb_width: 500,
      thumb_height: 500,
    };
  });

  ctx.answerInlineQuery(results);
});

Bot.on('message', (ctx) => {
  const { username, first_name, last_name } = ctx.from;
  const fullName = first_name + ' ' + last_name;
  for (let a = 0, members = Object.keys(chatMembers); a < members.length; a++) {
    if (members.indexOf(username) === -1 || members.indexOf(fullName) === -1) {
      chatMembers[username] = 0;
    }
  }
  usersArray.push(username);
});

Bot.launch();
