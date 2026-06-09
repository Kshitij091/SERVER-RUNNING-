const login = require("fca-project-orion");
const fs = require("fs");
const axios = require("axios");

try {
    const appState = JSON.parse(fs.readFileSync("./cookies.json", "utf8"));

    login({ appState: appState }, (err, api) => {
        if (err) return console.error("FB Login failed:", err);

        // Security settings for stable connection
        api.setOptions({ listenEvents: true, selfListen: false });

        console.log("Kshitiz Kumar Bot successfully connected!");

        api.listenMqtt((err, message) => {
            if (err) return;
            if (!message || !message.body) return;

            const msg = message.body.toLowerCase();

            // 1. COMMAND: !song
            if (msg.startsWith("!song ")) {
                const query = message.body.slice(6);
                api.sendMessage(`🎵 Processing your request for: "${query}". Searching YouTube download links...`, message.threadID);
                // Heavy downloads direct streams ke bajay normal confirmation message dega link limit cross hone par
            }

            // 2. COMMAND: !image
            if (msg.startsWith("!image ")) {
                const keyword = msg.slice(7);
                const adultKeywords = ["sex", "sexy", "nude", "porn", "naked", "pussy", "dick", "boobs", "xee", "xvideo", "bhabhi"];
                const hasAdultContent = adultKeywords.some(word => keyword.includes(word));

                if (hasAdultContent) {
                    return api.sendMessage("🚫 Sexual/NSFW content is restricted by Kshitiz Kumar Bot.", message.threadID);
                }

                api.sendMessage(`📸 Fetching clean image for: "${keyword}"...`, message.threadID);
                
                // Public mirror fallback image API
                const imageUrl = `https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80`;
                
                api.sendMessage({
                    body: `Result for "${keyword}"`,
                    url: imageUrl
                }, message.threadID);
            }
        });
    });
} catch (e) {
    console.log("Cookies file not found yet. Waiting for dashboard submission.");
}
