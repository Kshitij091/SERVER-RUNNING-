const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { startBotEngine } = require('./index.js');

const app = express();
const PORT = process.env.PORT || 3000;
const configPath = path.join(__dirname, 'bot_config.json');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Create an empty config if it doesn't exist to prevent boot crash
if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify({}));
}

// Beautiful Couple Theme Dashboard Layout
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ᎷᎡ༒ᴋꜱʜɪᴛɪz༒ Bot Dashboard</title>
        <style>
            body {
                margin: 0; padding: 0;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), 
                            url('https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1200') no-repeat center center fixed;
                background-size: cover;
                display: flex; justify-content: center; align-items: center;
                min-height: 100vh; color: #fff;
            }
            .main-container {
                background: rgba(255, 255, 255, 0.12);
                backdrop-filter: blur(12px);
                border-radius: 20px; padding: 30px;
                box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4);
                max-width: 500px; width: 100%; text-align: center;
                border: 1px solid rgba(255, 255, 255, 0.25);
            }
            h1 { color: #ff4b5c; margin-bottom: 5px; font-size: 2.2rem; text-shadow: 2px 2px 4px #000; }
            .prefix-tag { background: #ff4b5c; display: inline-block; padding: 3px 10px; border-radius: 5px; font-size: 0.85rem; font-weight: bold; margin-bottom: 20px; }
            .input-box {
                background: rgba(0, 0, 0, 0.6);
                border: 1px solid #ff4b5c; border-radius: 8px;
                padding: 12px; margin-bottom: 15px; text-align: left;
            }
            .input-box label { display: block; font-weight: bold; color: #ff6b81; margin-bottom: 5px; font-size: 0.85rem; }
            .input-box input, .input-box textarea {
                width: 100%; padding: 8px; background: rgba(20, 20, 20, 0.5);
                border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 4px;
                color: #fff; box-sizing: border-box; font-size: 0.9rem;
            }
            .input-box textarea { resize: none; height: 80px; }
            button {
                background: #ff4b5c; color: white; border: none;
                padding: 14px; width: 100%; font-size: 1.1rem; font-weight: bold;
                border-radius: 8px; cursor: pointer; transition: 0.3s;
                box-shadow: 0 4px 15px rgba(255, 75, 92, 0.4);
            }
            button:hover { background: #ff6b81; }
        </style>
    </head>
    <body>
        <div class="main-container">
            <h1>ᎷᎡ༒ᴋꜱʜɪᴛɪz༒</h1>
            <div class="prefix-tag">Bot Prefix: .</div>
            <form action="/start-bot" method="POST">
                <div class="input-box">
                    <label>📥 :  AppState Cookies (JSON)</label>
                    <textarea name="cookies" placeholder='[{"key": "c_user", "value": "..."}]' required></textarea>
                </div>
                <div class="input-box">
                    <label>👤 :  Bot Profile UID</label>
                    <input type="text" name="userUID" placeholder="Enter your Facebook UID" required>
                </div>
                <div class="input-box">
                    <label>👥 : Target Facebook Group UID</label>
                    <input type="text" name="groupUID" placeholder="Enter Target Group Thread ID" required>
                </div>
                <button type="submit">🚀 Deploy & Run Bot</button>
            </form>
        </div>
    </body>
    </html>
    `);
});

app.post('/start-bot', (req, res) => {
    const { cookies, userUID, groupUID } = req.body;
    try {
        let parsedCookies;
        try {
            parsedCookies = JSON.parse(cookies);
        } catch (jsonErr) {
            return res.send("<h2>Error: Cookies ka format sahi nahi hai! Ek sahi JSON array paste karein.</h2>");
        }

        const configData = {
            userUID: userUID,
            groupUID: groupUID,
            cookies: parsedCookies
        };
        
        fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
        res.send("<h2>Configuration Saved Successfully! ᎷᎡ༒ᴋꜱʜɪᴛɪz༒ Bot background me initialize ho raha hai... Aap is tab ko close kar sakte hain.</h2>");
        
        // Non-blocking trigger to safe start
        setTimeout(() => {
            console.log("Dashboard trigger received. Starting bot engine...");
            startBotEngine();
        }, 1000);

    } catch (e) {
        res.send(`<h2>Error: ${e.message}</h2>`);
    }
});

// Render immediately binds the port to stay active
app.listen(PORT, () => {
    console.log(`Web Server is up and alive on port ${PORT}`);
    
    // Safely attempt an auto-boot if valid configuration already exists
    try {
        if (fs.existsSync(configPath)) {
            const raw = fs.readFileSync(configPath, 'utf8');
            if (raw && raw !== '{}') {
                const config = JSON.parse(raw);
                if (config.cookies && config.groupUID) {
                    console.log("Existing configuration detected. Booting engine automatically...");
                    startBotEngine();
                }
            }
        }
    } catch (err) {
        console.log("Automatic initialization skipped. Waiting for user input via dashboard...");
    }
});
             
