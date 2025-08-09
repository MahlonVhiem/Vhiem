const dotenv = require("dotenv");
const { RtcTokenBuilder, RtcRole } = require("agora-token");

dotenv.config(); // Load environment variables

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const appID = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;

  if (!appID || !appCertificate) {
    return { statusCode: 500, body: "Agora App ID or App Certificate not configured." };
  }

  try {
    const { channelName, uid, role, expireTime } = JSON.parse(event.body);

    if (!channelName || uid === undefined || role === undefined || expireTime === undefined) {
      return { statusCode: 400, body: "Missing required parameters." };
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expireTime;

    let agoraRole;
    if (role === 'publisher') {
      agoraRole = RtcRole.PUBLISHER;
    } else if (role === 'audience') {
      agoraRole = RtcRole.SUBSCRIBER;
    } else {
      return { statusCode: 400, body: "Invalid role. Must be 'publisher' or 'audience'." };
    }

    const token = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, agoraRole, privilegeExpiredTs);

    return {
      statusCode: 200,
      body: JSON.stringify({ token: token }),
    };
  } catch (error) {
    console.error("Error generating token:", error);
    return { statusCode: 500, body: "Failed to generate token." };
  }
};
