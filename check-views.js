const { google } = require("googleapis");
const fs = require("fs");

const TOKEN_PATH = "token.json";
const SECRET_PATH = "client_secret.json";
const VIDEO_ID = "u3iOcDlwnxM";

async function authorize() {
    const credentials = JSON.parse(fs.readFileSync(SECRET_PATH));
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH));
    oAuth2Client.setCredentials(tokens);
    return oAuth2Client;
}

async function check() {
    const auth = await authorize();
    const youtube = google.youtube({ version: "v3", auth });

    const response = await youtube.videos.list({
        part: ["snippet", "statistics"],
        id: [VIDEO_ID],
    });

    const video = response.data.items[0];

    console.log("=== API Response ===");
    console.log("Title:", video.snippet.title);
    console.log("View Count:", video.statistics.viewCount);
    console.log("Like Count:", video.statistics.likeCount);
    console.log("Comment Count:", video.statistics.commentCount);
    console.log("===================");
}

check().catch(console.error);