const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { exec } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Kshitiz Kumar Bot Dashboard</title>
        <style>
            body {
                margin: 0; padding: 0;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), 
                            url('https://picsum.photos/id/1004/1200/800') no-repeat center center fixed;
                background-size: cover;
                color: #fff;
                display: flex; justify-content: center; align-items: center;
                min-height: 100vh;
            }
            .container {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border-radius: 15px; padding: 30px;
                box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
                border: 1px solid rgba(255, 255, 255, 0.18);
                max-width: 500px; width: 100%; text-align: center;
            }
            h1 { font-size: 2.2rem; margin-bottom: 10px; color: #ff4b5c; text-shadow: 2px 2px 4px #000; }
            .info-box {
                background: rgba(0, 0, 0, 0.5);
                border-left: 5px solid #ff4b5c;
                padding: 15px; margin-bottom: 20px;
                text-align: left; border-radius: 4px;
            }
            .info-box h3 { margin: 0 0 5px 0; color: #ff6b81; }
            textarea {
                width: 100%; height: 100px;
                background: rgba(20, 20, 20, 0.7);
                border: 1px solid #ff4b5c; color: #fff;
                padding: 10px; border-radius: 5px; box-sizing: border-box; resize: none;
            }
            button {
                background: #ff4b5c; color: white; border: none;
                padding: 12px 25px; font-size: 1rem; border-radius: 5px;
                cursor: pointer; margin-top: 15px; width: 100%; transition: 0.3s;
            }
            button:hover { background: #ff6b81; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Kshitiz Kumar Bot</h1>
            <p>Facebook Automated Assistant</p>
            <div class="info-box">
                <h3>Bot Status</h3>
                <p>Features: Unlimited YouTube Songs, Safe Image Search (No NSFW)</p>
            </div>
            <form action="/start-bot" method="POST">
                <label style="display:block; text-align:left; margin-bottom:5px; color:#ff6b81;">Paste Facebook App State Cookies (JSON):</label>
                <textarea name="cookies" placeholder='[{"key": "c_user", "value": "..."}]' required></textarea>
                <button type="submit">Start Bot</button>
            </form>
        </div>
    </body>
    </html>
    `);
});

app.post('/start-bot', (req, res) => {
    try {
        fs.writeFileSync('./cookies.json', req.body.cookies);
        res.send("<h2>Cookies Saved! Starting Kshitiz Kumar Bot...</h2>");
        
        // Isse bot background me alag se chalega aur Render crash nahi hoga
        exec('node index.js', (err, stdout, stderr) => {
            if (err) console.error(`Error: ${err}`);
            console.log(`Stdout: ${stdout}`);
        });
    } catch (err) {
        res.send("Error: " + err.message);
    }
});

app.listen(PORT, () => {
    console.log(`Dashboard running on port ${PORT}`);
});
             
