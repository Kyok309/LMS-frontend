import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

async function refreshAccessToken(token) {
  try {
    const res = await fetch(
      "http://localhost:8000/api/method/frappe.integrations.oauth2.get_token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: token.refreshToken,
          client_id: process.env.FRAPPE_CLIENT_ID,
          client_secret: process.env.FRAPPE_CLIENT_SECRET,
        }),
      }
    );

    const refreshed = await res.json();
    console.log("REFRESH RESULT: ", refreshed);

    if (!res.ok || !refreshed?.access_token) {
      throw refreshed;
    }

    return {
      ...token,
      accessToken: refreshed.access_token,
      expiresIn: Date.now() + refreshed.expires_in * 1000,
      refreshToken: refreshed.refresh_token ?? token.refreshToken,
      error: null,
    };
  } catch (error) {
    console.error("Refresh Token Error", error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
 
export const { auth, handlers, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          const res = await fetch("http://localhost:8000/api/method/lms_app.api.auth.login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          const response = await res.json();

          console.log("Login API result:", response);

          if (response?.responseType === "ok" && response?.data?.access_token) {
            return {
              accessToken: response.data.access_token,
              refreshToken: response.data.refresh_token,
              expiresIn: Date.now() + response.data.expires_in * 1000,
              roles: response.data.roles,
              user: response.data.user
            };
          }
          return response.desc;
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
    
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.expiresIn = user.expiresIn;
        token.roles = user.roles;
        token.user = user.user;
        return token;
      }
      
      const now = Date.now();
      const timeUntilExpiry = token.expiresIn - now;
      const bufferTime = 60 * 1000; // 60 seconds
      
      if (timeUntilExpiry < bufferTime) {
        console.log(`Token expiring in ${timeUntilExpiry / 1000}s, refreshing now...`);
        return await refreshAccessToken(token);
      }

      return token;
    },

    async session({ session, token }) {
      if (token.error) {
        throw new Error(token.error);
      }
      
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.expiresIn = token.expiresIn;
      session.user.roles = token.roles;
      session.user.user = token.user;
      return session;
    }
  },

  pages: {
    signIn: "/auth?login",
  },
})