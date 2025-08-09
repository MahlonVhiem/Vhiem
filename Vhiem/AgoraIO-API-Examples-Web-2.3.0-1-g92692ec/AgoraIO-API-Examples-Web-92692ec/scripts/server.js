const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const { RtcTokenBuilder, RtcRole } = require("agora-token");

// Load environment variables from .env file
dotenv.config();

// change the port if necessary
const PORT = process.env.PORT || 3001;
const URL = `http://localhost:${PORT}/index.html`;

const app = express();
app.use(express.json()); // Enable JSON body parsing

// Serve static files from the 'src' directory
const staticDir = path.join(__dirname, "../src");
app.use(express.static(staticDir));

// Agora token generation endpoint
app.post("/generate-agora-token", (req, res) => {
  const appID = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;

  if (!appID || !appCertificate) {
    return res.status(500).json({ error: "Agora App ID or App Certificate not configured in environment variables." });
  }

  const { channelName, uid, role, expireTime } = req.body;

  if (!channelName || uid === undefined || role === undefined || expireTime === undefined) {
    return res.status(400).json({ error: "Missing required parameters: channelName, uid, role, expireTime" });
  }

  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expireTime;

  let agoraRole;
  if (role === 'publisher') {
    agoraRole = RtcRole.PUBLISHER;
  } else if (role === 'audience') {
    agoraRole = RtcRole.SUBSCRIBER;
  } else {
    return res.status(400).json({ error: "Invalid role. Must be 'publisher' or 'audience'." });
  }

  const token = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, agoraRole, privilegeExpiredTs);

  res.json({ token: token });
});


app.listen(PORT, () => {
  console.info(`\n---------------------------------------\n`);
  console.info(`Agora Token Server running on port ${PORT}`);
  console.info(`Please visit: ${URL}`);
  console.info(`
---------------------------------------\n`);
});