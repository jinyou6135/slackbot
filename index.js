require("dotenv").config();

const { App } = require("@slack/bolt");
const axios = require("axios");
const { DiceRoller} = require("rpg-dice-roller");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

// PING COMMAND
app.command("/arctos-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

// HELP COMMAND
app.command("/arctos-help", async ({ command, ack, respond }) => {
    await ack();
    await respond({
        text: 
        `Available Commands:
        /arctos-help - Show this help message
        /arctos-ping - Check the bot\'s latency
        /arctos-catfact - Get a random cat fact
        /arctos-joke - Get a random joke
        /arctos - Learn about me and my namesake!`
    });
});

// CATFACT COMMAND
app.command("/arctos-catfact", async ({ command, ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});

// JOKE COMMAND
app.command("/arctos-joke", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({
      text:
`*Requested Joke:* \n

${response.data.setup}

${response.data.punchline}`
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a joke." });
  }
});

// ARCTOS COMMAND
app.command("/arctos", async ({ command, ack, respond }) => { // this outlines what the bot is (introduces itself) and tells the user about who it is named after!
  await ack();
  await respond({
    text: `Hello <@${command.user_id}>! I am Arctos, your friendly Slack bot!\n
    I am here to assist you with various commands. Type /arctos-help to see what I can do!
    
    I am currently named after the FIRST Robotics Competition team 6135, Arctos, from Toronto, Ontario.
    In the 2026 REBUILT season, team 6135 went 16-17 through two competitions of play. At the Durham 
    District Event, team 6135 won the Judges' Award, and at the McMaster University Event, Arctos won the
    Team Sustainability Award, presented by Dow, for the second time in team history!`
  });
});

// DICEROLL COMMAND
app.command("/arctos-diceroll", async ({ command, ack, respond }) => {
  await ack();

  const roller = new DiceRoller();
  const userNotation = command.text || '1d6';
  try {
    const roll = roller.roll(userNotation);
    await respond({
      text: `*Diceroll*: \n\n<@${command.user_id}> rolled: \`${userNotation}\` \nResult: *${roll.total}* \nDetails: ${roll.output}`
    });
  } catch (error) {
      await respond({ text: "Invalid dice notation. Please use a valid notation (e.g., 1d6, 2d20)." });
  }

});


(async () => {
  await app.start();
  console.log("bot is running!");
})();