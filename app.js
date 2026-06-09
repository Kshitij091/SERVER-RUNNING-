const express = require('express');
const bodyParser = require('body-parser');
const login = require('fca-project-orion');
const fs = require('fs');
const { exec } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Beautiful Couple Theme Dashboard Layout
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ᎷᎡ༒ᴋꜱʜɪᴛɪᴊ༒ Bot Dashboard</title>
        <style>
            body {
                margin: 0; padding: 0;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), 
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
            
            /* Input Boxes Styling at the Top */
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
            <h1>ᎷᎡ༒ᴋꜱʜɪᴛɪᴊ༒</h1>
            <div class="prefix-tag">Bot Prefix: .</div>
            
            <form action="/start-bot" method="POST">
                <!-- Box 1: Cookies -->
                <div class="input-box">
                    <label>📥 Box 1: Profile AppState Cookies (JSON)</label>
                    <textarea name="cookies" placeholder='[{"key": "c_user", "value": "..."}]' required></textarea>
                </div>

                <!-- Box 2: Profile UID -->
                <div class="input-box">
                    <label>👤 Box 2: Your Personal Profile UID</label>
                    <input type="text" name="userUID" placeholder="Enter your Facebook UID" required>
                </div>

                <!-- Box 3: Group Thread UID -->
                <div class="input-box">
                    <label>👥 Box 3: Target Facebook Group UID</label>
                    <input type="text" name="groupUID" placeholder="Enter Target Group Thread ID" required>
                </div>

                <button type="submit">🚀 Deploy & Run Bot</button>
            </form>
        </div>
    </body>
    </html>
    `);
});

// Post Route to save config and trigger index.js
app.post('/start-bot', (req, res) => {
    const { cookies, userUID, groupUID } = req.body;
    try {
        const configData = {
            userUID: userUID,
            groupUID: groupUID,
            cookies: JSON.parse(cookies)
        };
        
        // Configuration temporary save kar rahe hain bot ke read karne ke liye
        fs.writeFileSync('./bot_config.json', JSON.stringify(configData, null, 2));
        res.send("<h2>Configuration Saved! ᎷᎡ༒ᴋꜱʜɪᴛɪᴊ༒ Bot is starting in the background...</h2><p>Check Render logs to see real-time connection status.</p>");
        
        // Background execution so Render web service won't timeout
        exec('node index.js', (err, stdout, stderr) => {
            if (err) console.error(`Bot Error: ${err}`);
            console.log(`Bot Output: ${stdout}`);
        });
    } catch (e) {
        res.send("<h2>Error saving data. Please check JSON cookie format!</h2>");
    }
});

app.listen(PORT, () => {
    console.log(`Dashboard running on port ${PORT}`);
});
