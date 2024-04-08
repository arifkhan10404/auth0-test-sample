const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const { auth } = require("express-oauth2-jwt-bearer");
const authConfig = require("./src/auth_config.json");

const app = express();

const port = process.env.API_PORT || 3001;
const appPort = process.env.SERVER_PORT || 3000;
const appOrigin = authConfig.appOrigin || `http://localhost:${appPort}`;

if (
  !authConfig.domain
  // !authConfig.audience ||
  // authConfig.audience === "https://dev-mx3agx3l5ebonpz4.us.auth0.com/api/v2/"
) {
  console.log(
    "Exiting: Please make sure that auth_config.json is in place and populated with valid domain and audience values"
  );

  process.exit();
}

app.use(morgan("dev"));
app.use(helmet());
app.use(cors({ origin: appOrigin }));

const checkJwt = auth({
  // secret: 'YMArohMaXXSfsEWmRvBZon5ITNDh3OWL',
  audience: 'https://dev-mx3agx3l5ebonpz4.us.auth0.com/api/v2/',
  issuerBaseURL: 'https://dev-mx3agx3l5ebonpz4.us.auth0.com/',
  // tokenSigningAlg: 'HS256'

});

app.get("/api/external", checkJwt, (req, res) => {
  res.send({
    msg: "Your access token was successfully validated!",
  });
});

app.get('/authorized', function (req, res) {
  res.send('Secured Resource');
});

app.get("/api/auth/redirect", (req, res) => {
  console.log("data..... ", {query: req.query, body: req.body, params: req.params, session: req.session})
  res.redirect(appOrigin);
});

app.listen(port, () => console.log(`API Server listening on port ${port}`));
