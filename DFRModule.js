// DFRModule.js
const axios = require('axios');

class DFRClient {
  constructor({ username, password, clientSecret }) {
    this.tokenURL = 'https://molex.convergenceds.com/DFRAuthMolex/identity/connect/token';
    this.apiURL   = 'https://molex.convergenceds.com/DFRWebAPI_Molex/api/Molex%20Production/DfrWebApi/';
    this.creds    = { username, password, clientSecret };
    this.auth     = null;
    this.expiry   = 0;
  }

  async _fetchToken() {
    const now = Date.now();
    if (this.auth && now < this.expiry) return this.auth;

    const params = new URLSearchParams({
      username:      this.creds.username,
      password:      this.creds.password,
      grant_type:    'password',
      scope:         'dfrwebapi',
      client_id:     'dfrwebapi',
      client_secret: this.creds.clientSecret
    });

    const resp = await axios.post(this.tokenURL, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    const { token_type, access_token, expires_in } = resp.data;
    this.auth   = `${token_type} ${access_token}`;
    this.expiry = now + (expires_in - 30) * 1000;
    return this.auth;
  }

  async getItem(itemNumber, revision = 'A', qualifier = 'Part.0') {
    const auth = await this._fetchToken();
    const resp = await axios.post(
      this.apiURL + 'GetItem',
      { ItemNumber: itemNumber, Revision: revision, Qualifier: qualifier },
      { headers: { 'Content-Type': 'application/json', Authorization: auth } }
    );
    return resp.data;
  }
}

module.exports = DFRClient;
