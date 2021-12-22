import NextAuth from 'next-auth';
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi, { LOGIN_URL } from '../../../lib/spotify';

console.log('LOGIN_URL***', LOGIN_URL)

// custom method to refresh access token
async function refreshAccessToken(token) {
  try {
    console.log('REFRESH_ACCESS_TOKEN***', token);
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
    console.log('REFRESHED TOKEN:', refreshedToken);

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000, // 1 hour as 3600 returns from spotify api
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.log('NEXT_AUTH_ERROR:', error);

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_SPOTIFY_CLIENT_ID,
      clientSecret: process.env.NEXT_SPOTIFY_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at * 1000, // expiry times in milliseconds hence * 1000
        };
      }

      // return previous token if the access token has not expired
      if (Date.now() < token.accessTokenExpires) {
        console.log('EXISTING ACCESS TOKEN IS VALID');
        return token;
      }

      // access token has expired, lets refresh it
      console.log('ACCESS TOKEN HAS EXPIRED, REFRESHING...');
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username = token.username;

      return session;
    },
  },
});
