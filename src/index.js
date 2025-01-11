const { Endpoints } = require("./Constants");

/**
 * @typedef {Object} DiscordOauth2Options
 * @property {string} clientId - The client ID of your Discord application
 * @property {string} clientSecret - The client secret of your Discord application
 * @property {string} scope - The OAuth2 scopes to request
 * @property {string} grantType - The OAuth2 grant type
 * @property {string} redirectUri - The redirect URI for the OAuth2 flow
 */

/**
 * @typedef {Object} GetGuildsOptions
 * @property {boolean} [withCounts] - Whether to include approximate member and presence counts
 */

class DiscordOauth2 {
    /**
     * @param {DiscordOauth2Options} options
     */
    constructor(options) {
        this.clientId = options.clientId;
        this.clientSecret = options.clientSecret;
        this.scope = options.scope;
        this.grantType = options.grantType;
        this.redirectUri = options.redirectUri;
    }

    /**
     * @param {string} [redirectUri] - Optional redirect URI that overrides the default one
     * @returns {string} The authorization URL
     */
    generateAuthorizeURL(redirectUri) {
        const redirect = 'https://discord.com/api/oauth2/authorize?';

        const query = new URLSearchParams({
            'client_id': this.clientId,
            'redirect_uri': redirectUri || this.redirectUri,
            'response_type': 'code',
            'scope': this.scope
        })

        return redirect + query.toString();
    }

    /**
     * @param {string} code - The authorization code
     * @param {string} [redirectUri] - Optional redirect URI that overrides the default one
     * @returns {Promise<Object>} The OAuth2 tokens
     */
    async getToken(code, redirectUri) {
        return fetch(Endpoints.token, {
            'method': 'POST',
            'headers': {
                'Accept': 'application/json'
            },
            'body': new URLSearchParams({
                'client_id': this.clientId,
                'client_secret': this.clientSecret,
                'code': code,
                'redirect_uri': redirectUri || this.redirectUri,
                'grant_type': this.grantType
            })
        }).then(async (response) => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw response;
            }
        });
    }

    /**
     * @param {string} accessToken - The OAuth2 access token
     * @returns {Promise<Object>} The user object
     */
    async getUser(accessToken) {
        return fetch(Endpoints.user, {
            'headers': {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw response;
            }
        });
    }

    /**
     * @param {string} accessToken - The OAuth2 access token
     * @param {GetGuildsOptions} [options={}] - Options for the guild request
     * @returns {Promise<Array<Object>>} Array of guild objects
     */
    async getGuilds(accessToken, options = {}) {
        const query = new URLSearchParams({});

        if (options.withCounts) {
            query.append('with_counts', true);
        }

        return fetch(`${Endpoints.guilds}?${query.toString()}`, {
            'headers': {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw response;
            }
        });
    }
}

module.exports = DiscordOauth2;