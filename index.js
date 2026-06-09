const login = require("fca-project-orion");
const fs = require("fs");
const axios = require("axios");

function startBotEngine() {
    try {
        if (!fs.existsSync("./bot_config.json")) {
            console.log("Config file not found. Waiting for dashboard...");
            return;
        }
        
        const raw = fs.readFileSync("./bot_config.json", "utf8");
        if (!raw || raw === '{}') {
            return console.log("Waiting for dashboard form credentials mapping...");
        }
        
        const config = JSON.parse(raw);
        const prefix = ".";

        if (!config.cookies || !config.groupUID) {
            return console.log("Missing cookies or Group UID in config.json");
        }

        login({ appState: config.cookies }, (err, api) => {
            if (err) return console.error("FB Login Error: ", err);

            // Setting options for stable listening
            api.setOptions({ 
                listenEvents: true, 
                selfListen: false, // Isko false rakhein taaki bot khud ke messages par trigger na ho
                online: true
            });
            
            console.log("ᎷᎡ༒ᴋꜱʜɪᴛɪz༒ Bot successfully synchronized with target chat group.");

            api.listenMqtt((err, message) => {
                if (err || !message || !message.body) return;
                
                // Ensure the message is from the configured group
                if (String(message.threadID) !== String(config.groupUID)) return;

                const input = message.body.trim();
                if (!input.startsWith(prefix)) return;

                const command = input.slice(prefix.length).split(" ")[0].toLowerCase();
                const args = input.slice(prefix.length + command.length).trim();

                if (command === "couple") {
                    const img = "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80";
                    api.sendMessage({ body: "✨ ᎷᎡ༒ᴋꜱʜɪᴛɪz༒ | Couple Theme", url: img }, message.threadID);
                }
                else if (command === "funny") {
                    const img = "https://images.unsplash.com/photo-1531928351158-2f736078e0a1?auto=format&fit=crop&w=600&q=80";
                    api.sendMessage({ body: "😆 ᎷᎡ༒ᴋꜱʜɪᴛɪz༒ | Joke Concept", url: img }, message.threadID);
                }
                else if (command === "education") {
                    const img = "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80";
                    api.sendMessage({ body: "📖 ᎷᎡ༒ᴋꜱʜɪᴛɪz༒ | Global Literacy", url: img }, message.threadID);
                }
                else if (command === "song") {
                    if (!args) return api.sendMessage("⚠️ Song name is mandatory!", message.threadID);
                    api.sendMessage(`🎵 Processing track request for "${args}". Synced with media relay server...`, message.threadID);
                }
            });
        });
    } catch(e) {
        console.error("Engine execution failure: ", e.message);
    }
}

// Exporting the function so server.js can start it directly
module.exports = { startBotEngine };

// If run directly via node index.js
if (require.main === module) {
    startBotEngine();
}
