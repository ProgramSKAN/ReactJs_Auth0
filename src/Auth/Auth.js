import auth0 from "auth0-js";
//https://auth0.github.io/auth0.js/index.html

const REDIRECT_ON_LOGIN = "redirect_on_login";

export default class Auth {
  constructor(history) {
    //pass history to perform redirects
    this.history = history;
    this.userProfile = null;
    this.requestedScopes = "openid profile email read:courses";
    this.auth0 = new auth0.WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      redirectUrl: process.env.REACT_APP_AUTH0_CALLBACK_URL,
      audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      responseType: "token id_token", //give us a JWT token to authenticate the use when they login
      //scope: "openid profile email read:courses",
      scope: this.requestedScopes,
      //you get Openid Claims: iss-issuer,sub-subject,aud-Audience,exp-ExpirationTime,ndf-NotBefore,iat-IssuedAt
      //profile : user profile data like name,picture, nickname,updatedDate,gender,locale,.. comes from different identity providers like GOOGLE,FACEBOOK,..
      //email: when the user signs-up, they'll be presented with a consent screen sothey can consent to us using this data.
      //in Auth0>application>permission/scope>add scope >read:courses =permisioon to read courses
    });
  }

  login = () => {
    localStorage.setItem(
      REDIRECT_ON_LOGIN,
      JSON.stringify(this.history.location)
    );
    this.auth0.authorize(); //this will redirect browser to auth0 login page
  };

  handleAuthentication = (history) => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        const redirectLocation =
          localStorage.getItem(REDIRECT_ON_LOGIN) === "undefined"
            ? "/"
            : JSON.parse(localStorage.getItem(REDIRECT_ON_LOGIN));
        //this.history.push("/");
        this.history.push(redirectLocation);
      } else if (err) {
        this.history.push("/");
        alert(`Error:${err.error}.Check the console for futher details.`);
        console.log(err);
      }
      localStorage.removeItem(REDIRECT_ON_LOGIN);
    });
  };
  setSession = (authResult) => {
    //set the time that access token will expire
    const expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    //unix epoch=MilliSeconds from JAN 1 1970
    localStorage.setItem("access_token", authResult.accessToken);
    localStorage.setItem("id_token", authResult.idToken);
    localStorage.setItem("expires_at", expiresAt);

    //if there is a value on 'scope' param from authResult, use it to set scopes in the session for the user.
    //Otherwise, use scopes as requested.if no scopes were requested, set it to nothing.
    const scopes = authResult.scope || this.requestedScopes || "";
    localStorage.setItem("scopes", JSON.stringify(scopes));
  };

  isAuthenticated() {
    const expiresAt = JSON.parse(localStorage.getItem("expires_at"));
    return new Date().getTime() < expiresAt;
    //Date().getTime() ---->unix epoch
  }

  logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("scopes");
    //this doesn't actually kill the session in auth0 server
    //this is "soft logout".this is useful for single-sign on scenarios, so your session stays valid for other apps using this Auth0 tenant.
    //Note: Auth0 checks session cookie on your Auth0 domain to determine is you're loggedin
    //to see session cookie thats being checked when you click login, load your JSON web key address on your Auth0 domain.
    //Ex: https://react-auth0-skan.us.auth0.com/.well-known/jwks.json   or check in chrome>devtools>cookie
    //Under cookies, the Auth0 cookie with your domain is your session cookie.so, Auth0 is checking this cookie and if it finds you session still active on server, it doesn't display login screen.instead it automatically logs you in.

    this.userProfile = null;
    //to logout the user on server
    this.auth0.logout({
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      returnTo: "http://localhost:3000", //redirect to after logout is completed
    }); //For this to work : enter "Allowed Logout URLs":"http://localhost:3000" in Auth0

    this.history.push("/");
  };

  getAccessToken = () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      throw new Error("No access token found");
    }
    return accessToken;
  };

  getProfile = (cb) => {
    if (this.userProfile) return cb(this.userProfile);
    this.auth0.client.userInfo(this.getAccessToken(), (err, profile) => {
      if (profile) this.userProfile = profile;
      cb(profile, err);
    });
  };

  userHasScopes(scopes) {
    const grantedScopes = (
      JSON.parse(localStorage.getItem("scopes")) || ""
    ).split(" ");
    return scopes.every((scope) => grantedScopes.includes(scope));
  }
}

//http://localhost:3000/callback#
// access_token=VJ9ijuaFyLctI5WVh2KXagmL0l&scope=openid%20profile%20email
// &expires_in=7200  in seconds
// &token_type=Bearer
// &state=Vg.yfGZe8hcJKBcCajU26q5CeI.hrIwh  -->>entrypted secret value used by auth0 to know you are the originating application
// &id_token=eyJhbGciOiJS.UzI1NiIsInR5cCI.6IkpXVCIsImtpZCI6I
