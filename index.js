const login = require("fca-project-orion");
const fs = require("fs");
const axios = require("axios");

try {
    const config = JSON.parse(fs.readFileSync("./bot_config.json", "utf8"));
    const prefix = ".";

    login({ appState: config.cookies }, (err, api) => {
        if (err) return console.error("FB Login Failed:", err);

        api.setOptions({ listenEvents: true, selfListen: true });
        console.log("ᎷᎡ༒ᴋꜱʜɪᴛɪᴊ༒ Bot successfully active on group: " + config.groupUID);

        api.listenMqtt((err, message) => {
            if (err) return;
            if (!message || !message.body) return;
            
            // Check if the message belongs to the targeted group only
            if (message.threadID !== config.groupUID) return;

            const input = message.body.trim();
            if (!input.startsWith(prefix)) return;

            const command = input.slice(prefix.length).split(" ")[0].toLowerCase();
            const args = input.slice(prefix.length + command.length).trim();

            // 1. COMMAND: .couple
            if (command === "couple") {
                api.sendMessage("📸 Fetching romantic couple aesthetic picture...", message.threadID);
                const img = "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80";
                api.sendMessage({ body: "✨ ᎷᎡ༒ᴋꜱʜɪᴛɪᴊ༒ | Couple Pick", url: img }, message.threadID);
            }

            // 2. COMMAND: .funny
            if (command === "funny") {
                api.sendMessage("🤡 Fetching a funny meme/picture...", message.threadID);
                const img = "https://images.unsplash.com/photo-1531928351158-2f736078e0a1?auto=format&fit=crop&w=600&q=80";
                api.sendMessage({ body: "😆 ᎷᎡ༒ᴋꜱʜɪᴛɪᴊ༒ | Fun Element", url: img }, message.threadID);
            }

            // 3. COMMAND: .education
            if (command === "education") {
                api.sendMessage("📚 Fetching Educational/Inspirational graphic...", message.threadID);
                const img = "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80";
                api.sendMessage({ body: "📖 ᎷᎡ༒ᴋꜱʜɪᴛɪᴊ༒ | Knowledge Corner", url: img }, message.threadID);
            }

            // 4. COMMAND: .song
            if (command === "song") {
                if (!args) return api.sendMessage("⚠️ Please provide song name! Example: .song Tu Hi Re", message.threadID);
                api.sendMessage(`🎵 Processing audio for "${args}". Fetching from server cloud...`, message.threadID);
                // Group attachment trigger
            }
        });
    });
} catch (e) {
    console.log("Waiting for user to submit details via Dashboard form.");
                                }
