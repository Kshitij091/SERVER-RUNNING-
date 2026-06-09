const login = require("fca-project-orion");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

function startBotEngine() {
    try {
        const configPath = path.join(__dirname, 'bot_config.json');
        
        if (!fs.existsSync(configPath)) {
            console.log("Engine Info: bot_config.json missing. Waiting for dashboard configuration...");
            return;
        }
        
        const raw = fs.readFileSync(configPath, "utf8");
        if (!raw || raw === '{}') {
            console.log("Engine Info: Credentials not mapped yet. Complete the web form to synchronize.");
            return;
        }
        
        const config = JSON.parse(raw);
        const prefix = ".";

        if (!config.cookies || !config.groupUID) {
            console.log("Engine Warning: Missing cookies or groupUID within layout settings.");
            return;
        }

        login({ appState: config.cookies }, (err, api) => {
            if (err) {
                console.error("FB Login Error tracker: ", err.message || err);
                return; // Crash block added here to prevent status 1 failure
            }

            api.setOptions({ 
                listenEvents: true, 
                selfListen: false, // Isko false rakha hai taaki bot khud ke text par loop na kare
                online: true 
            });
            
            console.log("ᎷᎡ༒ᴋꜱʜɪᴛɪz༒ Bot successfully synchronized with target chat group.");

            api.listenMqtt((err, message) => {
                if (err || !message || !message.body) return;
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
        console.error("Engine internal exception: ", e.message);
    }
}

module.exports = { startBotEngine };

if (require.main === module) {
    startBotEngine();
}
