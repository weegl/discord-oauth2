# Discord OAuth2

A simple Discord OAuth2 client implementation.

## Installation

```bash
npm install @weegl/discord-oauth2
```

## Usage

### Initialize the client

```javascript
const DiscordOauth2 = require('@weegl/discord-oauth2');

const oauth = new DiscordOauth2({
    clientId: 'YOUR_CLIENT_ID',
    clientSecret: 'YOUR_CLIENT_SECRET',
    redirectUri: 'http://localhost:3000/callback',
    scope: 'identify guilds',
    grantType: 'authorization_code'
});
```

### Generate Authorization URL

```javascript
// Use default redirectUri from constructor
const url = oauth.generateAuthorizeURL();

// Or specify a different redirectUri
const url = oauth.generateAuthorizeURL('http://localhost:3000/different-callback');
```

### Get Access Token

```javascript
try {
    // Use default redirectUri from constructor
    const tokenData = await oauth.getToken('authorization_code_here');
    
    // Or specify a different redirectUri
    const tokenData = await oauth.getToken('authorization_code_here', 'http://localhost:3000/different-callback');
} catch (error) {
    console.error('Failed to get token:', error);
}
```

### Get User Data

```javascript
try {
    const userData = await oauth.getUser('access_token_here');
    console.log(userData);
} catch (error) {
    console.error('Failed to get user:', error);
}
```

### Get User's Guilds

```javascript
try {
    // Get guilds without member counts
    const guilds = await oauth.getGuilds('access_token_here');
    
    // Get guilds with member counts
    const guildsWithCounts = await oauth.getGuilds('access_token_here', { withCounts: true });
    
    console.log(guilds);
} catch (error) {
    console.error('Failed to get guilds:', error);
}
```

## API Reference

### Constructor Options

```typescript
interface DiscordOauth2Options {
    clientId: string;      // Your Discord application client ID
    clientSecret: string;  // Your Discord application client secret
    scope: string;        // Space-separated list of OAuth2 scopes
    grantType: string;    // OAuth2 grant type (usually 'authorization_code')
    redirectUri: string;  // Your callback URL
}
```

### Methods

- `generateAuthorizeURL()`: Generates the Discord authorization URL
- `getToken(code)`: Exchanges authorization code for access token
- `getUser(accessToken)`: Gets the user data using access token
- `getGuilds(accessToken, options?)`: Gets user's guilds, optionally with member counts

## Security

- Never expose your client secret
- Use environment variables for sensitive data
- Validate all redirect URIs

## License

MIT License - Copyright (c) 2025 Weegl