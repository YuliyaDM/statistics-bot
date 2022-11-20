/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
require('dotenv').config();
const { Telegraf } = require('telegraf');
const { Statistics, BadWords, CheckChatMembers } = require('./functions');
const {
  BADWORDS,
  REPLYMARKUP,
  COMMANDS,
  ABOUTCOMMANDS,
  CREATORSIMAGES,
  TIMEFORWAITING,
} = require('./secrets');
const TOKEN = process.env.TOKEN;

const Bot = new Telegraf(TOKEN);

Bot.telegram.setMyCommands(ABOUTCOMMANDS.list);

// eslint-disable-next-line prefer-const
let usersArray = [];
let chatMembers = {
  'Miksam_13': 0,
  'vad22': 0,
  'Llairet': 0,
  'quartz555': 0
};

Bot.start((ctx) => {
  ctx.replyWithChatAction('typing');
  setTimeout(() => ctx.reply(COMMANDS.start), TIMEFORWAITING);
});

Bot.help((ctx) => {
  ctx.replyWithChatAction('typing');
  setTimeout(() => ctx.reply(ABOUTCOMMANDS.string), TIMEFORWAITING);
});

Bot.command('hi', (ctx) => {
  ctx.replyWithChatAction('upload_photo');
  setTimeout(() => {
    ctx.replyWithPhoto(COMMANDS.hi.picture);
    ctx.reply(COMMANDS.hi.greetings);
  }, TIMEFORWAITING);
});

Bot.command('about', (ctx) => {
  ctx.replyWithChatAction('typing');
  setTimeout(() => {
    ctx.reply(COMMANDS.about.greetings, { parse_mode: 'MarkdownV2' });
    ctx.reply(COMMANDS.about.invitation, { parse_mode: 'MarkdownV2' });
  }, TIMEFORWAITING);
});

Bot.command('lazymode_v1', (ctx) => {
  ctx.replyWithChatAction('typing');
  setTimeout(() => {
    ctx.reply(COMMANDS.lazymode_v1, { reply_markup: REPLYMARKUP });
  }, TIMEFORWAITING);
});

Bot.hears(['/activeusers', '/unactiveusers', '/allusers'], (ctx) => {
  const { text } = ctx.message;
  const { id } = ctx.update.message.chat;
  ctx.replyWithChatAction('typing');
  setTimeout(() => {
    Statistics(
      ABOUTCOMMANDS.userscommands[text],
      id,
      usersArray,
      chatMembers,
      Bot
    );
    usersArray = [];
  }, TIMEFORWAITING);
});

Bot.inlineQuery('team', (ctx) => {
  const results = Object.keys(CREATORSIMAGES).map((el, index) => {
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

Bot.hears('remove keyboard', (ctx) => {
  const { first_name } = ctx.update.message.from;
  setTimeout(() => {
    ctx.reply(`Reply keyboard for ${first_name} is removed!`, {
      reply_markup: {
        remove_keyboard: true,
      },
    });
  }, TIMEFORWAITING);
});

Bot.hears(BADWORDS, (ctx) => {
  ctx.replyWithChatAction('typing');
  setTimeout(() => BadWords(ctx), TIMEFORWAITING * 2);
});

Bot.use((ctx) => {
  const { username, last_name, first_name } = ctx.from;
  const fullName = first_name + ' ' + last_name;

  chatMembers = CheckChatMembers(ctx, chatMembers);

  if (!username) usersArray.push(fullName);
  else usersArray.push(username);
});

Bot.launch();
