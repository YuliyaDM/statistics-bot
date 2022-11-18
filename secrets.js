const { swears } = require('./swears');

const OURCHATLINK = 'https://t.me/+6RWoidohAtMzNjMy';
const BADWORDSDICTIONARY = swears.join('|');
const BADWORDS = new RegExp(BADWORDSDICTIONARY, 'gmi');
const OURCHATID = -1001866210959;
const ABOUTCOMMANDS = {
  list: [
    { command: '/start', description: 'start bot' },
    { command: '/help', description: 'help command' },
    { command: '/about', description: 'about team' },
    { command: '/activeusers', description: 'sharing active users' },
    { command: '/unactiveusers', description: 'sharing unactive users' },
    { command: '/allusers', description: 'sharing all statistics' },
    { command: '/lazymode_v1', description: 'turning on lazy mode v1' },
  ],
  string: `/help - list of commands.
/about - about this bot.
/start - start this bot.
/allusers - getting all users.
/unactiveusers - getting unactive users.
/activeusers - getting active users.
/team - getting team members.
/hi - getting greetings of bot.`,
  userscommands: {
    '/activeusers': 1,
    '/unactiveusers': -1,
    '/allusers': 0,
  },
};

const COMMANDS = {
  about: {
    greetings: '_*Hi, This bot is created by Miksam, Vadim, Lera and Lijua*_',
    invitation: `*You can [go](${OURCHATLINK}) to our chat, and improve this bot*`,
  },
  start:
    'Hello, my friend! This bot can help you with analysing of messages and getting statistics.',
  lazymode_v1:
    'You tried the new unofficial command! Okay, so now you can choose the command.',
  hi: {
    greetings: 'Hi!',
    picture: 'wallpaperaccess.com/full/1122438.jpg',
  },
};
const REPLYMARKUP = {
  keyboard: [
    [{ text: '/start' }, { text: '/about' }, { text: '/help' }],
    [
      { text: '/unactiveusers' },
      { text: '/activeusers' },
      { text: '/getallusers' },
    ],
    [{ text: '/team' }, { text: '/hi' }],
  ],
  resize_keyboard: true,
};

module.exports = {
  BADWORDS,
  OURCHATID,
  REPLYMARKUP,
  COMMANDS,
  ABOUTCOMMANDS,
};
