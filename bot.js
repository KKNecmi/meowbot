const { execSync } = require('child_process');

function ensurePackage(packageName) {
  try {
    require.resolve(packageName);
  } catch (e) {
    console.log(`[MEOW BOT] Missing package: ${packageName}, installing...`);
    execSync(`npm install ${packageName}`, { stdio: 'inherit' });
  }
}

['mineflayer', 'mineflayer-pathfinder'].forEach(ensurePackage);

const { createBot } = require('mineflayer');
const { pathfinder } = require('mineflayer-pathfinder');
const readline = require('readline');

let bots = [];
let botBaseName = 'meowbot';
let botSize = 1;
let botVersion = '1.21.4';
let lastServer = 'localhost';

// Command List
const commands = [
  { cmd: 'botname', desc: 'Set the base name for bots | Usage: botname <name>' },
  { cmd: 'server', desc: 'Start bots on a server | Usage: server <ip:port>' },
  { cmd: 'version', desc: 'Sets Version For Bots | Usage: version <serverversion>' },
  { cmd: 'botsize', desc: 'Sets Bots Number | Usage: botsize <1-100>' },
  { cmd: 'spam', desc: 'Spams a text number of times simultanuasly | Usage: spam <text> <count>' },
  { cmd: 'botstatus', desc: 'Show bot status (name, server, version, size)' },
  { cmd: 'start', desc: 'Start All bots' },
  { cmd: 'stop', desc: 'Stop all running bots' },
  { cmd: 'exit', desc: 'Exit the bot system' },
];

// Colors
const colors = {
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

console.log(`
${colors.cyan}
  __  __                      ____        _   
 |  \\/  |                    |  _ \\      | |  
 | \\  / | ___  _____      __ | |_) | ___ | |_ 
 | |\\/| |/ _ \\/ _ \\ \\ /\\ / / |  _ < / _ \\| __|
 | |  | |  __/ (_) \\ V  V /  | |_) | (_) | |_ 
 |_|  |_|\\___|\\___/ \\_/\\_/   |____/ \\___/ \\__|
                                             
---------------------------------------------
Type help for command list.
---------------------------------------------
${colors.reset}
`);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.on('line', (input) => {
  const args = input.trim().split(' ');
  const cmd = args[0];

  if (cmd === 'botname') {
    if (!args[1]) {
      console.log(`${colors.green}EXAMPLE:${colors.reset} botname meowbot`);
      return;
    }
    const rawName = args[1];
    const safeName = rawName.replace(/[^a-zA-Z0-9_]/g, '');
    if (safeName.length < 3 || safeName.length > 16) {
      console.log(`Invalid bot name. Must be 3-16 characters (letters, numbers, underscores).`);
      return;
    }
    botBaseName = safeName;
    console.log(`Bot name set to: ${botBaseName}`);
    console.log(`Bot name set to: ${botBaseName}`);
  } else if (cmd === 'botsize') {
    if (!args[1]) {
      console.log(`${colors.green}EXAMPLE:${colors.reset} botsize 5`);
      return;
    }
    const size = parseInt(args[1]);
    if (isNaN(size) || size < 1) {
      console.log("bot size can't be lower than 1");
      return;
    }
    if (size > 100) {
      console.log("bot size can't be higher than 100");
      return;
    }
    botSize = size;
    console.log(`Bot size set to: ${botSize}`);
  } else if (cmd === 'spam') {
    if (args.length < 3) {
      console.log(`${colors.green}EXAMPLE:${colors.reset} spam "Hello there!" 50`);
      return;
    }

    const count = parseInt(args.pop(), 10);
    if (isNaN(count) || count < 1) {
      console.log('Count must be a positive integer.');
      return;
    }

    const message = args.slice(1).join(' ');
    spamChat(message, count);
  } else if (cmd === 'version') {
    if (!args[1]) {
      console.log(`${colors.green}EXAMPLE:${colors.reset} version 1.21.4`);
      return;
    }
    botVersion = args[1];
    console.log(`Bot version set to: ${botVersion}`);
  } else if (cmd === 'server') {
    if (!args[1]) {
      console.log(`${colors.green}EXAMPLE:${colors.reset} server 127.0.0.1:25565`);
      return;
    }
    const [ip, port] = args[1].split(':');
    if (!ip) {
      console.log('Usage: server <ip>[:port]');
      return;
    }
    lastServer = args[1];
    console.log(`Server set to: ${lastServer}`);
  } else if (cmd === 'botstatus') {
    console.log(`${colors.blue}
  ____        _      _____ _        _             
 |  _ \\      | |    / ____| |      | |            
 | |_) | ___ | |_  | (___ | |_ __ _| |_ _   _ ___ 
 |  _ < / _ \\| __|  \\___ \\| __/ _\` | __| | | / __|
 | |_) | (_) | |_   ____) | || (_| | |_| |_| \\__ \\
 |____/ \\___/ \\__| |_____/ \\__\\__,_|\\__|\\__,_|___/
                                                  
${colors.reset}`);
    console.log(`${colors.blue}Bot Name:${colors.reset} ${botBaseName}`);
    if (lastServer) {
      const [host, port] = lastServer.split(':');
      console.log(`${colors.blue}Target:${colors.reset} ${host}${port ? `:${port}` : ''}`);
    } else {
      console.log(`${colors.blue}Target:${colors.reset} Not connected`);
    }
    console.log(`${colors.blue}Bot version:${colors.reset} ${botVersion}`);
    console.log(`${colors.blue}Bot Size:${colors.reset} ${botSize}`);
  } else if (cmd === 'start') {
    if (!lastServer) {
      console.log('No server set. Use: server <ip>[:port]');
      return;
    }
    const [ip, port] = lastServer.split(':');
    startBots(ip, port || '25565', botSize);
  } else if (cmd === 'stop') {
    stopBots();
  } else if (cmd === 'exit') {
    stopBots();
    process.exit(0);
  } else if (cmd === 'help') {
    console.log('Available commands:');
    const maxLen = Math.max(...commands.map((c) => c.cmd.length)) + 2;
    commands.forEach((cmdObj) => {
      const padding = ' '.repeat(maxLen - cmdObj.cmd.length);
      console.log(`${colors.yellow}{${cmdObj.cmd}}${colors.reset}${padding}~ ${cmdObj.desc}`);
    });
  } else {
    console.log('Unknown command. Use help to see available commands.');
  }
});

function startBots(host, port, count = botSize) {
  if (!host) {
    console.log('No host provided. Use the server command first.');
    return;
  }

  let connectedBots = 0;
  const maxBots = count;

  const joinTimer = setInterval(() => {
    if (connectedBots >= maxBots) {
      clearInterval(joinTimer);
      return;
    }

    const botNumber = connectedBots + 1;
    const botName = `${botBaseName}${maxBots > 1 ? botNumber : ''}`;

    const bot = createBot({
      host,
      port: Number(port),
      username: botName,
      version: botVersion,
    });

    bot.loadPlugin(pathfinder);

    bot.once('spawn', () => {
      console.log(`[${bot.username}] Connected to ${host}:${port}`);
    });

    bot.on('kicked', (rawReason) => {
      const reason =
        typeof rawReason === 'string' ? rawReason : rawReason?.text || JSON.stringify(rawReason);

      if (reason.toLowerCase().includes('server is full')) {
        console.log(`[${bot.username}] kicked because server is full – no more bots will join.`);
        clearInterval(joinTimer);
        return;
      }

      console.log(`[${bot.username}] kicked: ${reason}`);
    });

    bot.on('error', (err) => console.log(`[${bot.username}] Error: ${err.message}`));

    bots.push(bot);
    connectedBots++;
  }, 4500); // Join Delay
}

function stopBots() {
  bots.forEach((bot) => bot.quit());
  bots = [];
  console.log('All bots stopped.');
}

function spamChat(message, count) {
  if (bots.length === 0) {
    console.log('No bots are connected.');
    return;
  }

  console.log(`Spamming "${message}" ${count}× with ${bots.length} bot(s)…`);

  const delay = 1000;

  bots.forEach((bot, i) => {
    let sent = 0;
    const interval = setInterval(() => {
      if (sent >= count || !bot.chat) {
        clearInterval(interval);
        return;
      }
      bot.chat(message);
      sent++;
    }, delay + i * 100);
  });
}
