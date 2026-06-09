const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express().use(bodyParser.json());

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "kshitiz_secret_token";

// Webhook validation for Facebook
app.get('/webhook', (req, res) => {
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

// Handling messages
app.post('/webhook', (req, res) => {
    let body = req.body;

    if (body.object === 'page') {
        body.entry.forEach(function(entry) {
            let webhook_event = entry.messaging[0];
            let sender_psid = webhook_event.sender.id;

            if (webhook_event.message && webhook_event.message.text) {
                handleMessage(sender_psid, webhook_event.message.text.toLowerCase());
            }
        });
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});

// Logic based on keywords
function handleMessage(sender_psid, received_message) {
    let response;

    if (received_message.includes('hi') || received_message.includes('hello')) {
        response = { "text": "Hello! Main hoon Kshitiz Kumar ka Bot. Aapko kya chahiye? \nType kijiye: 'song' ya 'funny'" };
        callSendAPI(sender_psid, response);
    } 
    else if (received_message.includes('song')) {
        // Audio attachment (Aap apni pasand ka mp3 link daal sakte hain)
        response = {
            "attachment": {
                "type": "audio",
                "payload": {
                    "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                    "is_reusable": true
                }
            }
        };
        callSendAPI(sender_psid, response);
    } 
    else if (received_message.includes('funny')) {
        // Funny Image attachment
        response = {
            "attachment": {
                "type": "image",
                "payload": {
                    "url": "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?q=80&w=500", // Yahan koi bhi funny meme ka direct URL daal dein
                    "is_reusable": true
                }
            }
        };
        callSendAPI(sender_psid, response);
    } 
    else {
        response = { "text": `Aapne kaha: "${received_message}". Mujhe samajh nahi aaya. 'song' ya 'funny' try karein.` };
        callSendAPI(sender_psid, response);
    }
}

// Sending the message via Facebook Graph API
function callSendAPI(sender_psid, response) {
    let request_body = {
        "recipient": { "id": sender_psid },
        "message": response
    };

    request({
        "uri": "https://graph.facebook.com/v19.0/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('Message sent successfully!');
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Kshitiz Bot is listening on port ${PORT}`));
          
