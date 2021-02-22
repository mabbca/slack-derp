const { App } = require('@slack/bolt');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

sendMessageAsUser = async(client, user, channelId, text) => {
  try {
    await client.chat.postMessage({
      channel: channelId,
      text,
      username: user.username,
      icon_url: user.iconUrl,
    });
  }
  catch (error) {
    console.error(error);
  }
}

derpThatText = (textToDerp) => {
  let newText = '';
  for(let i = 0; i < textToDerp.length; i++) {
    const randomBoolean = !!Math.floor(Math.random() * Math.floor(2));
    if (randomBoolean) {
      newText += textToDerp[i].toUpperCase();
    } else {
      newText += textToDerp[i].toLowerCase();
    }
  }
  return newText;
}

app.command('/derp', async ({ command, ack, say, client }) => {
  await ack();
  const modifiedText = derpThatText(command.text);

  await client.users.profile.get({ user: command.user_id }).then( async (currentUser) => {
    const user = { username: currentUser.profile.real_name, iconUrl: currentUser.profile.image_original };
    sendMessageAsUser(client, user, command.channel_id, modifiedText)
  });

});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();
