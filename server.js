const express = require("express");
require("dotenv").config(); //to access environment variables within this file
const jwt = require("express-jwt"); //validate JWT and set req.user
const jwksRsa = require("jwks-rsa"); //Retrieve RSA keys from JSON web key set (JWKS) endpoint
const checkScope = require("express-jwt-authz"); //Validates JWT Scopes

//verifying JWT
//step1:verify signature
//step2:validate claims

//step1:
//to verify JWT signature,Auth0 exposes JSON web-key-set at a url https://YOUR_AUTH0_DOMAIN/.well-known/jwks.json`
//JSON web key is a json object that represents a cryptographic key.the members of the object repesents properties of a key including its value.
//your api will use this info in above url to verify jwt signature, to assure jwt is valid.
//https://auth0.com/docs/tokens/json-web-tokens/json-web-key-sets

//step2:
//validate 3 standard claims in token payload
//1.exp-Expiration-Confirm it hasn't expired
//2.iss-IssuedBy-Confirm it matches you Auth0 domain
//3.aud-Audience-Confirm it matches your ClientID

const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header
  // and the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true, // cache the signing key
    rateLimit: true,
    jwksRequestsPerMinute: 5, // prevent attackers from requesting more than 5 per minute
    jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer.
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,

  // This must match the algorithm selected in the Auth0 dashboard under your app's advanced settings under the OAuth tab
  algorithms: ["RS256"],
});

const app = express();

app.get("/public", function (req, res) {
  res.json({
    message: "Hello from public api",
  });
});

app.get("/private", checkJwt, function (req, res) {
  res.json({
    message: "Hello from private api",
  });
});

app.get(
  //only accessible to the user with read:courses scope/permission
  "/courses",
  checkJwt,
  checkScope(["read:courses"]),
  function (req, res) {
    res.json({
      courses: [
        { id: 1, title: "ReactJs" },
        { id: 1, title: ".Net Core" },
        { id: 1, title: "Big Data" },
        { id: 1, title: "Machine Learning" },
      ],
    });
  }
);

function checkRole(role) {
  //express middleware
  return function (req, res, next) {
    const assignedRoles = req.user["http://localhost:3000/roles"];
    if (Array.isArray(assignedRoles) && assignedRoles.includes(role)) {
      return next();
    } else {
      return res.status(401).send("insuffiecient role");
    }
  };
}
app.get("/admin", checkJwt, checkRole("admin"), function (req, res) {
  res.json({
    message: "Hello from admin api",
  });
});

app.listen(3001);
console.log("API server listening on " + process.env.REACT_APP_AUTH0_AUDIENCE);
