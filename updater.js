const { google } = require("googleapis");

const VIDEO_ID = "u3iOcDlwnxM";
const TITLE_TEMPLATE = "This video has {views} views";

async function authorize() {
    const credentials = JSON.parse(process.env.CLIENT_SECRET);
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    const tokens = JSON.parse(process.env.TOKEN);
    oAuth2Client.setCredentials(tokens);
    return oAuth2Client;
}

async function getVideoDetails(youtube) {
    const response = await youtube.videos.list({
        part: ["snippet", "statistics"],
        id: [VIDEO_ID],
    });

    const video = response.data.items[0];

    return {
        title: video.snippet.title,
        categoryId: video.snippet.categoryId,
        viewCount: video.statistics.viewCount,
    };
}

async function updateTitle(youtube, newTitle, categoryId) {
    await youtube.videos.update({
        part: ["snippet"],
        requestBody: {
            id: VIDEO_ID,
            snippet: {
                title: newTitle,
                categoryId: categoryId,
            },
        },
    });
}

async function run() {
    const auth = await authorize();
    const youtube = google.youtube({ version: "v3", auth });

    const { categoryId, viewCount } = await getVideoDetails(youtube);
    const expectedTitle = TITLE_TEMPLATE.replace("{views}", Number(viewCount).toLocaleString());

    await updateTitle(youtube, expectedTitle, categoryId);
    console.log("Updated title to: " + expectedTitle);
}

run().catch(console.error);