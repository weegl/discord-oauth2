const DiscordOauth2 = require('../src/index');

const discordOauth2 = new DiscordOauth2({
    clientId: 'clientId',
    clientSecret: 'clientSecret',
    scope: 'email identify guilds',
    grantType: 'authorization_code',
    redirectUri: 'http://localhost:3000/callback',
});

const redirectUri = 'http://localhost:3000/callback';

const authorizationLink = discordOauth2.generateAuthorizeURL(redirectUri);
console.log('Authorization Link:', authorizationLink);

(async () => {
    try {
        const tokens = await discordOauth2.getToken('code');
        console.log(tokens);

        const user = await discordOauth2.getUser(tokens.access_token);
        console.log(user);

        const guilds = await discordOauth2.getGuilds(tokens.access_token, {
            withCounts: true
        });
        console.log(guilds);
    } catch (error) {
        console.log(error);
    }
})();