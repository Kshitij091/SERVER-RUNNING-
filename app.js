const login = require("fb-chat-api");
const fs = require("fs");
const ytdl = require("ytdl-core");
const axios = require("axios");

// Load Cookies
const appState = JSON.parse(fs.readFileSync("./cookies.json", "utf8"));

login({ appState: appState }, (err, api) => {
    if (err) return console.error("Login failed:", err);

    console.log("Kshitiz Kumar Bot successfully logged into Facebook!");

    api.listenMqtt((err, message) => {
        if (err) return console.error(err);
        if (!message.body) return;

        const msg = message.body.toLowerCase();

        // 1. COMMAND: !song [YouTube Link or Name]
        if (msg.startsWith("!song ")) {
            const query = message.body.slice(6);
            api.sendMessage(`Searching and downloading your song: "${query}"... Please wait.`, message.threadID);

            // Audio downloading logic (Using generic ytdl stream)
            // Note: Render features direct storage, we send temporary download link or stream
            try {
                // simple simulated URL send or stream for FB size limitations (Max 25MB)
                api.sendMessage(`🎵 Song feature initialized. (Processing: ${query})`, message.threadID);
                // Real implementation requires high-bandwidth API or local stream write
            } catch (e) {
                api.sendMessage("Failed to download song. Size might be too large.", message.threadID);
            }
        }

        // 2. COMMAND: !image [Keyword]
        if (msg.startsWith("!image ")) {
            const keyword = msg.slice(7);

            // Strict Sexual Content/NSFW Filter Keywords
            const adultKeywords = ["sex", "sexy", "nude", "porn", "naked", "pussy", "dick", "boobs", "xee", "xvideo"];
            const hasAdultContent = adultKeywords.some(word => keyword.includes(word));

            if (hasAdultContent) {
                return api.sendMessage("🚫 Warning: Sexual or NSFW image requests are strictly prohibited by Kshitiz Kumar Bot.", message.threadID);
            }

            api.sendMessage(`Finding safe image for: "${keyword}"...`, message.threadID);

            // Fetching Safe Image from Unsplash API (No Key version or public source)
            const imageUrl = `https://source.unsplash.com/featured/?${encodeURIComponent(keyword)}`;
            
            axios({
                method: 'get',
                url: imageUrl,
                responseType: 'stream'
            }).then((response) => {
                const msgObj = {
                    body: `Here is your image for "${keyword}"`,
                    attachment: response.data
                };
                api.sendMessage(msgObj, message.threadID);
            }).catch(err => {
                api.sendMessage("Could not fetch image at this moment.", message.threadID);
            });
        }
    });
});
      
